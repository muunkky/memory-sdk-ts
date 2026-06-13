# step 4A: Typed filter DSL builder

Implements design B1. New module `src/filter.ts` — a typed builder emitting the spec's filter operator JSON for `SearchRequest.filters`. **Additive**; independent new file (parallel-safe). Roadmap: m2/s5/search-capabilities.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `typed-filter-dsl`
* **Feature Area/Component:** new `src/filter.ts` + export in `src/index.ts`
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
* [ ] **Associated Ticket/Epic** link is included above.
* [ ] **Feature Area/Component** is identified.
* [ ] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-4, the B1 fix) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (KD-4 + Phase 4) |
| Operator set (spec) | spec/memory.json info.description "Filter DSL" table ($eq/$ne/$in/$nin/$exists/$gt/$gte/$lt/$lte/$between, AND/OR/NOT, null=unset, implicit-AND) |
| Escape hatch type | src/types.ts:160 (`Filter = Record<string, unknown>`), SearchRequest.filters L201-206 |
| A5 reconciliation | ADR-001 A5 — DSL is key-agnostic; SDK dropped typed `metadata` field but server filters any indexed payload key |
| Test patterns | src/recall.test.ts |

## Documentation & Prior Art Review

* [ ] `README.md` or project documentation reviewed.
* [ ] Existing architecture documentation or ADRs reviewed.
* [ ] Related feature implementations or similar code reviewed.
* [ ] API documentation or interface specs reviewed [if applicable].

| Document Type | Link / Location | Key Findings / Action Required |
| :--- | :--- | :--- |
| **Design doc** | docs/designs/m2-1.0-... | `f.field(name,ops)` for multi-op; `f.all` THROWS on duplicate field |
| **Spec** | spec/memory.json | operator semantics; filters apply to any indexed payload key incl. metadata |
| **types.ts** | src/types.ts | keep `Filter=Record` as raw escape hatch; builder output assignable to it |

## Design & Planning

### Initial Design Thoughts & Requirements

* `f.field(name, ops: FieldOps)` is the ONLY multi-operator-per-field path → range = `f.field('price',{$gt:10,$lt:100})` keeps both ops (no silent clobber).
* Single-op shorthands: `f.eq/ne/in/nin/exists/between/isNull`. Combinators: `f.and/or/not`. `f.all(...)` implicit-ANDs DISTINCT-field clauses and THROWS on a same-field collision (pointing to `f.field`/`f.and`).
* Key-agnostic: builds conditions over arbitrary field-name strings (entity axes AND metadata/payload keys) — the A5 reconciliation.
* Output type assignable to `Filter` (`Record<string,unknown>`); export `f`, `Clause`, `FieldOps` from index.ts. Clarify the `filters` deprecation JSDoc (deprecated only for lifting scope axes, not the operator DSL).

### Acceptance Criteria

* [ ] Each operator + combinator emits the exact documented wire JSON.
* [ ] `f.field('x',{$gt:1,$lt:5})` keeps BOTH operators.
* [ ] `f.all` throws on a duplicate field.
* [ ] An arbitrary metadata key filters identically to an entity axis.
* [ ] Builder output assignable to `SearchRequest.filters`; `Filter=Record` retained.

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | design KD-4 | - [ ] Design Complete |
| **Test Plan Creation** | per-operator + range + throw + metadata-key | - [ ] Test Plan Approved |
| **TDD Implementation** | src/filter.ts + index export | - [ ] Implementation Complete |
| **Integration Testing** | vitest (pure builder, no network) | - [ ] Integration Tests Pass |
| **Documentation** | README Filtering section + JSDoc | - [ ] Documentation Complete |
| **Code Review** | dispatch reviewer | - [ ] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [ ] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | operator JSON + range + duplicate-throw | - [ ] Failing tests are committed and documented |
| **2. Implement Feature Code** | src/filter.ts | - [ ] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [ ] Originally failing tests now pass |
| **4. Refactor** | clean operator typing | - [ ] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing tests unchanged | - [ ] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [ ] Performance requirements are met |

### Implementation Notes

**Test Strategy:** pure unit tests — call builder, deep-equal the emitted object against expected wire JSON. No network.

**Key Implementation Decisions:** single-field `f.field` + throwing `f.all` make a silently-wrong range unrepresentable (the reviewed B1 fix).

## Definition of Done

### Intent

A SDK user can construct metadata/entity filters with a typed, discoverable builder instead of hand-writing raw `filters` JSON, and the builder cannot silently produce a wrong query — a two-operator range keeps both operators, and an accidental duplicate field is a loud error, not a silent drop. If broken, users would build filters that match the wrong rows with no warning.

### Observable outcomes

- [ ] **Capstone:** a test builds `f.all(f.eq('agent_id','bot'), f.field('score',{$gte:0.5,$lt:0.9}), f.in('plan',['a','b']))` and asserts the emitted object deep-equals the documented wire shape with BOTH range operators present; a second assertion shows `f.all(f.eq('x',1), f.eq('x',2))` throws; the result is assignable to `SearchRequest.filters` and round-trips through `search()` (mocked).
- [ ] `f`, `Clause`, `FieldOps` exported from `src/index.ts`; `Filter=Record` escape hatch retained; `filters` JSDoc clarified.
- [ ] `npm run typecheck && npm test && npm run build` green.
- [ ] No capstone caveat: single user-visible feature (the filter builder).

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
| **Future Enhancements** | Optional typed `filter` param on SearchRequest (raw escape hatch already works) |

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
