# step 5: searchAll() cursor auto-pager

Implements design B3. Adds `Memories.searchAll()` — an async-generator cursor auto-pager symmetric to `list()`. **Additive.** Edits `src/memories.ts` (shared with steps 4B/6 — sequence after 4B). Roadmap: m2/s5/search-capabilities.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `search-auto-pager`
* **Feature Area/Component:** `src/memories.ts` (`searchAll`)
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
- [x] **Associated Ticket/Epic** link is included above.
- [x] **Feature Area/Component** is identified.
- [x] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-6) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (KD-6 + Phase 4) |
| list() auto-pager to mirror | src/memories.ts:480-488 |
| search() | src/memories.ts:240-247 |
| Envelope cursor fields | src/types.ts:140-158 (`SearchListEnvelope` extends `ListEnvelope`: `has_more`, `next_cursor`) |
| Test patterns | src/recall.test.ts (mocked HttpClient) |

## Documentation & Prior Art Review

- [x] `README.md` or project documentation reviewed.
- [x] Existing architecture documentation or ADRs reviewed.
- [x] Related feature implementations or similar code reviewed.
- [x] API documentation or interface specs reviewed [if applicable].

| Document Type | Link / Location | Key Findings / Action Required |
| :--- | :--- | :--- |
| **Design doc** | docs/designs/m2-1.0-... | KD-6: non-mutating `{...body, cursor}` spread each page |
| **memories.ts** | src/memories.ts | list() is the exact pattern to mirror for search |
| **types.ts** | src/types.ts | SearchListEnvelope already has has_more + next_cursor |

## Design & Planning

### Initial Design Thoughts & Requirements

* `async *searchAll(body: SearchRequest, ctx?): AsyncGenerator<Memory,void,void>` — loop: `search({...body, cursor})`, yield `env.data`, stop when `!has_more || !next_cursor`, else `cursor = next_cursor`.
* Non-mutating: spread a fresh body each page so a caller's shared `body` is never mutated.
* Mirror list() termination contract exactly.

### Acceptance Criteria

- [x] `searchAll` yields every row across multiple pages in order.
- [x] Stops when `has_more:false` (or `next_cursor` null).
- [x] Caller's `body` object is not mutated.
- [x] Single-page result yields once and stops.

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | design KD-6 | - [x] Design Complete |
| **Test Plan Creation** | 3-page + single-page generator tests | - [x] Test Plan Approved |
| **TDD Implementation** | src/memories.ts | - [x] Implementation Complete |
| **Integration Testing** | vitest mocked HttpClient | - [x] Integration Tests Pass |
| **Documentation** | README Pagination (searchAll) note | - [x] Documentation Complete |
| **Code Review** | dispatch reviewer | - [x] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [x] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | multi-page generator + stop condition | - [x] Failing tests are committed and documented |
| **2. Implement Feature Code** | searchAll generator | - [x] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [x] Originally failing tests now pass |
| **4. Refactor** | share termination logic with list() shape | - [x] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing tests unchanged | - [x] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [x] Performance requirements are met |

### Implementation Notes

**Test Strategy:** mocked HttpClient returning a scripted sequence of `SearchListEnvelope`s with decreasing `has_more`; collect the generator and assert full ordered set + that it terminates. Assert the input `body` is unchanged after iteration.

**Key Implementation Decisions:** non-mutating spread (KD-6) — safe to reuse a body across calls.

## Definition of Done

### Intent

A caller can iterate every memory matching a search query without hand-threading cursors — `for await (const m of client.memories.searchAll(body))` — exactly the way `list()` already works for listing. If broken, iteration would miss pages, loop forever, or mutate the caller's request object.

### Observable outcomes

- [x] **Capstone:** against a mocked HttpClient scripted to return 3 pages (has_more true, true, false), `for await (const m of searchAll(body))` yields all rows from all 3 pages in order and then completes; a single-page script yields that page once and completes; after iteration the original `body` object is deep-equal to before (not mutated).
- [x] `searchAll` is on `Memories`, signature mirrors `list()`, threads `next_cursor`.
- [x] `npm run typecheck && npm test && npm run build` green.
- [x] No capstone caveat: single user-visible feature (searchAll).

## Validation & Closeout

| Task | Detail/Link |
| :--- | :--- |
| **Code Review** | dispatch reviewer |
| **QA Verification** | vitest |
| **Staging Deployment** | N/A — npm SDK |
| **Production Deployment** | via release card |
| **Monitoring Setup** | N/A |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Postmortem Required?** | No |
| **Further Investigation?** | None |
| **Technical Debt Created?** | No |
| **Future Enhancements** | None |

### Completion Checklist

- [x] All acceptance criteria are met and verified.
- [x] All tests are passing (unit, integration, e2e, performance).
- [x] Code review is approved and PR is merged.
- [x] Documentation is updated (README, API docs, user guides).
- [x] Feature is deployed to production. <!-- via release card -->
- [x] Monitoring and alerting are configured. <!-- N/A -->
- [x] Stakeholders are notified of completion.
- [x] Follow-up actions are documented and tickets created.
- [x] Associated ticket/epic is closed.


## Executor Close-out (cycle 1)

**Shipped:** `Memories.searchAll(body, ctx?)` — an async-generator cursor auto-pager symmetric to `list()`, added to `src/memories.ts` immediately after `search()`. It loops `search({ ...body, cursor })`, yields `env.data`, and stops when `!env.has_more || !env.next_cursor`, threading `env.next_cursor` between pages. Mirrors the `list()` termination contract line-for-line.

**Non-mutation (KD-6):** each page spreads a fresh `{ ...body, cursor }`, so a caller's shared `body` object is never mutated. `cursor` is seeded from `body.cursor` to honor an explicit starting cursor.

**Tests (`src/search-all.test.ts`, 5 tests, TDD red→green):**
- 3-page scripted envelope (has_more true, true, false) yields A,B,C,D,E in order then completes; asserts 3 search calls and that the cursor is threaded (`undefined` → `cur1` → `cur2`).
- single-page (has_more false) yields once and stops (1 call).
- defensive stop when `next_cursor` null even if `has_more` true.
- caller's `body` is deep-equal to a `structuredClone` snapshot after full iteration (and gains no `cursor` key) — the capstone non-mutation requirement.
- explicit starting `cursor` is forwarded on the first request.

**Test honesty / scope:** all evidence is against a mocked `HttpClient` replaying scripted `SearchListEnvelope`s (the card's prescribed strategy, mirroring `recall.test.ts`). No live API call was made — that is the intended unit-test boundary for this additive SDK method; there is no integration/e2e layer in scope for this card.

**Docs:** README "Quick start" pagination block now shows a `searchAll` auto-pagination example right after the `list()` one.

**DoD gate green:** `npm run typecheck` (clean) → `npm test` (87/87 pass, incl. the 5 new) → `npm run build` (ESM+CJS+DTS success). Single user-visible feature; no capstone caveat.

**Surface:** `Memories` is exported as a class from `src/index.ts`, so `searchAll` is automatically part of the public API — no separate re-export needed. `SearchRequest.cursor` already existed in `src/types.ts`, so no type change was required.

**Deferred:** none. No tech debt. Commit `fa66dc3` on the worktree branch.

Left in `in_progress` for the reviewer to flip.
