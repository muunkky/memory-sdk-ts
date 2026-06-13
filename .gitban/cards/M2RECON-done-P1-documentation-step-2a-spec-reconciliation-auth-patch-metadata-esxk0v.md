# step 2A: Spec reconciliation — auth, PATCH, metadata

Implements ADR-001 spec-side dispositions A2a/A4/A5. **Spec-only** edits to `spec/memory.json` — no SDK code. Additive/annotative (never delete/rewrite to assert un-probed claims). Roadmap: m2/s5/spec-contract-alignment. Unblocks the type-surface regen card (step 7).

## Documentation Scope & Context

* **Related Work:** ADR-001 (docs/adr/ADR-001-sdk-spec-reconciliation-policy.md), design doc Phase 1
* **Documentation Type:** OpenAPI contract (`spec/memory.json`)
* **Target Audience:** SDK consumers + maintainers locking the 1.0 contract

**Required Checks:**
- [x] Related work/context is identified above
- [x] Documentation type and audience are clear
- [x] Existing documentation locations are known (avoid creating duplicates)

## Required Reading

| What | Where |
| :--- | :--- |
| Decision + dispositions | docs/adr/ADR-001-sdk-spec-reconciliation-policy.md (Application table; A2/A4/A5) |
| Auth schemes to extend | spec/memory.json L1820-1837 (ApiKeyHeader/BearerToken/OrgId) + info.description "Authentication" (~L5) |
| PATCH to annotate | spec/memory.json L514 (path), L602 (patch op), L1522-1551 (UpdateRequest) |
| metadata to annotate | spec/memory.json info.description (Memory object, Ingest contract, Filter DSL table) |
| Evidence | git show a7da7a9 — removed update() (server 405), dropped metadata, added group_ids |

## Pre-Work Documentation Audit

- [x] Repository root reviewed for doc cruft (stray .md files, outdated READMEs)
- [x] `/docs` directory (or equivalent) reviewed for existing coverage
- [x] Related service/component documentation reviewed
- [x] Team wiki or internal docs reviewed

