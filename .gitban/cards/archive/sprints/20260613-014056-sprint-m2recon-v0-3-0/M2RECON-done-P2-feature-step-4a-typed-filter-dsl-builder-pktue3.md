# step 4A: Typed filter DSL builder

Implements design B1. New module `src/filter.ts` — a typed builder emitting the spec's filter operator JSON for `SearchRequest.filters`. **Additive**; independent new file (parallel-safe). Roadmap: m2/s5/search-capabilities.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `typed-filter-dsl`
* **Feature Area/Component:** new `src/filter.ts` + export in `src/index.ts`
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
- [x] **Associated Ticket/Epic** link is included above.
- [x] **Feature Area/Component** is identified.
- [x] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-4, the B1 fix) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (KD-4 + Phase 4) |
| Operator set (spec) | spec/memory.json info.description "Filter DSL" table ($eq/$ne/$in/$nin/$exists/$gt/$gte/$lt/$lte/$between, AND/OR/NOT, null=unset, implicit-AND) |
| Escape hatch type | src/types.ts:160 (`Filter = Record<string, unknown>`), SearchRequest.filters L201-206 |
| A5 reconciliation | ADR-001 A5 — DSL is key-agnostic; SDK dropped typed `metadata` field but server filters any indexed payload key |
| Test patterns | src/recall.test.ts |

## Documentation & Prior Art Review

- [x] `README.md` or project documentation reviewed.
- [x] Existing architecture documentation or ADRs reviewed.
- [x] Related feature implementations or similar code reviewed.
- [x] API documentation or interface specs reviewed [if applicable].

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

- [x] Each operator + combinator emits the exact documented wire JSON.
- [x] `f.field('x',{$gt:1,$lt:5})` keeps BOTH operators.
- [x] `f.all` throws on a duplicate field.
- [x] An arbitrary metadata key filters identically to an entity axis.
- [x] Builder output assignable to `SearchRequest.filters`; `Filter=Record` retained.

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | design KD-4 | - [x] Design Complete |
| **Test Plan Creation** | per-operator + range + throw + metadata-key | - [x] Test Plan Approved |
| **TDD Implementation** | src/filter.ts + index export | - [x] Implementation Complete |
| **Integration Testing** | vitest (pure builder, no network) | - [x] Integration Tests Pass |
| **Documentation** | README Filtering section + JSDoc | - [x] Documentation Complete |
| **Code Review** | dispatch reviewer | - [x] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [x] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | operator JSON + range + duplicate-throw | - [x] Failing tests are committed and documented |
| **2. Implement Feature Code** | src/filter.ts | - [x] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [x] Originally failing tests now pass |
| **4. Refactor** | clean operator typing | - [x] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing tests unchanged | - [x] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [x] Performance requirements are met |

### Implementation Notes

**Test Strategy:** pure unit tests — call builder, deep-equal the emitted object against expected wire JSON. No network.

**Key Implementation Decisions:** single-field `f.field` + throwing `f.all` make a silently-wrong range unrepresentable (the reviewed B1 fix).

## Definition of Done

### Intent

A SDK user can construct metadata/entity filters with a typed, discoverable builder instead of hand-writing raw `filters` JSON, and the builder cannot silently produce a wrong query — a two-operator range keeps both operators, and an accidental duplicate field is a loud error, not a silent drop. If broken, users would build filters that match the wrong rows with no warning.

### Observable outcomes

- [x] **Capstone:** a test builds `f.all(f.eq('agent_id','bot'), f.field('score',{$gte:0.5,$lt:0.9}), f.in('plan',['a','b']))` and asserts the emitted object deep-equals the documented wire shape with BOTH range operators present; a second assertion shows `f.all(f.eq('x',1), f.eq('x',2))` throws; the result is assignable to `SearchRequest.filters` and round-trips through `search()` (mocked).
- [x] `f`, `Clause`, `FieldOps` exported from `src/index.ts`; `Filter=Record` escape hatch retained; `filters` JSDoc clarified.
- [x] `npm run typecheck && npm test && npm run build` green.
- [x] No capstone caveat: single user-visible feature (the filter builder).

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

**Status:** implementation complete, gate green, left in `in_progress` for reviewer. Completion tag `M2RECON-pktue3-done` → commit `235c558`.

