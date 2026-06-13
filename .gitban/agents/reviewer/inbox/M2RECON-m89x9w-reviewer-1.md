---
verdict: REJECTION
card_id: m89x9w
review_number: 1
commit: 5319ef8
date: 2026-06-12
has_backlog_items: true
---

# Review — m89x9w (step-2B: error-envelope + rate-limit hardening)

## Summary

The code is excellent. `parseErrorBody` implements ADR-001 A1 / design KD-1
precedence exactly (legacy `{error}` → 422 `detail[]` → spec `detail{}` →
FastAPI `detail""` → null), with the array-before-object ordering correctly
called out and tested. `parseRateLimit` + the `rateLimit` threading implement
A3 / KD-2 (`Number.isFinite` guards, all-empty → `undefined`, never throws,
no client-level global). TDD is genuine: the failing test commit (`38cd33c`,
`src/errors.test.ts`, 206 lines) lands *before* the implementation commit
(`5319ef8`); the capstone suites drive crafted bodies+headers through the real
`HttpClient.request()` → `toError` → `parseErrorBody` path against a mocked
`fetch` returning a real `Response`, not a stubbed `toError`. Both capstones
are exercised end-to-end. Verified locally: `tsc --noEmit` exit 0; `vitest run`
**51 passed** (35 pre-existing unchanged + 16 new).

Gate 1 (card structure) passes: the DoD has a concrete Intent, the Observables
are user-observable, and both capstones are unfakeable (they assert subclass +
extracted `code`/`message`/`details` and snapshot values through the transport
stack). The checkbox design is sound.

One blocker, in the **documentation** (Gate 2 / DaC), not the code.

## BLOCKERS

### B1 — README documents a non-existent public API for the success-path rate-limit surface  *(code-quality / DaC)*

`README.md:206` (added by this commit) presents this as the way a consumer
reads the headline rate-limit feature on a successful response:

```ts
const { rateLimit } = await client.http.request("GET", "/v1/memories");
```

`client.http` does not exist on the published surface:

- `MemoryClient` (`src/client.ts`) exposes only `readonly memories` and
  `readonly groups`. The `HttpClient` is a local `const http` in the
  constructor — there is no `http` member.
- `HttpClient` is **not** exported from `src/index.ts`, so even
  `new HttpClient(...)` is not reachable from `@xtraceai/memory`.

So the success-path snippet **does not compile against the package** — a
consumer copying it gets `Property 'http' does not exist on type
'MemoryClient'`. The card's "Documentation Complete" box is checked, and DaC
requires checked documentation boxes to be truthful; the single user-facing
artifact for this feature's success-path channel demonstrates a phantom API.

Note on scope: this is **not** a request to widen the code. KD-2 deliberately
scopes the success-path snapshot to the `HttpClient.request()` return and
defers a public success-path aggregate to "later if demand appears … out of
scope for v0.3.0." The code honours that exactly — every public method
(`memories.search/get/ingest/list`, all `groups`, `jobs`) destructures only
`{ body }` and intentionally discards `rateLimit`. The defect is purely that
the README oversold the *public* reachability of the success-path snapshot.

**Refactor plan (pick one, all README-only):**
1. Drop the success-path `client.http.request` example and document only the
   surfaces a public consumer can actually reach today: `err.rateLimit` on a
   thrown error (the existing error-path paragraph at `README.md:212` is
   already correct and compiles), and explicitly note — per KD-2 — that the
   per-success-response snapshot is not yet exposed on the public method
   surface in v0.3.0 (deferred aggregate). **Preferred** — it tells the truth
   about the v0.3.0 surface without implying a method that isn't there.
2. Or, if a public success-path read is intended for v0.3.0 after all, that is
   a *code* change (KD-2 says it's out of scope), which would need its own card
   — do not bury it here. For this card, option 1 is the in-scope fix.

This is the only thing standing between the card and approval. Re-running
`typecheck → test → build` is unaffected (the README isn't compiled by the
gate), which is exactly why a doc-vs-public-API mismatch slipped the gate and
why it needs a human/reviewer catch.

## FOLLOW-UP

- **L1 (doc-example-compile-gap):** The README TypeScript blocks are not
  type-checked by any gate, so a non-compiling example (B1) passes
  `typecheck → test → build` silently. A lightweight `tsd`/`expect-error` or a
  doc-snippet extraction check over README ```ts fences would catch
  public-surface drift in docs. Not required for this card; surfaced because
  this diff is the first place the gap bit.

- **L2 (live-artifact-verification-gap):** All evidence is mocked-fetch only;
  the live error-body shape and `RateLimit-*` header casing/units are
  unverified against the deployed API (no creds). This is correctly the
  ADR-001 Validation follow-up ("probe live error shape when creds exist"),
  not this card's scope — recording it so the planner can keep it tracked as
  the prune-the-tolerated-branch trigger.

- **L3 (header-casing-assumption):** `parseRateLimit` reads `RateLimit-Limit`
  etc. and the tests inject exactly that casing. `Headers.get()` is
  case-insensitive per the Fetch spec, so this is fine in principle, but the
  test fixtures only ever exercise the canonical casing — a live probe (L2)
  should confirm the server uses `RateLimit-*` (RFC draft) and not, e.g.,
  `X-RateLimit-*`. Low risk; folds into L2.

## Outstanding close-out actions (for when B1 is fixed)

- Re-attest the "Documentation Complete" box against the corrected README.
- No code change required for approval; the implementation, types, exports,
  and tests are all approved as-is.
