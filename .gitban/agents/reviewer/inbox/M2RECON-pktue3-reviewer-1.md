---
verdict: APPROVAL
card_id: pktue3
review_number: 1
commit: 235c558
date: 2026-06-13
has_backlog_items: false
---

# Review: step-4a-typed-filter-dsl-builder (B1)

Approved. The card implements design B1 / KD-4 (the typed, key-agnostic filter
DSL builder `f`) and meets the standard for an additive, public-API SDK change.

## Gate 1 — Completion claim: PASS

- **DoD required and present.** Card adds a public API surface (exported `f`
  value; `Clause` / `Comparable` / `FieldOps` types; `SearchRequest.filters`
  JSDoc rewrite), so a DoD is mandatory.
- **Intent** is plain-English and sanity-checkable, and names the real failure
  mode ("users would build filters that match the wrong rows with no warning").
  Not a title restatement.
- **Capstone is genuine, not mockable-by-construction.** The capstone test
  builds the full `f.all(f.eq(...), f.field('score',{$gte,$lt}), f.in(...))`
  composition, deep-equals it against the documented wire shape *with both
  range operators present*, asserts the duplicate-field `f.all` throws, and
  round-trips the result through the real `Memories.search()` path — only the
  HTTP transport is mocked, not the builder or the search method. Verified in
  src/memories.ts:240-247 that `search()` forwards `body` (incl. `filters`)
  verbatim, so the "forwarded verbatim" assertion is a meaningful end-to-end
  check of assembled output, not a tautology. This is exactly the
  unfakeable-assembly capstone the rubric asks for.
- **Checkbox / Observable integrity verified independently**, not taken on
  trust: `npm run typecheck` clean; `src/filter.test.ts` 21/21 pass; full
  suite green (77 tests — the card's "72" was accurate at commit time; the
  delta is additive suite growth, zero regressions). README + JSDoc match the
  emitted wire shapes exactly.
- **Scope-honesty disclosure is accurate.** The executor correctly flags the
  capstone round-trip as mocked-HttpClient (not live API) and points to the
  already-tracked live-API / server-side-metadata-filtering threads in ADR-001
  Validation and the design doc — not re-opened, not silently dropped.

## Gate 2 — Implementation quality: PASS

- **Spec fidelity.** Cross-checked every operator against
  spec/memory.json `info.description` "Filter DSL" table:
  `$eq/$ne/$in/$nin/$exists/$gt/$gte/$lt/$lte/$between`, the `AND`/`OR`/`NOT`
  composition keys (correctly the bare keys, **not** `$and`/`$or`), `null` =
  unset, and top-level implicit-AND. All emitted shapes are exact.
- **Design fidelity + an improvement.** Matches docs/designs KD-4 verbatim, and
  improves on it defensively: where the design wrote `$in: v` / `$nin: v` and a
  bare `ops` spread, the implementation copies the input array (`[...v]`) and
  ops object (`{ ...ops }`), and `f.all` does not mutate its inputs. These are
  covered by explicit non-mutation tests — a clause built earlier can't be
  corrupted by a later caller mutation. This is the right call, not gold-plating.
- **ADR-001 A5 reconciliation honored.** Builder is key-agnostic by
  construction (arbitrary field-name strings, no fixed enum), so an arbitrary
  metadata/payload key (`tier`) filters identically to an entity axis
  (`agent_id`) with no typed `metadata` field reintroduced. Tested directly.
- **The B1 anti-clobber invariant holds.** `f.field` is the sole multi-operator
  path so a two-sided range keeps both operators; `f.all` throws loudly on a
  same-field collision with a message that names the field and points at
  `f.field`/`f.and`. A silently-wrong range is unrepresentable — the exact bug
  the design set out to make impossible.
- **TDD evident.** Tests read as a specification of the wire contract, cover
  failure/edge cases (duplicate-field throw, input non-mutation, exists
  default + explicit false), not happy-path-only. Not reverse-engineered from
  the implementation.
- **DaC.** README "Filtering" section and the `SearchRequest.filters` JSDoc
  rewrite are accurate and correctly scope the `@deprecated` tag to lifting
  scope axes only — the operator DSL over payload keys is documented as
  supported/non-deprecated. Matches the design's doc-note instruction.
- No DRY violations, no security exposure, no lazy solves, no dead code.

## FOLLOW-UP

None. The two pre-existing open threads (live-API probe of filter-DSL
acceptance; server-side metadata-key filtering behaviour) are already tracked
in ADR-001 Validation and the m2-1.0 design doc respectively, and the diff does
not make them worse. No new tech debt, no consumer-coverage gaps (the only
consumer, `SearchRequest.filters`, is exercised by the capstone), no ADR drift.

## Close-out actions

- Card may move to the next stage. Remaining unchecked boxes ("PR merged",
  "deployed to production", "monitoring", "stakeholders notified") are owned by
  the dispatcher / release card, not the executor — correctly left unchecked.
