# step 3: Opt-in x-api-key auth mode

Implements ADR-001 A2b. Adds an opt-in `x-api-key` auth mode; the `Bearer` default is unchanged. **Additive, non-breaking.** Depends on step 2B (shares the `request()` header block in `src/http.ts` — sequence after it). Roadmap: m2/s5/spec-contract-alignment.

## Feature Overview & Context

* **Associated Ticket/Epic:** roadmap m2/s5 — feature `auth-header-form`
* **Feature Area/Component:** auth header — `src/http.ts`, `src/client.ts`
* **Target Release/Milestone:** v0.3.0

**Required Checks:**
* [ ] **Associated Ticket/Epic** link is included above.
* [ ] **Feature Area/Component** is identified.
* [ ] **Target Release/Milestone** is confirmed.

## Required Reading

| What | Where |
| :--- | :--- |
| Design (KD-3) | docs/designs/m2-1.0-spec-reconciliation-and-surface.md (Phase 3) |
| Auth header today | src/http.ts:43-48 (`Authorization: Bearer`) |
| Config builder | src/http.ts:129-146 (`defaultHttpConfig`), HttpClientConfig L4-13 |
| Client options | src/client.ts:5-18 (`MemoryClientOptions`), 28-37 (constructor wiring) |
| Test patterns | src/groups.test.ts (assert request headers via mocked fetch) |

## Documentation & Prior Art Review

* [ ] `README.md` or project documentation reviewed.
* [ ] Existing architecture documentation or ADRs reviewed.
* [ ] Related feature implementations or similar code reviewed.
* [ ] API documentation or interface specs reviewed [if applicable].

| Document Type | Link / Location | Key Findings / Action Required |
| :--- | :--- | :--- |
| **ADR-001** | docs/adr/ADR-001-... | A2b: opt-in x-api-key; default Bearer unchanged |
| **Design doc** | docs/designs/m2-1.0-... | KD-3 enum authMode 'bearer'\|'x-api-key' |
| **Similar code** | src/http.ts | headers built once in request(); X-Org-Id unconditional |

## Design & Planning

### Initial Design Thoughts & Requirements

* `MemoryClientOptions.authMode?: 'bearer' | 'x-api-key'` (default `'bearer'`) → `defaultHttpConfig` → `HttpClientConfig.authMode`.
* In `request()`: `'bearer'` → `Authorization: Bearer <key>`; `'x-api-key'` → `x-api-key: <key>` (no Authorization header). `X-Org-Id`/`X-Request-Id`/`Accept` unchanged in both.
* Enum, not boolean — leaves room for a `Token` form later without renaming.

### Acceptance Criteria

* [ ] Default (no `authMode`) sends `Authorization: Bearer <key>` — byte-identical to today.
* [ ] `authMode:'x-api-key'` sends `x-api-key: <key>` and NO `Authorization` header.
* [ ] `X-Org-Id` present in both modes.
* [ ] `authMode` plumbed options → config → request().

## Feature Work Phases

| Phase / Task | Status / Link to Artifact or Card | Universal Check |
| :--- | :--- | :---: |
| **Design & Architecture** | ADR-001 KD-3 | - [ ] Design Complete |
| **Test Plan Creation** | default + x-api-key header assertions | - [ ] Test Plan Approved |
| **TDD Implementation** | src/client.ts, src/http.ts | - [ ] Implementation Complete |
| **Integration Testing** | vitest mocked fetch | - [ ] Integration Tests Pass |
| **Documentation** | README auth section + JSDoc | - [ ] Documentation Complete |
| **Code Review** | dispatch reviewer | - [ ] Code Review Approved |
| **Deployment Plan** | N/A — npm SDK | - [ ] Deployment Plan Ready |

## TDD Implementation Workflow

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Write Failing Tests** | default-header + x-api-key-header tests | - [ ] Failing tests are committed and documented |
| **2. Implement Feature Code** | authMode plumb + conditional header | - [ ] Feature implementation is complete |
| **3. Run Passing Tests** | vitest run | - [ ] Originally failing tests now pass |
| **4. Refactor** | keep header block single-source | - [ ] Code is refactored for clarity and maintainability |
| **5. Full Regression Suite** | existing tests unchanged | - [ ] All tests pass (unit, integration, e2e) |
| **6. Performance Testing** | N/A | - [ ] Performance requirements are met |

### Implementation Notes

**Test Strategy:** mocked `fetch` capturing the headers object; assert presence/absence of `Authorization` vs `x-api-key`. Mirror src/groups.test.ts request-capture pattern.

**Key Implementation Decisions:** default path must not change; enum keeps future `Token` mode cheap.

## Definition of Done

### Intent

A consumer whose deployment authenticates via `x-api-key` (the spec's primary scheme) can configure the client to send that header instead of `Authorization: Bearer`, without the SDK changing its default for everyone else. If broken, either existing Bearer users would see altered auth headers, or x-api-key users would have no supported way to authenticate.

### Observable outcomes

- [ ] **Capstone:** constructing `new MemoryClient({apiKey,orgId})` and issuing a request sends header `Authorization: Bearer <apiKey>` and no `x-api-key`; constructing with `authMode:'x-api-key'` sends header `x-api-key: <apiKey>` and no `Authorization`; both send `X-Org-Id: <orgId>` — all asserted via a mocked fetch capturing the outgoing headers.
- [ ] `authMode` is typed on `MemoryClientOptions` (default `'bearer'`) and threaded through `defaultHttpConfig`/`HttpClientConfig`.
- [ ] `npm run typecheck && npm test && npm run build` green; existing tests unchanged.
- [ ] No capstone caveat: single user-visible feature (auth mode selection).

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
| **Further Investigation?** | Confirm x-api-key acceptance when creds exist |
| **Technical Debt Created?** | No |
| **Future Enhancements** | `Token` mode if ever needed |

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
