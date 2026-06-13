# step 2A: Spec reconciliation — auth, PATCH, metadata

Implements ADR-001 spec-side dispositions A2a/A4/A5. **Spec-only** edits to `spec/memory.json` — no SDK code. Additive/annotative (never delete/rewrite to assert un-probed claims). Roadmap: m2/s5/spec-contract-alignment. Unblocks the type-surface regen card (step 7).

## Documentation Scope & Context

* **Related Work:** ADR-001 (docs/adr/ADR-001-sdk-spec-reconciliation-policy.md), design doc Phase 1
* **Documentation Type:** OpenAPI contract (`spec/memory.json`)
* **Target Audience:** SDK consumers + maintainers locking the 1.0 contract

**Required Checks:**
* [ ] Related work/context is identified above
* [ ] Documentation type and audience are clear
* [ ] Existing documentation locations are known (avoid creating duplicates)

## Required Reading

| What | Where |
| :--- | :--- |
| Decision + dispositions | docs/adr/ADR-001-sdk-spec-reconciliation-policy.md (Application table; A2/A4/A5) |
| Auth schemes to extend | spec/memory.json L1820-1837 (ApiKeyHeader/BearerToken/OrgId) + info.description "Authentication" (~L5) |
| PATCH to annotate | spec/memory.json L514 (path), L602 (patch op), L1522-1551 (UpdateRequest) |
| metadata to annotate | spec/memory.json info.description (Memory object, Ingest contract, Filter DSL table) |
| Evidence | git show a7da7a9 — removed update() (server 405), dropped metadata, added group_ids |

## Pre-Work Documentation Audit

* [ ] Repository root reviewed for doc cruft (stray .md files, outdated READMEs)
* [ ] `/docs` directory (or equivalent) reviewed for existing coverage
* [ ] Related service/component documentation reviewed
* [ ] Team wiki or internal docs reviewed

| Document Location | Current State | Action Required |
| :--- | :--- | :--- |
| **spec/memory.json (auth)** | Documents only Token / x-api-key | Add `Authorization: Bearer <key>` as an accepted form alongside (A2a) |
| **spec/memory.json (PATCH)** | Documents PATCH /v1/memories/{id} + UpdateRequest | Annotate as removed server-side (405, PR #6); corrections via ingest (A4) |
| **spec/memory.json (metadata)** | Documents metadata on Memory/ingest + filter-DSL | Annotate as dropped server-side per a7da7a9 (A5) |

**Documentation Organization Check:**
* [ ] No duplicate documentation found across locations
* [ ] Documentation follows team's organization standards
* [ ] Cross-references between docs are working
* [ ] Orphaned or outdated docs identified for cleanup

## Documentation Work

| Task | Status / Link to Artifact | Universal Check |
| :--- | :--- | :---: |
| **A2a: add Bearer to auth schemes + Authentication prose** | spec/memory.json | - [ ] Complete |
| **A4: annotate PATCH op + UpdateRequest as removed (405)** | spec/memory.json | - [ ] Complete |
| **A5: annotate dropped metadata (Memory/ingest/filter-DSL)** | spec/memory.json | - [ ] Complete |
| **Verify spec parses** | `npx openapi-typescript spec/memory.json` | - [ ] Complete |

**Documentation Quality Standards:**
* [ ] All code examples tested and working
* [ ] All commands verified
* [ ] All links working (no 404s)
* [ ] Consistent formatting and style
* [ ] Appropriate for target audience
* [ ] Follows team's documentation style guide

## Definition of Done

### Intent

A developer reading `spec/memory.json` and a developer using the SDK no longer find a contradiction on authentication, the endpoint set, or the `metadata` field. The spec now documents the `Bearer` auth form the SDK actually sends (alongside the existing schemes), marks the `PATCH` update endpoint as removed server-side (so nobody re-implements a 405), and marks `metadata` as dropped. If this is wrong, a maintainer planning the 1.0 cut would still see the spec promising behavior the SDK doesn't deliver.

### Observable outcomes

- [ ] `spec/memory.json` security schemes + Authentication prose list `Authorization: Bearer <key>` as an accepted form **in addition to** `Token`/`x-api-key` (nothing removed).
- [ ] The `PATCH /v1/memories/{memory_id}` operation and `UpdateRequest` schema carry a removal/deprecation annotation citing the 405 (PR #6), and state corrections flow through ingest — the entries are annotated, not deleted.
- [ ] `metadata` references in `info.description` (Memory object, ingest contract, filter-DSL table) are annotated as dropped server-side per `a7da7a9`.
- [ ] **Capstone:** `npx openapi-typescript spec/memory.json -o /tmp/_m2check.ts` exits 0 (the corrected spec parses), and `grep -n "Bearer" spec/memory.json` shows the added auth form. No `Authorization: Token`/`x-api-key` scheme was removed (diff is additive/annotative only).

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

* [ ] All documentation tasks from work plan are complete
* [ ] Documentation is in the correct location (not in root dir or random places)
* [ ] Cross-references to related docs are added
* [ ] Documentation is peer-reviewed for accuracy
* [ ] No doc cruft left behind (old files cleaned up)
* [ ] Future maintenance plan identified [if applicable]
* [ ] Related work cards are updated [if applicable]
