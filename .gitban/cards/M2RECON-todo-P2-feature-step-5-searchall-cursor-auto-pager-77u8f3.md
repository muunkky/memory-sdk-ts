# step 5: searchAll() cursor auto-pager

Implements design B3. Adds `Memories.searchAll()` — an async-generator cursor auto-pager symmetric to `list()`. **Additive.** Edits `src/memories.ts` (shared with steps 4B/6 — sequence after 4B). Roadmap: m2/s5/search-capabilities.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `search-auto-pager`
* **Feature Area/Component:** `src/memories.ts` (`searchAll`)
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
* [ ] **Associated Ticket/Epic** link is included above.
* [ ] **Feature Area/Component** is identified.
* [ ] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-6) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (KD-6 + Phase 4) |
| list() auto-pager to mirror | src/memories.ts:480-488 |
| search() | src/memories.ts:240-247 |
| Envelope cursor fields | src/types.ts:140-158 (`SearchListEnvelope` extends `ListEnvelope`: `has_more`, `next_cursor`) |
| Test patterns | src/recall.test.ts (mocked HttpClient) |

## Documentation & Prior Art Review

* [ ] `README.md` or project documentation reviewed.
* [ ] Existing architecture documentation or ADRs reviewed.
* [ ] Related feature implementations or similar code reviewed.
* [ ] API documentation or interface specs reviewed [if applicable].

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

* [ ] `searchAll` yields every row across multiple pages in order.
* [ ] Stops when `has_more:false` (or `next_cursor` null).
* [ ] Caller's `body` object is not mutated.
* [ ] Single-page result yields once and stops.

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | design KD-6 | - [ ] Design Complete |
| **Test Plan Creation** | 3-page + single-page generator tests | - [ ] Test Plan Approved |
| **TDD Implementation** | src/memories.ts | - [ ] Implementation Complete |
| **Integration Testing** | vitest mocked HttpClient | - [ ] Integration Tests Pass |
| **Documentation** | README Pagination (searchAll) note | - [ ] Documentation Complete |
| **Code Review** | dispatch reviewer | - [ ] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [ ] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | multi-page generator + stop condition | - [ ] Failing tests are committed and documented |
| **2. Implement Feature Code** | searchAll generator | - [ ] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [ ] Originally failing tests now pass |
| **4. Refactor** | share termination logic with list() shape | - [ ] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing tests unchanged | - [ ] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [ ] Performance requirements are met |

### Implementation Notes

**Test Strategy:** mocked HttpClient returning a scripted sequence of `SearchListEnvelope`s with decreasing `has_more`; collect the generator and assert full ordered set + that it terminates. Assert the input `body` is unchanged after iteration.

**Key Implementation Decisions:** non-mutating spread (KD-6) — safe to reuse a body across calls.

## Definition of Done

### Intent

A caller can iterate every memory matching a search query without hand-threading cursors — `for await (const m of client.memories.searchAll(body))` — exactly the way `list()` already works for listing. If broken, iteration would miss pages, loop forever, or mutate the caller's request object.

### Observable outcomes

- [ ] **Capstone:** against a mocked HttpClient scripted to return 3 pages (has_more true, true, false), `for await (const m of searchAll(body))` yields all rows from all 3 pages in order and then completes; a single-page script yields that page once and completes; after iteration the original `body` object is deep-equal to before (not mutated).
- [ ] `searchAll` is on `Memories`, signature mirrors `list()`, threads `next_cursor`.
- [ ] `npm run typecheck && npm test && npm run build` green.
- [ ] No capstone caveat: single user-visible feature (searchAll).

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

* [ ] All acceptance criteria are met and verified.
* [ ] All tests are passing (unit, integration, e2e, performance).
* [ ] Code review is approved and PR is merged.
* [ ] Documentation is updated (README, API docs, user guides).
* [ ] Feature is deployed to production. <!-- via release card -->
* [ ] Monitoring and alerting are configured. <!-- N/A -->
* [ ] Stakeholders are notified of completion.
* [ ] Follow-up actions are documented and tickets created.
* [ ] Associated ticket/epic is closed.
