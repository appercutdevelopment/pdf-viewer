# PDF Viewer (PDF Lite) — Engineering Charter

A VS Code extension, published as "PDF Lite" (package `pdf-lite`), that opens `.pdf` files in a
custom editor backed by Mozilla's PDF.js: page navigation, zoom, search, text selection, outline,
thumbnails and print. PDF.js is fetched by the `postinstall` script, not committed as a dependency.

## Before architecting or implementing
Read, in order: README.md, docs/plan.md, docs/decisions/ (the ADRs).

## While working
- **Story first.** Every slice starts from a GitHub story issue. Every PR says `Closes #<story>` or
  `Contributes to #<story>`. Agents open PRs; they never merge them and never push to `main`.
- **Commits:** Conventional Commits whose body explains why. No AI or tool attribution.
- **Checks:** `npm run compile` must pass. There is no test suite or CI yet.
- **Tests:** every behaviour change has a test; every bug fix has a test that fails without the fix.
- **Plan and decisions:** keep docs/plan.md current and work in vertical slices. Record non-obvious
  or costly-to-reverse decisions as ADRs in docs/decisions/ (template:
  docs/decisions/0000-adr-template.md).
- **Docs** change in the same PR as the code, describe the system as it is, and say "the user", not
  a person's name.
- **The user decides.** Present evidence and a recommendation. Never round an unchecked box up to
  "done".

## Definition of Done
- [ ] Rules followed, or the deviation recorded as an ADR
- [ ] Tests added or updated for the behaviour changed
- [ ] Docs current; real decisions recorded
- [ ] `npm run compile` green
- [ ] Anything surprising is written down (ADR or the PR's Lessons line)
