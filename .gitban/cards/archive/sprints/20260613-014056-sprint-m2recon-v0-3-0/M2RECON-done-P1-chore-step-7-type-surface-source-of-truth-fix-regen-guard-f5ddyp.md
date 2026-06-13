# step 7: Type-surface source-of-truth fix, regen, guard

Implements ADR-002 C1. Corrects the phantom `openapi/memory_v2.json` reference, regenerates the generated types from the corrected spec, and adds a reproducibility guard. **DEPENDS ON step 2A** (regen must reflect the corrected spec). Roadmap: m2/s5/type-surface-finalization.

## Cleanup Scope & Context

* **Sprint/Release:** M2RECON → v0.3.0
* **Primary Feature Work:** Type-surface finalization — fix SoT ref, regen reference, guard drift
* **Cleanup Category:** Mixed (code comment + generated artifact + build script)

**Required Checks:**
- [x] Sprint/Release is identified above.
- [x] Primary feature work that generated this cleanup is documented.

## Required Reading

| What | Where |
| :--- | :--- |
| ADR-002 + design KD-8 | docs/adr/ADR-002-...; docs/designs/m2-1.0-...(KD-8 + Phase 5) |
| Phantom ref | src/types.ts:1-2 (`openapi/memory_v2.json` — does not exist) |
| gen:types script | package.json:49 (`openapi-typescript spec/memory.json -o src/generated/types.ts`) |
| prepublish gate | package.json:51 (`prepublishOnly`) |
| generated reference | src/generated/types.ts (committed, operation-shaped, unimported) |

## Deferred Work Review

- [x] Reviewed commit messages for "TODO" and "FIXME" comments added during sprint.
- [x] Reviewed PR comments for "out of scope" or "follow-up needed" discussions.
- [x] Reviewed code for new TODO/FIXME markers (grep for them).
- [x] Checked team chat/standup notes for deferred items.

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
| **src/types.ts header** | Replace openapi/memory_v2.json → spec/memory.json | - [x] |
| **Roadmap note** | Update wire-generated-types note to spec/memory.json | - [x] |

### Build & CI/CD (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Regen generated types** | `npm run gen:types` AFTER step 2A spec edits | - [x] |
| **Reproducibility guard** | add `check:types-sync` = `npm run gen:types && git diff --exit-code -- src/generated/types.ts`; chain into prepublishOnly | - [x] |
| **Version note** | record openapi-typescript version (avoid spurious guard fails on dep bump) | - [x] |

### Testing & Quality (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Guard proves out** | clean tree passes `npm run check:types-sync`; a hand-edit fails it | - [x] |

## Definition of Done

### Intent

A maintainer running `npm run gen:types` gets exactly what the source comment promises (it points at the real `spec/memory.json`), the committed generated reference reflects the reconciled 1.0 spec (no dead `UpdateRequest`), and an automated check fails loudly if the committed reference ever drifts out of sync with the spec. If broken, a future regen would target a phantom file or the generated reference would silently diverge from the spec with nobody noticing.

### Observable outcomes

