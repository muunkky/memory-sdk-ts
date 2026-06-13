# step 4B: recall include[] for full_content

Implements design B2. Threads `include?: Array<'full_content'>` through `recall()` into its per-pool searches. **Additive.** Edits `src/memories.ts` + `src/types.ts` (shared with steps 5/6 — sequence those after this). Roadmap: m2/s5/search-capabilities.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `search-include-mechanism`
* **Feature Area/Component:** `src/memories.ts` (`recall`), `src/types.ts` (`RecallParams`)
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
* [ ] **Associated Ticket/Epic** link is included above.
* [ ] **Feature Area/Component** is identified.
* [ ] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-5 — why full_content only) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (KD-5 + Phase 4) |
| recall per-pool fan-out | src/memories.ts:298-474 (search call at L369: `this.search({query,mode,limit,...pool})`) |
| RecallParams | src/types.ts:222-252 |
| include on SearchRequest | src/types.ts:200; full_content L46; extras.context_prompt L154 |
| Test patterns | src/recall.test.ts (mocked HttpClient, multi-pool) |

## Documentation & Prior Art Review

* [ ] `README.md` or project documentation reviewed.
* [ ] Existing architecture documentation or ADRs reviewed.
* [ ] Related feature implementations or similar code reviewed.
* [ ] API documentation or interface specs reviewed [if applicable].

| Document Type | Link / Location | Key Findings / Action Required |
| :--- | :--- | :--- |
| **Design doc** | docs/designs/m2-1.0-... | recall discards per-pool envelopes → only `full_content` is coherent, not `context_prompt` |
| **memories.ts** | src/memories.ts | per-pool search spread has no `include` today; add it without disturbing dedupe/rank |
| **types.ts** | src/types.ts | add `include?: Array<'full_content'>` to RecallParams |

## Design & Planning

### Initial Design Thoughts & Requirements

* Add `include?: Array<'full_content'>` to `RecallParams` (NOT `context_prompt` — recall renders its own single prompt and discards per-pool extras, so context_prompt would be a silent no-op).
* Thread into the per-pool search: `this.search({ query, mode, limit, include, ...pool }, ctx)` (L369). `...pool` has no `include` → no collision.
* `retrieve()`/`search()` keep the full `Array<'context_prompt'|'full_content'>` union (envelope returned intact there).
* `full_content` is typed-accessible on returned artifact rows (`ArtifactDetails.full_content`).

### Acceptance Criteria

* [ ] `RecallParams.include?: Array<'full_content'>` exists and is forwarded to EVERY per-pool search.
* [ ] `include` omitted → request body has no `include` (unchanged behavior).
* [ ] `full_content` reachable on returned artifact memories.
* [ ] `context_prompt` NOT accepted on RecallParams (compile-time).

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | design KD-5 | - [ ] Design Complete |
| **Test Plan Creation** | include-forwarded-to-all-pools test | - [ ] Test Plan Approved |
| **TDD Implementation** | src/types.ts, src/memories.ts | - [ ] Implementation Complete |
| **Integration Testing** | vitest mocked HttpClient | - [ ] Integration Tests Pass |
| **Documentation** | README recall include note | - [ ] Documentation Complete |
| **Code Review** | dispatch reviewer | - [ ] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [ ] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | assert each pool's search body carries include | - [ ] Failing tests are committed and documented |
| **2. Implement Feature Code** | RecallParams + thread include | - [ ] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [ ] Originally failing tests now pass |
| **4. Refactor** | no disturbance to dedupe/rank | - [ ] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | recall.test.ts unchanged-pass | - [ ] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [ ] Performance requirements are met |

### Implementation Notes

**Test Strategy:** capture the bodies passed to a mocked `HttpClient.request` across the fan-out; assert each carries `include:['full_content']`. Reuse src/recall.test.ts multi-pool harness.

**Key Implementation Decisions:** scope include to full_content (KD-5) — context_prompt has no output channel in RecallResult.

## Definition of Done

### Intent

A caller using `recall()` to assemble a prompt can additionally ask the server to include heavy artifact bodies (`full_content`) on the rows it returns, instead of having to issue separate `get()` calls. If broken, `recall` would either ignore the include request or only enrich some of the unioned scopes.

### Observable outcomes

- [ ] **Capstone:** calling `recall({ query, pools:[{user_id:'a'},{group_ids:['g']}], include:['full_content'] })` against a mocked HttpClient results in EVERY per-pool `/v1/memories/search` body carrying `include:['full_content']`; omitting `include` results in no `include` key on any pool body.
- [ ] `RecallParams.include` is typed `Array<'full_content'>` (context_prompt rejected at compile time); `ArtifactDetails.full_content` accessible on returned rows.
- [ ] `npm run typecheck && npm test && npm run build` green; recall.test.ts passes unchanged.
- [ ] No capstone caveat: single user-visible feature (recall include).

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
| **Further Investigation?** | per-scope prompt exposure if ever needed (KD-5) |
| **Technical Debt Created?** | No |
| **Future Enhancements** | RecallResult.perScopePrompts (deferred) |

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
