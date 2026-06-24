import * as vscode from 'vscode';
import { PdfEditorProvider } from './pdfEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(PdfEditorProvider.register(context));
}

export function deactivate() {}
