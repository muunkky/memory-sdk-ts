---
verdict: APPROVAL
card_id: f5ddyp
review_number: 1
commit: 1c41310
date: 2026-06-13
has_backlog_items: true
---

# Review — f5ddyp (step 7: type-surface SoT fix, regen, guard)

Implements ADR-002 C1. Corrects the phantom `openapi/memory_v2.json` source-of-truth
pointer, regenerates the spec-derived reference from the reconciled 1.0 spec, and adds
a `check:types-sync` reproducibility guard chained into `prepublishOnly`. Verdict:
**APPROVAL**.

## Gate 1 — completion claim

DoD required (touches a build script / `prepublishOnly` gate and a runtime-relevant
config in `package.json`). The card carries a well-formed DoD:

- **Intent** is plain-English and sanity-checkable: a maintainer running `gen:types`
  gets what the comment promises, the committed reference reflects the reconciled 1.0
  spec, and an automated check fails loudly on drift. Not a title restatement.
- **Observables** are user-observable and testable (grep returns nothing; guard exists
  and is chained; capstone exits 0 clean / non-zero on drift).
- **Capstone** is genuine and unfakeable: it asserts a *behavioral* property of the
  guard (exit 0 on a clean tree, non-zero on drift) that cannot be ticked by a single
  unit test or a mock — it requires the real `gen:types` + `git diff` pipeline to run.

**DoD-correction confirmed sound.** The card's Observable was corrected from "contains
no `UpdateRequest`" to "retained but annotated `@deprecated` per ADR-001 A4." I verified
this against the source of authority:

- ADR-001 A4 (table row, L232; Implementation Notes L344-348): disposition is
  **annotate, do not delete** — "preserve the entry with a deprecation/removal note
  rather than deleting it outright." A4 is `Accepted`.
- ADR-001 line 132-137 (Decision): "Spec edits are additive/annotative, not
  destructive." `UpdateRequest` deliberately **remains** in `spec/memory.json`.
- Therefore a faithful `openapi-typescript` regen necessarily reproduces `UpdateRequest`
  (now carrying the deprecation annotations). The corrected DoD is the only DoD
  consistent with the upstream-accepted decision. The executor correctly did **not**
  hand-strip it — doing so would (a) violate A4, (b) diverge the reference from the
  spec, and (c) be exactly the hand-edit the new guard forbids.

The one Observable the executor left annotated-but-unticked in the *card body* close-out
is the stale "no UpdateRequest" clause; the DoD-corrected Observable at the top of the
DoD section now reads correctly and is satisfied. The executor's honesty here (flagging
the contradiction for reviewer adjudication rather than ticking a false claim) is the
right call. I am resolving the adjudication: the corrected wording is authoritative and
**met**.

Checkbox design and integrity: checkboxes cover the acceptance criteria and Observables;
no vague/trivial boxes; no deferred in-scope work masquerading as follow-up. Gate 1 PASS.

## Gate 2 — implementation quality

Read the full diff at `1c41310` (4 files, +56/-10). Cross-referenced ADR-001 and
ADR-002. Independently re-ran every capstone assertion in the working tree.

**`src/types.ts` header (SoT fix).** Phantom `openapi/memory_v2.json` replaced with an
ADR-002-accurate header: hand-authored types are canonical, `src/generated/types.ts` is
the spec-derived reference (gen from `spec/memory.json`), kept in sync via
`check:types-sync`. Matches ADR-002 Decision (L76-83) and Implementation Notes (L285-287)
verbatim in intent. Correct.

**`src/generated/types.ts` regen.** The 33-line diff touches exactly two docblocks — the
`PATCH /v1/memories/{memory_id}` operation and the `UpdateRequest` schema — propagating
step 2A's `@deprecated` + "REMOVED server-side (405) — retained for diff legibility"
annotations. No unrelated churn. I confirmed reproducibility independently: `npm run
gen:types` on the current tree produces **zero** diff against the committed file (guard
exit 0), proving the committed reference is exactly what the spec generates. ADR-002 KF4
(L141-144) requires the regen reflect the reconciled (post-ADR-001) spec; it does.