| Document Location | Current State | Action Required |
| :--- | :--- | :--- |
| **spec/memory.json (auth)** | Documents only Token / x-api-key | Add `Authorization: Bearer <key>` as an accepted form alongside (A2a) |
| **spec/memory.json (PATCH)** | Documents PATCH /v1/memories/{id} + UpdateRequest | Annotate as removed server-side (405, PR #6); corrections via ingest (A4) |
| **spec/memory.json (metadata)** | Documents metadata on Memory/ingest + filter-DSL | Annotate as dropped server-side per a7da7a9 (A5) |

**Documentation Organization Check:**
- [x] No duplicate documentation found across locations
- [x] Documentation follows team's organization standards
- [x] Cross-references between docs are working
- [x] Orphaned or outdated docs identified for cleanup

## Documentation Work

| Task | Status / Link to Artifact | Universal Check |
| :--- | :--- | :---: |
| **A2a: add Bearer to auth schemes + Authentication prose** | spec/memory.json | - [x] Complete |
| **A4: annotate PATCH op + UpdateRequest as removed (405)** | spec/memory.json | - [x] Complete |
| **A5: annotate dropped metadata (Memory/ingest/filter-DSL)** | spec/memory.json | - [x] Complete |
| **Verify spec parses** | `npx openapi-typescript spec/memory.json` | - [x] Complete |

**Documentation Quality Standards:**
- [x] All code examples tested and working
- [x] All commands verified
- [x] All links working (no 404s)
- [x] Consistent formatting and style
- [x] Appropriate for target audience
- [x] Follows team's documentation style guide

## Definition of Done

### Intent

A developer reading `spec/memory.json` and a developer using the SDK no longer find a contradiction on authentication, the endpoint set, or the `metadata` field. The spec now documents the `Bearer` auth form the SDK actually sends (alongside the existing schemes), marks the `PATCH` update endpoint as removed server-side (so nobody re-implements a 405), and marks `metadata` as dropped. If this is wrong, a maintainer planning the 1.0 cut would still see the spec promising behavior the SDK doesn't deliver.

### Observable outcomes

- [x] `spec/memory.json` security schemes + Authentication prose list `Authorization: Bearer <key>` as an accepted form **in addition to** `Token`/`x-api-key` (nothing removed).
- [x] The `PATCH /v1/memories/{memory_id}` operation and `UpdateRequest` schema carry a removal/deprecation annotation citing the 405 (PR #6), and state corrections flow through ingest — the entries are annotated, not deleted.
- [x] `metadata` references in `info.description` (Memory object, ingest contract, filter-DSL table) are annotated as dropped server-side per `a7da7a9`.
- [x] **Capstone:** `npx openapi-typescript spec/memory.json -o /tmp/_m2check.ts` exits 0 (the corrected spec parses), and `grep -n "Bearer" spec/memory.json` shows the added auth form. No `Authorization: Token`/`x-api-key` scheme was removed (diff is additive/annotative only).

## Validation & Closeout

| Task | Detail/Link |
| :--- | :--- |
| **Final Location** | spec/memory.json (repo root spec/) |
| **Path to final** | spec/memory.json |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Documentation Gaps Identified?** | Probe-the-live-API follow-up noted in ADR-001 Validation |
| **Style Guide Updates Needed?** | No |
| **Future Maintenance Plan** | Regen of generated types tracked in step 7 |

### Completion Checklist

- [x] All documentation tasks from work plan are complete
- [x] Documentation is in the correct location (not in root dir or random places)
- [x] Cross-references to related docs are added
- [x] Documentation is peer-reviewed for accuracy
- [x] No doc cruft left behind (old files cleaned up)
- [x] Future maintenance plan identified [if applicable]
- [x] Related work cards are updated [if applicable]




---

## Close-out (executor, cycle 1)

**Shipped** — `spec/memory.json` only (no SDK code), commit `39e11c5` on
`worktree-agent-a3086386c774817a5`. All edits are additive/annotative per
ADR-001's no-delete constraint; the `git diff` reports 16 insertions / 4
deletions, and the 4 "deletions" are the four in-place line modifications
(the `info.description` mega-string, the PATCH `summary`, the PATCH
`description`, and the `UpdateRequest` `description`) — no security scheme,
operation, or schema was removed.

- **A2a (auth, additive):** Added a `BearerAuth` HTTP-bearer security scheme
  (`bearerFormat: "API key"`, `Authorization: Bearer <api-key>`) and a
  matching `{BearerAuth, OrgId}` entry to the top-level `security[]` array,
  alongside the untouched `ApiKeyHeader` (x-api-key) and `BearerToken`
  (Authorization: Token) schemes. Extended the `## Authentication` prose in
  `info.description` to list the `Bearer` form first (the SDK's shipping
  default through v0.2.1) *in addition to* `Token`/`x-api-key`. Nothing
  removed.
- **A4 (PATCH removed, annotated):** Marked `patch` on
  `/v1/memories/{memory_id}` `deprecated: true`, prefixed its summary with
  `[REMOVED server-side — returns 405]`, and rewrote its description to lead
  with the 405 removal (commit `a7da7a9` / PR #6) and "corrections flow
  through ingest", retaining the original contract text for diff legibility.
  Did the same to the `UpdateRequest` schema (`deprecated: true` + removal
  note). Both entries retained, not deleted.
- **A5 (metadata dropped, annotated):** Added three blockquote annotations in
  `info.description` — Memory object code block, Ingest contract code block,
  and the Filter-DSL section — flagging `metadata` as dropped server-side per
  `a7da7a9`, with the filter-DSL note handing the metadata-key-filtering
  question to the B1 design doc. The `metadata` references themselves are
  retained (annotated, not deleted).

**Tests / verification actually run** (in the worktree):
- `node -e "JSON.parse(...)"` → **PASS** (spec is well-formed JSON after edit).
- Capstone: `npx openapi-typescript spec/memory.json -o /tmp/_m2check.ts` →
  **exit 0** (openapi-typescript 7.13.0, 57 KB of types generated). The
  corrected spec parses.
- `grep -n "Bearer" spec/memory.json` → shows the added auth form (prose +
  `BearerAuth` scheme + `security[]` entry). Confirmed `ApiKeyHeader`,
  `BearerToken`, and the `Authorization: Token` prose are all still present
  (3 hits) — additive-only verified.

These are static-spec checks (parse + grep) — the appropriate evidence for a
spec-only card; there is no runtime/live-API surface to exercise here, and no
SDK code changed, so the code pre-commit gate does not apply (ADR-001
Implementation Notes: spec-only edits skip the code gate).

**Deferred / out of scope:** the opt-in `x-api-key` *code* path (A2's second
half) and the A1/A3 SDK hardening are separate cards, not this one. The
metadata-filtering redesign is owned by the B1 design doc (flagged in the A5
filter-DSL annotation). Unblocks the type-surface regen card (step 7).

**Left for reviewer:** the single unchecked box — "Documentation is
peer-reviewed for accuracy" — is the reviewer's gate; card left in
`in_progress` for the reviewer to flip per the executor workflow.


## Review Log — cycle 1

**Verdict: APPROVAL** (reviewer cycle 1, commit `39e11c5`)

- Report: `.gitban/agents/reviewer/inbox/M2RECON-esxk0v-reviewer-1.md`
- Gate 1 (completion claim): PASS — DoD present and required; capstone unfakeable (spec parses via `openapi-typescript`, additive-only verified); checkbox integrity confirmed.
- Gate 2 (implementation quality): PASS — A2a/A4/A5 all additive/annotative per ADR-001's no-delete constraint; factual accuracy verified against the shipping SDK (`src/http.ts`, `src/types.ts`, `src/memories.ts`); capstone re-run independently (exit 0, all schemes/ops/schemas preserved).
- Blockers: none.
- Follow-up: none from this diff. The two known open threads (live-API probe to confirm Bearer/error-envelope inferences; metadata-key-filtering redesign) are already tracked in ADR-001 Validation and the B1 typed-filter-DSL design doc respectively — out of scope for this spec-only card.

Routed APPROVAL close-out to executor: `.gitban/agents/executor/inbox/M2RECON-esxk0v-executor-1.md`. No planner routing (no non-blocking follow-up to capture).
