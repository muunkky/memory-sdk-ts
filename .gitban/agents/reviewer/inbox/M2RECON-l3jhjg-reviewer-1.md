---
verdict: APPROVAL
card_id: l3jhjg
review_number: 1
commit: 7760674
date: 2026-06-13
has_backlog_items: true
---

# Review: step-6-superseded-chain-helper-and-field-deferrals (l3jhjg)

## Verdict: APPROVAL

The card wires ADR-002 C2 exactly as decided: implement the superseded-chain
resolver (the one forward field with live server support), and record the
`expand` / server-`PromptTemplate` deferrals as JSDoc citing the ADR. The
implementation is clean, additive, well-documented, and proven by tests that
assert on observable behavior. Gates 1 and 2 both pass.

## Gate 1 — Completion claim (PASS)

- **DoD required and present.** The card adds two public methods on `Memories`
  (behavioral, public-API-touching), so a DoD is required. It is present and
  well-formed.
- **Intent** is plain-English and sanity-checkable: a caller asks "what replaced
  my old fact?" and gets the replacement Memory instead of hand-reading the
  `memories_superseded_by` map. Not a title restatement.
- **Capstone is strong and unfakeable.** Given a map `old1 → new1`,
  `resolveSuperseded(result, 'old1')` returns the Memory that `get('new1')`
  yields, and `'unknown'` returns `null`. This exercises the assembled
  map-follow → fetch path end-to-end against a mocked transport, not a return
  type or internal shape. The backing test (`superseded.test.ts`) walks exactly
  this path and additionally asserts the fetched path was `/v1/memories/new1`.
- **No-capstone caveat is sound.** The deferrals are correctly scoped as doc-only
  (no user-visible feature, no logic branch), so they need no capstone of their
  own — the single user-visible feature (the resolver) carries one.
- **Checkbox design proves correctness.** Boxes cover the acceptance criteria
  (hit → replacement, miss → null, deferral JSDoc) plus failure modes (empty
  map, non-superseded id makes no network call, url-encoding). Not happy-path-only.
- **Integrity verified.** Reviewer re-ran the gate: `npm run typecheck` clean,
  `vitest run` 93/93 (6 new + 87 unchanged), `npm run build` succeeds. Both
  resolver methods appear in the built `dist/*.d.ts` / `*.d.cts`, confirming the
  public surface actually exposes them via `client.memories.*` with no
  `src/index.ts` change needed (no new symbol to re-export).

## Gate 2 — Implementation quality (PASS)

- **ADR-002 C2 compliance is exact.** Disposition table rows for
  `memories_superseded_by` (wire now), `Memory.expanded` (defer), and
  server-`PromptTemplate` (defer) all match the diff. No speculative surface
  shipped (Alternative 3 correctly avoided).
- **Resolver is a thin, honest reuse layer.** `resolveSuperseded` reads
  `result.memories_superseded_by?.[oldId]` and delegates to the existing
  `get()` — no duplicated transport logic, no pretense that old ids are globally
  queryable. Takes `IngestJobResult` explicitly, which is the design-doc (KD-7)
  decision the ADR deferred to the design doc. The optional batch
  `resolveAllSuperseded` is named in the design doc as an allowed inclusion;
  fanning `get()` out via `Promise.all` is reasonable.
- **DaC satisfied.** Deferral JSDoc on both `Memory.expanded` (types.ts:74) and
  `PromptTemplate` (types.ts:311) cites ADR-002 (C2) and is behavior-neutral.
  README documents both new methods against the real public surface
  (`client.memories`, `done.result`) with no phantom API.
- **TDD evidence is genuine.** `superseded.test.ts` reads as a specification, not
  reverse-engineered assertions: it includes negative cases (miss → null, empty
  map), no-network assertions (recorded `paths` array proves a non-superseded id
  never hits the transport), and a url-encoding edge case (`new id` →
  `/v1/memories/new%20id`). Assertions are on observable behavior (returned
  Memory id + requested paths), not internals.
- **Mocked HttpClient is the established repo pattern**, not a fixture-vs-reality
  gap. Every SDK unit test in this repo mocks the transport; there is no
  live-API harness, and the resolver adds no integration surface that mocking
  hides (it is pure map-follow + delegate-to-`get`). No live-artifact test is
  warranted here.
- **The test fixture's `IngestJobResult` matches the real type** (types.ts:123) —
  `object?` optional, all required fields supplied. No drift.

## FOLLOW-UP

- **L1 (error-path-coverage):** `resolveAllSuperseded` uses `Promise.all`, which
  rejects wholesale the moment any single `get()` fails. If a replacement memory
  was deleted between the ingest and the batch call (the real client throws on a
  404 — the fixture mirrors this), the entire batch rejects and the caller loses
  the successfully-resolved entries. `resolveSuperseded` (single) has no such
  surprise. This may be the intended contract, but it is neither documented in
  the JSDoc nor exercised by a test — the batch tests only cover the all-success
  and empty cases. Worth either a doc note ("rejects if any replacement is
  unreachable") plus a partial-failure test, or a `Promise.allSettled` variant
  that skips unresolvable entries. Non-blocking: the single-resolve path (the
  card's capstone) is unaffected, and the all-success batch path is covered.

## Outstanding close-out actions

- "Code Review Approved" / "Deployment Plan Ready" and the release/closeout
  Completion-Checklist items remain reviewer-, release-, and closeout-owned —
  correctly left unchecked by the executor. Card may move to in_progress for
  closeout.