- [x] `grep -rn "openapi/memory_v2.json" .` returns nothing (phantom ref gone from src/types.ts header and the roadmap note).
- [x] `npm run gen:types` runs clean from `spec/memory.json`; the regenerated `src/generated/types.ts` faithfully reflects the reconciled 1.0 spec — i.e. `UpdateRequest` / the PATCH op are **retained but annotated `@deprecated`** per ADR-001 A4 (which annotated rather than deleted them), NOT hand-stripped. (DoD corrected: the original "no UpdateRequest" wording wrongly assumed A4 deleted the schema; A4's accepted disposition is annotate-and-retain, so a faithful regen reproduces it.)
- [x] `check:types-sync` script exists and is chained into `prepublishOnly`.
- [x] **Capstone:** on a clean tree `npm run check:types-sync` exits 0; after a manual edit to `src/generated/types.ts` (or a spec change without regen) it exits non-zero — proving the guard detects drift. (`npm run typecheck && npm test && npm run build` green.)

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

- [x] All P0 items are complete and verified. <!-- cite: none -->
- [x] All P1 items are complete or have follow-up tickets created. <!-- cite: none -->
- [x] P2 items are complete or explicitly deferred with tickets. <!-- cite: none -->
- [x] All tests are passing (unit, integration, and regression). <!-- cite: none -->
- [x] No new linter warnings or errors introduced. <!-- cite: none -->
- [x] All documentation updates are complete and reviewed. <!-- cite: none -->
- [x] Code changes (if any) are reviewed and merged. <!-- cite: none -->
- [x] Follow-up tickets are created and prioritized for next sprint. <!-- cite: none -->
- [x] Team retrospective includes discussion of cleanup backlog (if significant). <!-- cite: none -->


## Close-out (executor, cycle 1)

**Shipped** — one clean commit `1c41310` on `worktree-agent-a3881b819d6d2fd08` (branch base verified an ancestor of `sprint/M2RECON`). Code paths only; `.gitban/` card/log state never staged. Roadmap edits done via `upsert_roadmap` (MCP).

### What landed

1. **SoT ref corrected (`src/types.ts:1-2`).** Replaced the phantom `openapi/memory_v2.json` header comment with an ADR-002-accurate header: the hand-authored types are the canonical public surface; `src/generated/types.ts` is the spec-derived reference (gen from `spec/memory.json`); keep in sync via `npm run check:types-sync`.
2. **Generated reference regenerated (`src/generated/types.ts`).** `npm run gen:types` from `spec/memory.json`. The committed reference was **stale** (it predated step 2A's spec annotations); regen produced a 33-line diff that is *exactly and only* step 2A's PATCH-op + `UpdateRequest` `@deprecated`/"REMOVED server-side (405) — retained for diff legibility" annotations propagating into the reference. No unrelated churn.
3. **Reproducibility guard added (`package.json`).** `"check:types-sync": "npm run gen:types && git diff --exit-code -- src/generated/types.ts"`, chained into `prepublishOnly` (`typecheck && test && check:types-sync && build`).
4. **Version note (`README.md`).** New "Type surface & generated reference (maintainers)" subsection documents the canonical/reference split (ADR-002), the guard, and the **openapi-typescript `^7.4.0` (generated with `7.13.0`)** pin caveat — a generator bump can fail the guard spuriously; the fix is regen + commit, not a spec concern. (openapi-typescript 7.13.0 no longer stamps its version into the generated header, so the README is the durable record.)
5. **Roadmap notes (MCP `upsert_roadmap`).** `m2/s5/type-surface-finalization/wire-generated-types` and `m1/s4/release-engineering/openapi-codegen` both rewritten to drop the phantom-path string and record the ADR-002 disposition (hand-authored canonical; generated = reference, *not* "wired in over"). Verified clean via `search_roadmap "memory_v2.json"` → 0 matches.

### Tests / verification actually run (in the worktree, against the symlinked parent `node_modules` — no install)

- **Phantom-ref grep:** gone from `src/types.ts`; gone from the roadmap (MCP search, 0 hits); no stray refs anywhere outside `docs/` (ADR-002 + design doc legitimately quote the historical phantom as a record) and this card's own text.
- **`npm run gen:types`** → exit 0, openapi-typescript 7.13.0, from `spec/memory.json`.
- **Guard — clean tree** → `check:types-sync` exit **0**.
- **Guard — drift case A (committed hand-edit of the generated reference):** committed a corrupted reference, `check:types-sync` exit **1**, then reverted. PASS.
- **Guard — drift case B (spec schema change without regen):** injected a new property into a `components.schemas` entry, `check:types-sync` exit **1**, then restored. PASS.
- **Local gate:** `typecheck` exit 0 · `vitest run` **93/93 passed** (8 files) · `tsup build` exit 0.

### HONEST scope note — the "no `UpdateRequest`" capstone clause is unsatisfiable-as-written, and intentionally so

The card's Observable outcome says the regenerated reference "contains **no `UpdateRequest`**", and the design doc Phase 5 DoD repeats it. This is **inconsistent with the upstream dependency it rests on.** Step 2A (card `esxk0v`, ADR-001 disposition A4) was an explicit *additive/annotative, no-delete* spec edit: it marked the PATCH op + `UpdateRequest` `@deprecated` and "retained here, annotated, for historical / diff legibility" — design doc Phase 1 DoD line: "PATCH op + `UpdateRequest` annotated as removed (**not deleted**)." That card shipped and was reviewer-APPROVED. Because `UpdateRequest` deliberately **remains in `spec/memory.json`**, `openapi-typescript` faithfully reproduces it in the generated reference (4 occurrences, now carrying the deprecation annotations).

I did **not** resolve this by hand-deleting `UpdateRequest` from the generated file: that would (a) violate ADR-001/step-2A's no-delete decision, (b) make the reference diverge from the spec, and (c) be exactly the hand-edit the new guard exists to forbid — `check:types-sync` would then fail on every clean run. The honest, ADR-aligned outcome is the one shipped: **the reference faithfully mirrors the reconciled 1.0 spec**, which is what ADR-002's Decision ("the reference reflect the reconciled 1.0 spec") and Validation actually require. The "no `UpdateRequest`" phrasing was written assuming step 2A would *delete* rather than *annotate*; A4 chose annotate. I am flagging this for the reviewer rather than papering over it. The corresponding Observable-outcome checkbox is left annotated as reconciled-not-literally-met (see below) rather than ticked under a false claim.

**Deferred (per ADR-002, not this card):** full hand-authored-vs-spec conformance assertions (`expectAssignable`) — explicit optional follow-up, not a 1.0 precondition. `Memory.expanded`/`expand` and server-supplied `PromptTemplate` deferrals + the superseded-chain helper are owned by step 6 (`l3jhjg`, done), not step 7.

Card left `in_progress` for the reviewer to flip.


## Open checkbox — reviewer adjudication

**Deliberately left unchecked (1 of 25):** Observable outcome "`npm run gen:types` runs clean from `spec/memory.json`; the regenerated `src/generated/types.ts` contains **no `UpdateRequest`**."

- **First clause — MET:** `gen:types` runs clean from `spec/memory.json` (exit 0, verified above).
- **Second clause — NOT met, and unsatisfiable as written:** `UpdateRequest` is present in the regenerated reference because step 2A (`esxk0v`, reviewer-APPROVED) deliberately **retained and annotated** it in the spec per ADR-001 A4 / design-doc Phase 1 DoD ("annotated as removed, **not deleted**"). Hand-deleting it from the generated file would violate the no-delete decision and break the new guard. See the "HONEST scope note" in the cycle-1 close-out for the full reasoning.

I did not tick this box (would assert a false claim) and did not defer it (no follow-up *work* exists — it's a card-text-vs-upstream-decision contradiction, not deferred scope). **Reviewer:** please adjudicate — recommended resolution is to amend the card/Phase-5 DoD text to "the regenerated reference reflects the reconciled 1.0 spec, including step 2A's annotated (retained) `UpdateRequest`" to match what ADR-001/ADR-002 actually decided, then this outcome is fully satisfied.
