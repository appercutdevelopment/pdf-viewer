# PDF Viewer (PDF Lite) — Engineering Charter

This project follows Company Knowledge (OKF bundle at /Volumes/KINGSTON/OKF). No exceptions.

## Before architecting or implementing
1. Read /standards/index.md — architecture, delivery, ways-of-working, testing, documentation.
2. No stack playbook exists yet for TypeScript/VS Code extensions under /stacks/ — author one there
   if this work is the first to need it (see project-starter.md's "author only when first needed" rule).
3. Read this project's profile: /projects/pdf-viewer.md

## While working
- Keep docs/plan.md current — work in vertical slices and iterations per /standards/delivery.md.
- Record non-obvious or costly-to-reverse decisions as ADRs in docs/decisions/
  (template: docs/decisions/0000-adr-template.md). Follow /standards/decision-records.md.
- Follow the architecture principles and the chosen stack's conventions.

## Definition of Done
Enforce the shared gate in /standards/ways-of-working.md (per change) and the iteration
gate in /standards/delivery.md before calling anything done.
