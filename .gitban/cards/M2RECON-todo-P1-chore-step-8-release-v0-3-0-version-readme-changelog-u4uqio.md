# step 8: Release v0.3.0 — version, README, CHANGELOG

Integration/release card. Bumps the version, documents the new additive surface, and records release notes. **Depends on ALL code cards (steps 2B–7).** Per RELEASING.md this is a minor bump (additive). Roadmap: m2/s5.

## Cleanup Scope & Context

* **Sprint/Release:** M2RECON → v0.3.0
* **Primary Feature Work:** All M2 reconciliation + search-surface additions
* **Cleanup Category:** Release packaging (version + docs)

**Required Checks:**
* [ ] Sprint/Release is identified above.
* [ ] Primary feature work that generated this cleanup is documented.

## Required Reading

| What | Where |
| :--- | :--- |
| Versioning policy | RELEASING.md:51-52 (pre-1.0: breaking bumps minor; these are additive) |
| Current version | package.json:3 (`0.2.1`) |
| Surface to document | design doc Interface Design table (docs/designs/m2-1.0-...) |
| README | README.md (errors, auth, filtering, pagination sections) |

## Deferred Work Review

* [ ] Reviewed commit messages for "TODO" and "FIXME" comments added during sprint.
* [ ] Reviewed PR comments for "out of scope" or "follow-up needed" discussions.
* [ ] Reviewed code for new TODO/FIXME markers (grep for them).
* [ ] Checked team chat/standup notes for deferred items.

| Cleanup Category | Specific Item / Location | Priority | Justification for Cleanup |
| :--- | :--- | :---: | :--- |
| **Configuration** | package.json version 0.2.1 → 0.3.0 | P1 | Minor bump for additive surface |
| **Documentation** | README — new surface undocumented | P1 | Consumers need the new capabilities documented |
| **Documentation** | CHANGELOG.md — v0.3.0 entry | P1 | Release notes per RELEASING.md |

## Cleanup Checklist

### Documentation Updates (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **package.json** | bump version 0.2.1 → 0.3.0 | - [ ] |
| **README** | document: both-envelope errors, RateLimitSnapshot, authMode x-api-key, filter DSL (f), recall include, searchAll, resolveSuperseded | - [ ] |
| **CHANGELOG.md** | add [0.3.0] entry listing the additive surface + spec corrections | - [ ] |

### Build & CI/CD (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Full gate** | `npm run typecheck && npm test && npm run build` green on the integrated tree | - [ ] |
| **types-sync** | `npm run check:types-sync` passes (from step 7) | - [ ] |

## Definition of Done

### Intent

A user installing `@xtraceai/memory@0.3.0` sees a version, README, and changelog that accurately reflect everything this sprint added — the hardened error handling, rate-limit visibility, the `x-api-key` opt-in, the filter DSL, recall `include`, `searchAll`, and the superseded resolver — with the additive (non-breaking) nature called out. If broken, a consumer upgrading would have no documentation for the new surface or a misleading version.

### Observable outcomes

- [ ] `package.json` version is `0.3.0`.
- [ ] README documents each new public surface with a short example (errors both-shape, RateLimitSnapshot, authMode, `f` filter DSL, recall `include`, `searchAll`, `resolveSuperseded`).
- [ ] `CHANGELOG.md` has a `[0.3.0]` entry listing the additive surface + the spec corrections, flagged non-breaking.
- [ ] **Capstone:** on the fully-integrated tree, `npm run typecheck && npm test && npm run build` all pass and `npm run check:types-sync` exits 0 — the released package builds clean with every M2 card integrated.

## Validation & Closeout

### Pre-Completion Verification

| Verification Task | Status / Evidence |
| :--- | :--- |
| **All P0 Items Complete** | N/A |
| **All P1 Items Complete or Ticketed** | All code cards merged before this |
| **Tests Passing** | full gate green |
| **No New Warnings** | typecheck clean |
| **Documentation Updated** | README + CHANGELOG |
| **Code Review** | dispatch reviewer |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Remaining P2 Items** | none |
| **Recurring Issues** | none |
| **Process Improvements** | none |
| **Technical Debt Tickets** | none |

### Completion Checklist

<!-- gate0: upper-checklist -->

* [ ] All P0 items are complete and verified. <!-- cite: none -->
* [ ] All P1 items are complete or have follow-up tickets created. <!-- cite: none -->
* [ ] P2 items are complete or explicitly deferred with tickets. <!-- cite: none -->
* [ ] All tests are passing (unit, integration, and regression). <!-- cite: none -->
* [ ] No new linter warnings or errors introduced. <!-- cite: none -->
* [ ] All documentation updates are complete and reviewed. <!-- cite: none -->
* [ ] Code changes (if any) are reviewed and merged. <!-- cite: none -->
* [ ] Follow-up tickets are created and prioritized for next sprint. <!-- cite: none -->
* [ ] Team retrospective includes discussion of cleanup backlog (if significant). <!-- cite: none -->
