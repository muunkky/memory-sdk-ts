# step 7: Type-surface source-of-truth fix, regen, guard

Implements ADR-002 C1. Corrects the phantom `openapi/memory_v2.json` reference, regenerates the generated types from the corrected spec, and adds a reproducibility guard. **DEPENDS ON step 2A** (regen must reflect the corrected spec). Roadmap: m2/s5/type-surface-finalization.

## Cleanup Scope & Context

* **Sprint/Release:** M2RECON → v0.3.0
* **Primary Feature Work:** Type-surface finalization — fix SoT ref, regen reference, guard drift
* **Cleanup Category:** Mixed (code comment + generated artifact + build script)

**Required Checks:**
* [ ] Sprint/Release is identified above.
* [ ] Primary feature work that generated this cleanup is documented.

## Required Reading

| What | Where |
| :--- | :--- |
| ADR-002 + design KD-8 | docs/adr/ADR-002-...; docs/designs/m2-1.0-...(KD-8 + Phase 5) |
| Phantom ref | src/types.ts:1-2 (`openapi/memory_v2.json` — does not exist) |
| gen:types script | package.json:49 (`openapi-typescript spec/memory.json -o src/generated/types.ts`) |
| prepublish gate | package.json:51 (`prepublishOnly`) |
| generated reference | src/generated/types.ts (committed, operation-shaped, unimported) |

## Deferred Work Review

* [ ] Reviewed commit messages for "TODO" and "FIXME" comments added during sprint.
* [ ] Reviewed PR comments for "out of scope" or "follow-up needed" discussions.
* [ ] Reviewed code for new TODO/FIXME markers (grep for them).
* [ ] Checked team chat/standup notes for deferred items.

| Cleanup Category | Specific Item / Location | Priority | Justification for Cleanup |
| :--- | :--- | :---: | :--- |
| **Code comment** | src/types.ts:1-2 references nonexistent openapi/memory_v2.json | P1 | SoT pointer is false; gen instruction unfollowable |
| **Generated artifact** | src/generated/types.ts stale vs corrected spec | P1 | Reference must reflect 1.0 spec (no UpdateRequest) |
| **Build script** | no guard that generated stays in sync with spec | P1 | Silent drift between reference and spec |
| **Roadmap note** | wire-generated-types note repeats phantom ref | P2 | Keep docs honest |

## Cleanup Checklist

### Documentation Updates (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **src/types.ts header** | Replace openapi/memory_v2.json → spec/memory.json | - [ ] |
| **Roadmap note** | Update wire-generated-types note to spec/memory.json | - [ ] |

### Build & CI/CD (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Regen generated types** | `npm run gen:types` AFTER step 2A spec edits | - [ ] |
| **Reproducibility guard** | add `check:types-sync` = `npm run gen:types && git diff --exit-code -- src/generated/types.ts`; chain into prepublishOnly | - [ ] |
| **Version note** | record openapi-typescript version (avoid spurious guard fails on dep bump) | - [ ] |

### Testing & Quality (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Guard proves out** | clean tree passes `npm run check:types-sync`; a hand-edit fails it | - [ ] |

## Definition of Done

### Intent

A maintainer running `npm run gen:types` gets exactly what the source comment promises (it points at the real `spec/memory.json`), the committed generated reference reflects the reconciled 1.0 spec (no dead `UpdateRequest`), and an automated check fails loudly if the committed reference ever drifts out of sync with the spec. If broken, a future regen would target a phantom file or the generated reference would silently diverge from the spec with nobody noticing.

### Observable outcomes

- [ ] `grep -rn "openapi/memory_v2.json" .` returns nothing (phantom ref gone from src/types.ts header and the roadmap note).
- [ ] `npm run gen:types` runs clean from `spec/memory.json`; the regenerated `src/generated/types.ts` contains no `UpdateRequest`.
- [ ] `check:types-sync` script exists and is chained into `prepublishOnly`.
- [ ] **Capstone:** on a clean tree `npm run check:types-sync` exits 0; after a manual edit to `src/generated/types.ts` (or a spec change without regen) it exits non-zero — proving the guard detects drift. (`npm run typecheck && npm test && npm run build` green.)

## Validation & Closeout

### Pre-Completion Verification

| Verification Task | Status / Evidence |
| :--- | :--- |
| **All P0 Items Complete** | N/A — no P0 |
| **All P1 Items Complete or Ticketed** | SoT ref + regen + guard |
| **Tests Passing** | local gate green |
| **No New Warnings** | typecheck clean |
| **Documentation Updated** | header + roadmap note |
| **Code Review** | dispatch reviewer |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Remaining P2 Items** | Conformance assertions (expectAssignable) optional follow-up per ADR-002 |
| **Recurring Issues** | None |
| **Process Improvements** | Guard in prepublish prevents future drift |
| **Technical Debt Tickets** | None |

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
