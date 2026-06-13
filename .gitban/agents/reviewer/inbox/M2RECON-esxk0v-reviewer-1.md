---
verdict: APPROVAL
card_id: esxk0v
review_number: 1
commit: 39e11c5
date: 2026-06-12
has_backlog_items: false
---

# Review — step-2A: Spec reconciliation (auth, PATCH, metadata)

Spec-only card implementing ADR-001 dispositions A2a / A4 / A5 as additive,
annotative edits to `spec/memory.json`. Single file, 16 insertions / 4
deletions (the 4 "deletions" are four in-place line replacements — the
`info.description` mega-string, the PATCH `summary`, the PATCH `description`,
and the `UpdateRequest` `description` — not removals of any scheme, operation,
or schema; verified structurally).

## Gate 1 — completion claim: PASS

- **DoD present and required.** The OpenAPI spec is the project's external
  contract manifest, so a DoD is required. Intent is plain-English and
  sanity-checkable (it names the exact contradiction a consumer would
  otherwise hit and what gets corrected). Observables map one-to-one to the
  three dispositions plus a capstone.
- **Capstone is unfakeable and appropriate for a spec card.** `npx
  openapi-typescript spec/memory.json` exits 0 (the corrected spec parses as a
  valid OpenAPI 3.1 doc and emits real types) + `grep Bearer` shows the added
  form + additive-only constraint (no original scheme removed). This walks the
  real artifact end-to-end; it is not mockable. Reproduced independently
  (see Gate 2 evidence) — all three conditions hold.
- **Checkbox integrity.** The single unchecked box ("Documentation is
  peer-reviewed for accuracy") is the reviewer's gate; the executor correctly
  left the card in `in_progress` for this review to satisfy. All other checked
  boxes verified true.

## Gate 2 — implementation quality: PASS

Standard for an OpenAPI contract change: additive/annotative (ADR-001's
explicit no-delete constraint), evidence-cited prose, all prior
schemes/ops/schemas preserved, valid spec that produces types.

- **A2a (auth).** `BearerAuth` HTTP-bearer scheme added; matching
  `{BearerAuth, OrgId}` entry appended to `security[]`. `ApiKeyHeader`
  (x-api-key) and `BearerToken` (Authorization: Token) are byte-for-byte
  intact (verified by parsing the spec and inspecting `securitySchemes`).
  Authentication prose extended to list `Bearer` alongside `Token`/`x-api-key`.
  Additive — nothing removed.
- **A4 (PATCH).** `patch` on `/v1/memories/{memory_id}` and the
  `UpdateRequest` schema both marked `deprecated: true`, summary prefixed
  `[REMOVED server-side — returns 405]`, descriptions rewritten to lead with
  the 405 removal (commit `a7da7a9` / PR #6) and "corrections flow through
  ingest", original contract text retained for diff legibility. Both entries
  present, not deleted.
- **A5 (metadata).** Three blockquote annotations (Memory object, ingest
  contract, filter-DSL note) flag `metadata` as dropped server-side per
  `a7da7a9`; the filter-DSL note correctly hands the metadata-key-filtering
  question to the B1 design doc. References retained, annotated, not deleted.

**Factual accuracy against the shipping SDK (verified, not trusted):**
- `src/http.ts:44` sends `Authorization: Bearer ${apiKey}` → A2a annotation
  truthful.
- No `metadata` in `src/types.ts` → A5 annotation truthful (SDK genuinely
  dropped it).
- `src/memories.ts:230` asserts the API has no update endpoint → A4 annotation
  truthful.
  The spec is now self-consistent with the code on all three axes.

**Capstone re-run (this review):**
- `node -e JSON.parse(...)` → JSON well-formed.
- `npx openapi-typescript spec/memory.json -o /tmp/_m2check.ts` →
  openapi-typescript 7.13.0, exit 0, 57,663 bytes of types generated.
- `securitySchemes` keys = `[ApiKeyHeader, BearerToken, BearerAuth, OrgId]`;
  `security[]` retains all original entries plus the new `BearerAuth+OrgId`;
  PATCH op + UpdateRequest both present with `deprecated: true`.

**TDD / proportionality.** Documentation-only change, no runtime behavior; the
proportionality clause applies. The capstone (spec parses + additive-only) is
the correct verification and was actually executed.

**DaC.** Met — the documentation is the deliverable and it accurately
documents shipping behavior, with each annotation citing its evidence.

No blockers. Approved.

## FOLLOW-UP

None from this diff. The two known open threads are already tracked elsewhere
and are out of scope for this spec-only card:
- Live-API probe to promote the `Bearer`/error-envelope inferences from
  reasoned to confirmed — already recorded in ADR-001 Validation (revisit
  trigger on first `npm run smoke` with real credentials).
- Metadata-key filtering redesign — explicitly handed to the B1
  typed-filter-DSL design doc by the A5 filter-DSL annotation.