### What shipped
- **`src/filter.ts`** — the typed, key-agnostic filter DSL builder `f` (design B1 / KD-4). Exports `f`, `Clause`, `Comparable`, `FieldOps`.
  - `f.field(name, ops)` is the only multi-operator-per-field path → a two-sided range keeps BOTH operators (`{$gt,$lt}`); the ops object is copied so a later caller mutation can't corrupt the clause.
  - Single-op shorthands `eq/ne/in/nin/exists/between/isNull` emit the documented `$op` wire JSON (`isNull` → `{field: null}`, null = unset). `in`/`nin` copy the input array.
  - Combinators `and/or/not` emit the `AND`/`OR`/`NOT` wire keys (not `$and`/`$or` — confirmed against spec/memory.json Filter DSL table).
  - `f.all(...)` implicit-ANDs DISTINCT-field clauses into one object and THROWS on a same-field collision (message names the field and points at `f.field`/`f.and`); does not mutate inputs.
  - Key-agnostic by construction: an arbitrary metadata/payload key (`tier`) builds the identical wire shape to an entity axis (`agent_id`) — the ADR-001 A5 reconciliation, no typed `metadata` field reintroduced.
- **`src/index.ts`** — exported `f` (value) + `Clause`/`Comparable`/`FieldOps` (types).
- **`src/types.ts`** — clarified the `SearchRequest.filters` JSDoc: the operator DSL over payload keys is **supported and not deprecated**; `@deprecated` applies *only* to lifting scope axes (`user_id`/`agent_id`/`app_id`) out of `filters`. `Filter = Record<string, unknown>` escape hatch retained.
- **`README.md`** — new "Filtering" section: `f` builder example (mixed eq/range/in via `f.all`), shorthand/combinator reference, the key-agnostic metadata-key note, and the escape-hatch/deprecation clarification.

### What the tests actually proved
`src/filter.test.ts` — **21 unit tests, all pure** (no network; the capstone uses a mocked `HttpClient`). They verify, against deep-equal expected wire JSON:
- each operator + combinator emits the exact documented shape;
- `f.field('price',{$gt:10,$lt:100})` keeps BOTH operators (the B1 anti-clobber fix);
- `f.all(f.eq('x',1),f.eq('x',2))` throws (duplicate-field, message points at `f.field`/`f.and`);
- input clauses / ops object are not mutated;
- an arbitrary metadata key (`tier`) filters identically to an entity axis (`agent_id`);
- builder output is assignable to `SearchRequest.filters` and the raw `Filter` escape hatch still type-checks;
- **capstone:** `f.all(f.eq('agent_id','bot'), f.field('score',{$gte:0.5,$lt:0.9}), f.in('plan',['a','b']))` deep-equals the documented shape with both range ops present, the duplicate-field `f.all` throws, and the result round-trips through `Memories.search()` (mocked HttpClient) — the fake records the forwarded body and asserts `filters` is passed verbatim.

**Scope honesty:** the capstone's round-trip is verified against a **mocked `HttpClient`**, NOT a live API — consistent with the design's "TDD, mocked HttpClient" strategy for B1 (pure builder, no network). The builder emits the JSON the spec's Filter DSL table documents; server-side acceptance of that JSON is a spec-level claim already tracked for live-API confirmation in ADR-001 Validation, not re-opened here.

### Gate
`npm run typecheck` clean · `npm test` 72/72 green (21 new + 51 existing, no regressions) · `npm run build` success (CJS+ESM+DTS). Ran in the worktree, not deferred to CI.

### Scope boundary
This card is B1 only (the filter builder). B2 (`include` threading into recall) and B3 (`searchAll()`) are separate Phase-4 cards in this sprint — intentionally untouched here.

### Deferred / follow-ups
None. No tech debt created. The two pre-existing open threads (live-API probe; metadata-key-filtering server-side behaviour) are already tracked in ADR-001 Validation and this design doc respectively — not re-captured.

### Unchecked boxes (intentionally left for downstream owners)
Code Review Approved / Deployment Plan Ready / Performance (N/A per card) / "PR merged" / "deployed to production" / "monitoring" / "stakeholders notified" / "follow-up tickets" / "associated ticket closed" — owned by the reviewer, dispatcher, and release card, not the executor.
