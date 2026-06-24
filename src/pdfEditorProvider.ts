import * as vscode from 'vscode';

export class PdfEditorProvider implements vscode.CustomReadonlyEditorProvider {

    static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            'pdfViewer.pdf',
            new PdfEditorProvider(context),
            {
                webviewOptions: { retainContextWhenHidden: true },
                supportsMultipleEditorsPerDocument: false
            }
        );
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(uri: vscode.Uri): Promise<vscode.CustomDocument> {
        return { uri, dispose: () => {} };
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel
    ): Promise<void> {
        try {
            await this.renderPdf(document, webviewPanel);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            webviewPanel.webview.html = this.errorPage(document.uri, message);
        }
    }

    private async renderPdf(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel
    ): Promise<void> {
        const ext = this.context.extensionUri;

        // Only the bundled PDF.js assets need webview access — the PDF itself
        // is read in the extension process and sent as data, not fetched by URL.
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(ext, 'media')]
        };

        // Read the PDF on the Node side and base64-encode for postMessage transport.
        // PDF.js rejects non-http(s) URLs, so we pass raw bytes via PDFViewerApplication.open({ data }).
        const pdfBytes = await vscode.workspace.fs.readFile(document.uri);

        const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

        const viewerHtmlPath = vscode.Uri.joinPath(ext, 'media', 'pdfjs', 'web', 'viewer.html');
        const viewerFileBytes = await vscode.workspace.fs.readFile(viewerHtmlPath);
        let html = Buffer.from(viewerFileBytes).toString('utf8');

        const baseUri = webviewPanel.webview
            .asWebviewUri(vscode.Uri.joinPath(ext, 'media', 'pdfjs', 'web'))
            .toString();

        // Remove PDF.js's own CSP meta — it conflicts with VS Code's webview sandbox.
        html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '');

        // Prepend to <head>:
        //   1. <base> so all relative viewer assets (viewer.mjs, viewer.css …) resolve correctly.
        //   2. A listener that waits for PDF.js to signal it is ready, then feeds it the PDF bytes.
        const injection = `<base href="${baseUri}/">
  <script>
    (function () {
      var pendingBase64 = null;
      var viewerReady   = false;

      function openFromBase64(b64) {
        var binary = atob(b64);
        var bytes  = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        window.PDFViewerApplication.open({ data: bytes });
      }

      // Messages from the VS Code extension arrive here.
      window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'loadPdf') {
          if (viewerReady) {
            openFromBase64(event.data.base64);
          } else {
            pendingBase64 = event.data.base64;
          }
        }
      });

      // 'webviewerloaded' fires once PDF.js has created PDFViewerApplication.
      // Wait for initializedPromise before calling open().
      document.addEventListener('webviewerloaded', function () {
        window.PDFViewerApplication.initializedPromise.then(function () {
          viewerReady = true;
          if (pendingBase64) {
            openFromBase64(pendingBase64);
            pendingBase64 = null;
          }
        });
      });
    })();
  </script>`;

        html = html.replace('<head>', `<head>\n  ${injection}`);
        webviewPanel.webview.html = html;

        // VS Code queues postMessages until the webview JS is ready to receive them.
        webviewPanel.webview.postMessage({ type: 'loadPdf', base64: pdfBase64 });
    }

    private errorPage(uri: vscode.Uri, message: string): string {
        const filename = uri.path.split('/').pop() ?? uri.path;
        return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;color:#ccc;background:#1e1e1e;">
            <h2 style="color:#f48771;">Could not open PDF</h2>
            <p><strong>${filename}</strong></p>
            <p style="color:#999;">${message}</p>
        </body></html>`;
    }
}
