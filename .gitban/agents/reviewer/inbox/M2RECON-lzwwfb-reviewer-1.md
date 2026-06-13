---
verdict: APPROVAL
card_id: lzwwfb
review_number: 1
commit: 1520127
date: 2026-06-13
has_backlog_items: false
---

# Review: step-4b-recall-include-for-full-content (M2RECON / lzwwfb)

**APPROVAL.** Both gates pass. Clean, minimal, faithful realization of design KD-5 (B2).

## Gate 1 — completion claim (PASS)

DoD is required (the card touches a public API contract — `RecallParams.include` —
and control flow — threading `include` through the per-pool fan-out) and is present.

- **Intent** is a plain-English, externally-checkable paragraph: a `recall()` caller
  can ask the server to include heavy artifact bodies on the returned rows instead of
  issuing separate `get()` calls; names the break mode (ignore the request, or enrich
  only some unioned scopes). A reasonable engineer can sanity-check against it.
- **Capstone is genuine and unfakeable.** "Calling `recall({..., include:['full_content']})`
  across a 3-pool union results in EVERY per-pool `/v1/memories/search` body carrying
  `include:['full_content']`; omitting it results in no `include` key on any pool body."
  This is the assemble-the-whole-thing assertion — it only passes when the real fan-out
  forwards the field to all pools. It asserts on the actual wire bodies (recorded at the
  HTTP boundary, see Gate 2 mocking note), not on a return type or internal shape, so it
  is not mockable away.
- **Observables** cover the typed contract (`Array<'full_content'>`, `context_prompt`
  rejected at compile time), the accessor (`ArtifactDetails.full_content`), and the green
  gate. The `No capstone caveat` line is correctly NOT used — a real capstone is supplied.
- **Checkboxes** are testable and prove correctness if honest: every-pool forwarding,
  omit-case key-absence, scope-collision coexistence, typed accessor, compile-time
  rejection. Failure modes (omit-case, collision) are covered, not just happy path.
- **Integrity verified.** Ran the suite myself: `npm test` 82/82 (recall.test.ts 33/33),
  `npm run typecheck` clean, `npm run build` green. The two unchecked completion boxes
  ("Code review approved", "Deployed to production") are correctly left open for the
  reviewer/release. No `[x]` box is false.

## Gate 2 — implementation quality (PASS)

- **ADR compliance.** ADR-002 makes `src/types.ts` the canonical hand-authored domain
  surface; the new `RecallParams.include` lands there (correct file), reuses the
  already-typed `ArtifactDetails.full_content` (KD-5: "the gap was *threading*, not new
  types"), and adds nothing to the dead `src/generated/types.ts`. ADR-001 reconciliation
  policy respected.
- **Faithful to KD-5, with a defensible improvement.** The design pseudocode spreads
  `include` unconditionally; the executor used a conditional spread
  (`const includeFields = include ? { include } : {}`) so the omit-case wire body stays
  byte-identical (no `include: undefined`). This better serves the card's "Additive /
  unchanged behavior" acceptance criterion than the literal pseudocode, and the omit-case
  test (`expect("include" in c).toBe(false)` AND `toBeUndefined()`) proves it. Not a
  deviation — a refinement.
- **TDD evident.** Tests assert behavior and the wire contract, not implementation
  internals. The mocking layer is correct: `fakeHttp` stubs only `HttpClient.request` (the
  lowest, HTTP boundary) and records each search body verbatim, so the real `recall()`
  fan-out, real `search()`, and the real conditional-spread all execute under test. This is
  the opposite of overmocking-the-system-under-test — the assembly is exercised, not
  stubbed.
- **Compile-time contract is real, not cosmetic.** The `context_prompt` rejection test uses
  `@ts-expect-error`. Because `npm run typecheck` passes, that directive is provably
  *consumed* — an unused `@ts-expect-error` would itself fail the typecheck. So the
  union genuinely excludes `context_prompt` at compile time; this is a durable committed
  contract, not a runtime assertion that could rot.
- **DaC.** JSDoc added on both `RecallParams.include` and the `recall()` method explaining
  the `full_content`-only scoping and the discarded-envelope rationale; README gains a
  worked `include: ["full_content"]` example. Documentation matches behavior.
- **No DRY / security / lazy-solve concerns.** No duplicated logic, no widened catches, no
  loosened types, no secrets. `...pool` carries no `include` axis, so the spread order
  cannot clobber scope axes (covered by the collision test).

## FOLLOW-UP

None. The diff exposes no untested adjacent path, no consumer-coverage gap, and no ADR
drift. `RecallResult.perScopePrompts` is already recorded on the card's Follow-up table as
an out-of-scope future enhancement (correctly deferred per KD-5, no new card warranted).
