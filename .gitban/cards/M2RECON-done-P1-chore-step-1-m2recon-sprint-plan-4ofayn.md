# step 1: M2RECON sprint plan

## Cleanup Scope & Context

* **Sprint/Release:** M2RECON → v0.3.0 (Memory SDK — Road to 1.0, roadmap m2/s5)
* **Primary Feature Work:** Reconcile the SDK with `spec/memory.json` for a stable 1.0 and add the missing search surface. All work is ADDITIVE (minor bump per RELEASING.md).
* **Cleanup Category:** Mixed (spec edits + SDK feature additions + type-surface hygiene)

**Required Checks:**
- [x] Sprint/Release is identified above.
- [x] Primary feature work that generated this cleanup is documented.

## Deferred Work Review

This sprint executes the approved M2 design. Source docs: `docs/adr/ADR-001-sdk-spec-reconciliation-policy.md`, `docs/adr/ADR-002-type-surface-source-of-truth.md`, `docs/designs/m2-1.0-spec-reconciliation-and-surface.md`.

- [x] Reviewed commit messages for "TODO" and "FIXME" comments added during sprint.
- [x] Reviewed PR comments for "out of scope" or "follow-up needed" discussions.
- [x] Reviewed code for new TODO/FIXME markers (grep for them).
- [x] Checked team chat/standup notes for deferred items.

| Cleanup Category | Specific Item / Location | Priority | Justification for Cleanup |
| :--- | :--- | :---: | :--- |
| **Spec** | spec/memory.json auth/PATCH/metadata (A2a/A4/A5) | P1 | No silent drift at 1.0 cut |
| **Feature** | error+rate-limit, x-api-key, filter DSL, recall include, searchAll, superseded | P1 | Missing 1.0 surface |
| **Build** | type-surface SoT ref + regen + reproducibility guard | P1 | Stale phantom ref; drift guard |

## Cleanup Checklist

### Documentation Updates (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **CHANGELOG** | Release notes for v0.3.0 (handled in release card) | - [x] |
| **README** | Document new surface (handled in release card) | - [x] |

### Testing & Quality (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **TDD per card** | Each code card ships vitest with mocked HttpClient (recall.test.ts/groups.test.ts patterns) | - [x] |

### Build & CI/CD (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Local gate** | typecheck→test→build green per card (no CI) | - [x] |

## Sprint Card Inventory & Sequencing

This card defines the plan; its end state is "all M2RECON cards are in todo."

1. step 1 — this plan
2. step 2A — Spec reconciliation (spec/memory.json) ∥ step 2B — Error-envelope + rate-limit hardening (http.ts/errors.ts) — disjoint files
3. step 3 — Opt-in x-api-key auth (http.ts/client.ts) — after 2B (shared http.ts)
4. step 4A — Typed filter DSL (new src/filter.ts) ∥ step 4B — recall include[] (memories.ts/types.ts) — disjoint files
5. step 5 — searchAll() (memories.ts) — after 4B (shared memories.ts)
6. step 6 — Superseded-chain helper + deferrals (memories.ts/types.ts) — after 5 (shared memories.ts)
7. step 7 — Type-surface SoT: ref fix + regen + reproducibility guard — DEPENDS ON step 2A (regen reflects corrected spec)
8. step 8 — Release: v0.3.0 bump + README/CHANGELOG — after all code cards
9. step 9 — M2RECON Sprint Closeout (final)

## Validation & Closeout

### Pre-Completion Verification

| Verification Task | Status / Evidence |
| :--- | :--- |
| **All P0 Items Complete** | N/A — no P0 in this sprint |
| **All P1 Items Complete or Ticketed** | Tracked by the 9 work cards |
| **Tests Passing** | Per-card local gate |
| **No New Warnings** | Per-card typecheck |
| **Documentation Updated** | Release card |
| **Code Review** | Per-card reviewer in dispatch |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Remaining P2 Items** | Deferrals (expand, server PromptTemplate) recorded in C2 card per ADR-002 |
| **Recurring Issues** | None yet |
| **Process Improvements** | None yet |
| **Technical Debt Tickets** | None — additive, no debt |

### Completion Checklist

<!-- gate0: upper-checklist -->

> NOTE: this is the **planning** card (step 1, runs first). Its end state is
> "the sprint is planned and all M2RECON cards are in todo" — NOT sprint
> completion. The sprint-end gate0 rows below are N/A for a planning card; the
> load-bearing criterion is the first item.

- [x] All M2RECON work cards (steps 2A–9) are created, validated, sequenced, and in `todo`. <!-- cite: none -->
- [x] N/A for planning card — P0/P1 completion is the work cards' job. <!-- cite: none -->
- [x] N/A for planning card — P2 completion is the work cards' job. <!-- cite: none -->
- [x] N/A for planning card — tests run per work card. <!-- cite: none -->
- [x] No new linter warnings or errors introduced (no code in this card). <!-- cite: none -->
- [x] Sequencing + dependencies (2A→7, 2B→3, 4B→5→6) documented above. <!-- cite: none -->
- [x] N/A for planning card — no code changes. <!-- cite: none -->
- [x] N/A for planning card — follow-ups handled by the closeout card (step 9). <!-- cite: none -->
- [x] N/A for planning card — retrospective handled by the closeout card (step 9). <!-- cite: none -->
