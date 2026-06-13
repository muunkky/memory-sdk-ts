# step 2B: Error-envelope and rate-limit hardening

Implements ADR-001 A1 (error-envelope) + A3 (rate-limit). Two cohesive capabilities in the same files (`src/http.ts`, `src/errors.ts`) — packed together deliberately because they edit the same `request()`/error path and would conflict if split into parallel worktrees. **Additive, non-breaking.** Roadmap: m2/s5/spec-contract-alignment.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — features `error-envelope-mismatch`, `rate-limit-headers`
* **Feature Area/Component:** HTTP transport (`src/http.ts`) + errors (`src/errors.ts`)
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
* [ ] **Associated Ticket/Epic** link is included above.
* [ ] **Feature Area/Component** is identified.
* [ ] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-1 parseErrorBody, KD-2 rate-limit) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (Phase 2) |
| Current error parse | src/http.ts:117-127 (`toError` reads `parsed.error`) |
| errorForStatus + defaults | src/errors.ts:43-66 (`code` defaults to 'unknown_error') |
| Legacy body type | src/types.ts:339-347 (`ApiErrorBody` = `{error:{...}}`) |
| Header reads today | src/http.ts:77 (x-request-id), 119 (retry-after) |
| request() return | src/http.ts:33 (`{body,status,requestId}`) |
| Test patterns (mocked fetch) | src/recall.test.ts, src/groups.test.ts |

## Documentation & Prior Art Review

* [ ] `README.md` or project documentation reviewed.
* [ ] Existing architecture documentation or ADRs reviewed.
* [ ] Related feature implementations or similar code reviewed.
* [ ] API documentation or interface specs reviewed [if applicable].

| Document Type | Link / Location | Key Findings / Action Required |
| :--- | :--- | :--- |
| **ADR-001** | docs/adr/ADR-001-... | A1 harden both envelopes; A3 additive rate-limit |
| **Design doc** | docs/designs/m2-1.0-... | KD-1 legacy-first precedence + detail string/obj/array; KD-2 no client snapshot |
| **Similar code** | src/errors.ts | errorForStatus is the status→subclass mapper; keep unchanged below body shape |

## Design & Planning

### Initial Design Thoughts & Requirements

* `parseErrorBody(parsed)` → `{type?,code?,message?,details?}`. Precedence: `error` object → 422 `detail[]` array (synthetic code `validation_error`, raw array under `details.validation_errors`) → `detail` object `{code,message}` → `detail` string `{message}` → null. Array-check BEFORE object-check (a JS array is `typeof 'object'`).
* `RateLimitSnapshot {limit?,remaining?,reset?}` parsed (Number.isFinite) from `RateLimit-Limit/Remaining/Reset`; on `request()` return as `rateLimit?`, and on `MemoryError.rateLimit?` / `RateLimited`. NO client-level snapshot (racy under concurrent recall).
* Legacy `{error:{...}}` behavior must be byte-identical (regression lock).

### Acceptance Criteria

* [ ] Legacy `{error:{type,code,message,details}}` parses exactly as today.
* [ ] Spec `{detail:{code,message}}` yields that code/message.
* [ ] 422 `{detail:[{loc,msg,type}]}` → code `validation_error`, array under `details.validation_errors`.
* [ ] FastAPI `{detail:"string"}` → message is that string.
* [ ] `RateLimit-*` present → parsed onto return + raised error; absent → undefined, no throw.

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | ADR-001 + design KD-1/KD-2 | - [ ] Design Complete |
| **Test Plan Creation** | 4 error fixtures + rate-limit present/absent | - [ ] Test Plan Approved |
| **TDD Implementation** | src/errors.ts (parseErrorBody, RateLimitSnapshot), src/http.ts | - [ ] Implementation Complete |
| **Integration Testing** | vitest mocked fetch | - [ ] Integration Tests Pass |
| **Documentation** | README error/rate-limit note; JSDoc | - [ ] Documentation Complete |
| **Code Review** | dispatch reviewer | - [ ] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK, published via release card | - [ ] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | 4 error-body fixtures + 2 rate-limit fixtures | - [ ] Failing tests are committed and documented |
| **2. Implement Feature Code** | parseErrorBody + header parsing + types | - [ ] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [ ] Originally failing tests now pass |
| **4. Refactor** | keep errorForStatus mapping intact | - [ ] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing error/recall/groups tests unchanged | - [ ] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [ ] Performance requirements are met |

### Implementation Notes

**Test Strategy:** vitest with a fake `fetch`/`HttpClient` returning crafted bodies + headers (mirror src/recall.test.ts). Assert on thrown `MemoryError` subclass, `.code`, `.message`, `.details`, `.rateLimit`.

**Key Implementation Decisions:** legacy-first precedence guarantees zero regression; 422 synthetic code `validation_error` is switchable in one place; rate-limit exposed only on unambiguous per-response surfaces.

## Definition of Done

### Intent

When the live API returns an error, an SDK consumer gets a usable, stable `code` and `message` regardless of which body shape the server emits — the legacy `{error:...}`, the spec `{detail:{code,message}}`, FastAPI's `{detail:"..."}` string, or a 422 field-error array — instead of silently degrading to `unknown_error`. Separately, callers can read the server's rate-limit bucket state off any response and off a thrown error, so they can back off proactively. If broken, a consumer's `catch` block would see `unknown_error`/generic messages for real server errors, or have no visibility into rate limits.

### Observable outcomes

- [ ] **Capstone (errors):** a single test suite drives all four body shapes through the real `request()`→`toError` path against a mocked fetch and asserts the resulting `MemoryError` carries the right subclass + extracted `code`/`message` (and `details.validation_errors` for 422) — the legacy shape's result is unchanged from current behavior.
- [ ] **Capstone (rate-limit):** given a mocked response carrying `RateLimit-Limit/Remaining/Reset`, the value is readable as a `RateLimitSnapshot` on the `request()` return and on a thrown `RateLimited`; given a response with none, the fields are `undefined` and nothing throws.
- [ ] `parseErrorBody` precedence is `error` → `detail[]` → `detail{}` → `detail""` → null; exported `RateLimitSnapshot` type re-exported from `src/index.ts`.
- [ ] `npm run typecheck && npm test && npm run build` all green; existing tests unchanged.

## Validation & Closeout

| Task | Detail/Link |
| :--- | :--- |
| **Code Review** | dispatch reviewer |
| **QA Verification** | vitest suite |
| **Staging Deployment** | N/A — npm SDK |
| **Production Deployment** | via release card (v0.3.0) |
| **Monitoring Setup** | N/A |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Postmortem Required?** | No |
| **Further Investigation?** | Probe live error shape when creds exist (ADR-001 Validation) |
| **Technical Debt Created?** | No — additive |
| **Future Enhancements** | Success-path rate-limit aggregate deferred (KD-2) |

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
