# step 6: Superseded-chain helper and field deferrals

Implements ADR-002 C2: wire the superseded-chain resolver (the one declared field with live support); record the deferrals for `expand`/server-`PromptTemplate` (no server trigger). **Additive.** Edits `src/memories.ts` + `src/types.ts` (shared with steps 4B/5 — sequence after 5). Roadmap: m2/s5/type-surface-finalization.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `model-expanded-and-templates`
* **Feature Area/Component:** `src/memories.ts` (`resolveSuperseded`), `src/types.ts` (deferral JSDoc)
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
* [ ] **Associated Ticket/Epic** link is included above.
* [ ] **Feature Area/Component** is identified.
* [ ] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-7) + ADR-002 C2 | docs/designs/m2-1.0-...(KD-7+Phase 5); docs/adr/ADR-002-...(C2 dispositions) |
| superseded map | src/types.ts:115-123 (`IngestJobResult.memories_superseded_by: Record<string,string>`) |
| get() to reuse | src/memories.ts:217-224 |
| fields to defer | src/types.ts:74 (`Memory.expanded`), 283 (`PromptTemplate`) |
| Test patterns | src/recall.test.ts / src/groups.test.ts (mocked HttpClient) |

## Documentation & Prior Art Review

* [ ] `README.md` or project documentation reviewed.
* [ ] Existing architecture documentation or ADRs reviewed.
* [ ] Related feature implementations or similar code reviewed.
* [ ] API documentation or interface specs reviewed [if applicable].

| Document Type | Link / Location | Key Findings / Action Required |
| :--- | :--- | :--- |
| **ADR-002** | docs/adr/ADR-002-... | wire superseded (has live support); defer expand + server PromptTemplate (no trigger) |
| **Design doc** | docs/designs/m2-1.0-... | KD-7: resolver on Memories takes IngestJobResult + oldId; batch variant optional |
| **types.ts** | src/types.ts | superseded map shape; expanded/PromptTemplate get deferral JSDoc |

## Design & Planning

### Initial Design Thoughts & Requirements

* `async resolveSuperseded(result: IngestJobResult, oldId: string, ctx?): Promise<Memory | null>` — `newId = result.memories_superseded_by?.[oldId]`; return `newId ? this.get(newId, ctx) : null`. Lives on `Memories`.
* Optional batch `resolveAllSuperseded(result): Promise<Map<string,Memory>>` (sprint may include).
* Deferrals (doc-only, NOT user-visible features): add JSDoc to `Memory.expanded` and `PromptTemplate` noting "deferred for 1.0 — no server request-side trigger/endpoint yet; see ADR-002." No code behavior change for those.

### Acceptance Criteria

* [ ] `resolveSuperseded(result, oldId)` returns the replacement Memory when `oldId` is in the map.
* [ ] Returns `null` when `oldId` is not superseded.
* [ ] `Memory.expanded` and `PromptTemplate` carry a deferral JSDoc citing ADR-002.

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | KD-7 / ADR-002 C2 | - [ ] Design Complete |
| **Test Plan Creation** | superseded-hit + miss tests | - [ ] Test Plan Approved |
| **TDD Implementation** | src/memories.ts + types.ts JSDoc | - [ ] Implementation Complete |
| **Integration Testing** | vitest mocked HttpClient | - [ ] Integration Tests Pass |
| **Documentation** | README superseded helper note + deferral JSDoc | - [ ] Documentation Complete |
| **Code Review** | dispatch reviewer | - [ ] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [ ] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | superseded id→replacement; non-superseded→null | - [ ] Failing tests are committed and documented |
| **2. Implement Feature Code** | resolveSuperseded (+ optional batch) | - [ ] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [ ] Originally failing tests now pass |
| **4. Refactor** | reuse get(); clean JSDoc | - [ ] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing tests unchanged | - [ ] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [ ] Performance requirements are met |

### Implementation Notes

**Test Strategy:** mocked HttpClient where `get(newId)` returns a stub Memory; assert resolveSuperseded follows the map and returns it, and returns null for an absent old id.

**Key Implementation Decisions:** take the IngestJobResult explicitly (the only place the superseded map exists) rather than pretend old ids are globally queryable.

## Definition of Done

### Intent

After an ingest supersedes a fact, a caller can ask the SDK "what replaced my old fact?" and get the new memory back, instead of manually reading the `memories_superseded_by` map and calling `get()` themselves. The two forward-looking type fields that the API does not yet support (`expand`, server-supplied templates) are explicitly marked deferred so a reader knows they're intentional, not forgotten. If broken, a caller chasing a superseded fact would get the wrong memory or no guidance that the inert fields are deferred.

### Observable outcomes

- [ ] **Capstone:** given an `IngestJobResult` whose `memories_superseded_by` maps `old1 → new1`, `resolveSuperseded(result, 'old1')` returns the `Memory` that `get('new1')` yields (mocked), and `resolveSuperseded(result, 'unknown')` returns `null`.
- [ ] `Memory.expanded` and `PromptTemplate` JSDoc state the 1.0 deferral and cite ADR-002.
- [ ] `npm run typecheck && npm test && npm run build` green.
- [ ] No capstone caveat: the deferrals are doc-only (not user-visible features); the single user-visible feature is the superseded resolver, covered above.

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
| **Further Investigation?** | Revisit expand/server-template when API exposes them |
| **Technical Debt Created?** | No — deferrals recorded, not silent |
| **Future Enhancements** | expand param + template fetch when server supports |

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
