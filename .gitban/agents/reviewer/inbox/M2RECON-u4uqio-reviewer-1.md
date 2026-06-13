---
verdict: APPROVAL
card_id: u4uqio
review_number: 1
commit: a561fce
date: 2026-06-13
has_backlog_items: false
---

# Review: step-8-release-v0-3-0-version-readme-changelog (M2RECON capstone)

## Summary

APPROVED. This is the M2RECON release/packaging capstone. The diff is small and
correct: a new `CHANGELOG.md` and a `package.json` version bump `0.2.1 → 0.3.0`.
The card's substantive claims — README already documents the full additive
surface, and the integration gate is green on the fully-assembled tree — both
hold under independent verification.

## Gate 1 — completion claim

- **DoD present and well-formed.** A release card does not strictly require a DoD
  (the diff is docs + a version string with no logic branch), but the card
  carries one and it is the right one. Intent is concrete and externally
  observable (a consumer installing `0.3.0` sees an accurate version, README, and
  changelog reflecting the M2 surface, with the additive/non-breaking nature
  called out) — not a title restatement, not marketing-speak.
- **Capstone is genuine and unfakeable.** The capstone observable is the full
  integration gate on the assembled tree (`typecheck && test && build` +
  `check:types-sync`). For a release card this is exactly the correct capstone:
  it only passes when every M2 card is integrated and the package builds clean
  end-to-end. It cannot be ticked by a mock or a single isolated unit test.
- **Checkbox integrity — every checked box verified true:**
  - `package.json` version is `0.3.0` — confirmed (`node -p require version`).
  - README documents each surface — grep-confirmed every required term:
    `authMode`/`x-api-key` (L60-71), `resolveSuperseded`/`resolveAllSuperseded`
    (L112-116), `include: ["full_content"]` (L130-136), `searchAll` (L145),
    `f.all`/`f.field` filter DSL (L160-212), `validation_error` both-shape errors
    (L284-294), `RateLimitSnapshot`/`err.rateLimit` (L302-328).
  - `CHANGELOG.md` has the `[0.3.0]` entry listing the additive surface + the
    ADR-001/002 spec corrections, flagged non-breaking — confirmed.

Gate 1 passes.

## Gate 2 — implementation quality

- **Capstone independently reproduced (not taken on trust).** I ran the full gate
  on the integrated tree at HEAD `a561fce`:
  - `npm run typecheck` → exit 0.
  - `npm test` → exit 0; **93 tests passed across 8 files**
    (search-all, superseded, filter, errors, recall, http, ai-sdk/tools, groups)
    — matches the card's claim exactly.
  - `npm run check:types-sync` → exit 0; `gen:types` regenerated
    `src/generated/types.ts` and `git diff --exit-code` found **no drift**, and
    the working tree was clean afterward (committed reference == current
    `spec/memory.json` output).
  - `npm run build` → exit 0; ESM + CJS + DTS all built clean.
- **CHANGELOG accuracy.** Every public surface the `[0.3.0]` entry claims is real
  and exported (verified against `src/index.ts` and `src/memories.ts`): `f`,
  `Clause`, `Comparable`, `FieldOps`, `RateLimitSnapshot`, `AuthMode`,
  `Memories.searchAll` (async generator), `Memories.resolveSuperseded` /
  `resolveAllSuperseded`, recall `include`. No phantom surface is documented.
- **ADR fidelity.** The "Changed" section describes the ADR-001 spec corrections
  faithfully — A2a (Bearer documented additively alongside Token/x-api-key), A4
  (PATCH/`UpdateRequest` annotated removed-server-side, not deleted), A5
  (`metadata` annotated as dropped) — and the ADR-002 SoT/generated-reference
  correction. The framing matches the ADR's additive/annotative posture: no
  shipping default changed, no export removed.
- **Versioning policy.** Minor bump for an additive, non-breaking surface is
  correct per RELEASING.md pre-1.0 policy; the changelog states this explicitly.
- **TDD proportionality.** No new tests are required: the change is documentation
  plus a version string with zero runtime-behavior change. The verification
  vehicle for a release card is the integration gate, which is green. This is the
  correct application of the proportionality clause, not a TDD gap.
- **Tag links** in the CHANGELOG point at `github.com/XTraceAI/memory-sdk-ts`
  (the canonical upstream where the release ships) — correct, not a fork-link
  mistake.

## BLOCKERS

None.

## FOLLOW-UP

None. The diff exposes no untested path, no ADR drift, and no adjacent debt. The
one forward-looking item — a public success-path rate-limit surface — is already
explicitly and honestly deferred in the CHANGELOG "Notes" with a stated rationale
(deferred until demand), and it is out of scope for this release card.

## Outstanding close-out actions

None. The release is documented and the capstone gate is green on the integrated
tree. Ready to proceed to tagging/publish per RELEASING.md.