**`package.json` guard.** `check:types-sync` = `gen:types && git diff --exit-code --
src/generated/types.ts`, chained into `prepublishOnly` before `build`. Matches ADR-002
Implementation Notes (L290-293) and the reproducibility-tier guard described in KF3
(L122-126). IaC-clean: the gate is codified, not a manual step.

**`README.md`.** New maintainer subsection documents the canonical/reference split, the
guard, and the `openapi-typescript ^7.4.0` (generated with 7.13.0) version-pin caveat.
DaC satisfied — the behavioral change (new guard, new SoT relationship) is documented at
the surface a maintainer reads. The version-pin note is a genuinely thoughtful addition:
7.13.0 no longer stamps its version into the generated header, so the README is the
durable record and the note pre-empts spurious guard failures on a generator bump.

**Capstone re-verified independently (not trusting the close-out):**
- Clean tree → `check:types-sync` exit **0** (confirmed twice, direct exit-code capture).
- Spec drift (injected a property into a `components.schemas` entry, no regen-commit) →
  exit **1**. Restored clean. This is the real-world drift the guard exists to catch.
- Local gate: `typecheck` exit 0 · `vitest` **93/93 passed (8 files)** · `build` exit 0.
- Phantom-ref grep: gone from `src/types.ts`; roadmap `search_roadmap "memory_v2.json"`
  → **0 matches**; remaining hits are only in `docs/adr/ADR-002`, the design doc, and the
  card's own text — all legitimate historical records, not live SoT pointers.

**TDD/proportionality.** This card changes a build script and a generated artifact, not
runtime code paths. No new runtime behavior to test-drive; the "test" is the guard itself,
which is exercised by the capstone runbook (clean-pass / drift-fail). The existing 93-test
suite is the regression net for the unchanged public surface (ADR-002 Validation L309-310:
"existing test suites compile and pass without type edits"). Proportionate — full unit-TDD
rigor is not owed here. Correct.

**ADR compliance.** Fully aligned with ADR-002 C1 and consistent with ADR-001 A4. No new
architectural decision is introduced; no ADR drift in the code change.

No blockers.

## Note for the router

One minor imprecision in the executor's close-out, non-blocking: "drift case A" (hand-edit
of the generated file caught by the guard) is technically inaccurate as stated — a raw
hand-edit is *overwritten* by the `gen:types` step before `git diff` runs, so it would not
fail the guard unless the corrupted reference were committed first. The meaningful drift
scenario the guard protects against — a spec change without a matching regen+commit (the
executor's "drift case B") — **is** correctly caught (I reproduced it: exit 1). The
capstone is satisfied via case B, which is the scenario the guard's stated purpose names.
No action required; recording for accuracy.

## FOLLOW-UP

- **L1 (doc-drift):** `docs/designs/m2-1.0-spec-reconciliation-and-surface.md:458` still
  carries the stale Phase-5 DoD wording "`gen:types` runs clean; regenerated reference has
  **no `UpdateRequest`**." This is the same incorrect assumption the card's DoD was
  corrected away from, and it contradicts the *same document's* Phase-1 DoD at L358
  ("PATCH op + `UpdateRequest` annotated as removed, **not deleted**"). Failure mode: a
  future executor or reviewer working from the design doc would re-derive the wrong
  acceptance bar and either hand-strip `UpdateRequest` (breaking the guard + violating A4)
  or block a faithful regen. Fix: amend L458 to "regenerated reference reflects the
  reconciled 1.0 spec, including step 2A's annotated (retained) `UpdateRequest`." Out of
  scope for f5ddyp (card scope was the `src/types.ts` header + roadmap note, both done).

- **L2 (conformance-coverage-gap):** The guard proves *reproducibility* only (the committed
  reference == what the spec generates), not *conformance* (that the hand-authored
  canonical `src/types.ts` actually matches the spec-derived schemas). ADR-002 KF3 (L128-132)
  and Implementation Notes (L294-296) explicitly scope `expectAssignable` conformance
  assertions as optional follow-up, not a 1.0 precondition — so this is correctly deferred,
  not a blocker. Recording it so the planner can dedupe against any existing conformance
  card. Failure mode if never done: the canonical surface could silently diverge from the
  spec on a wire-critical type and no automated check would catch it.
