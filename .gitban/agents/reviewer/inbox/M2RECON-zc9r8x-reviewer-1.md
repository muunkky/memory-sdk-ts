---
verdict: APPROVAL
card_id: zc9r8x
review_number: 1
commit: b4c1254
date: 2026-06-13
has_backlog_items: false
---

# Review: step-3-opt-in-x-api-key-auth-mode (zc9r8x)

## Verdict: APPROVAL

## Gate 1 — Completion claim

The card requires a DoD (touches a public API contract — `MemoryClientOptions`,
`HttpClientConfig`, the exported `AuthMode` type — and request-side control flow).
A DoD is present and sound:

- **Intent** is plain-English and falsifiable: an `x-api-key` consumer can opt in
  without changing the Bearer default for everyone else; names both failure modes
  (Bearer users seeing altered headers / x-api-key users unable to authenticate).
  Not a restatement of the title.
- **Capstone observable** is unfakeable: it asserts the full header set in *both*
  modes (Authorization present + x-api-key absent for bearer; the inverse for
  x-api-key; X-Org-Id in both) via a mocked `fetch` capturing the outgoing headers.
  It cannot pass by running one unit test in isolation — it pins both branches and
  the negative assertions.
- Observables are consistent with Intent and are user-observable (wire header shape),
  not implementation-detail. The `No capstone caveat` line is moot — a real capstone
  is present.

Checkbox design proves correctness if honest: the four acceptance criteria map 1:1
to the test assertions (default == today; x-api-key sends x-api-key + no Authorization;
X-Org-Id in both; plumbing options→config→request). Failure modes (absence of the
wrong header) are asserted, not just the happy path. Integrity holds — every checked
box is backed by a passing test or a real artifact; the unchecked boxes are the
correct review/merge-gated ones left for this stage.

Gate 1 passes.

## Gate 2 — Implementation quality

**ADR / design compliance.** Matches ADR-001 A2b verbatim: Bearer stays the proven
default, `x-api-key` is reachable as an opt-in, additive and non-breaking, no
dual-send (the explicit risk A2 hardens against — sending both headers — is avoided;
only one auth header is ever set). Matches design doc KD-3: `authMode?: 'bearer' |
'x-api-key'` threaded `MemoryClientOptions → defaultHttpConfig → HttpClientConfig`,
branch in `request()`. Nothing drifts from the documented decision.

**TDD.** Genuine red-then-green. At the red commit (0ef71e6) `http.ts` had a single
unconditional `Authorization: Bearer` header and `defaultHttpConfig` did not accept
`authMode`, so the two x-api-key tests and the typed config call would fail. The
green commit (b4c1254) adds the conditional and the config field. Tests define the
contract (header presence/absence as behavior), include negative cases (asserting the
*absence* of the wrong header in each mode), and exercise both the `HttpClient`
directly and the full `MemoryClient.groups.list()` plumbing path.

**No overmocking.** `fetch` is the correct seam — it is the actual network boundary,
not an internal collaborator. The system under test (header assembly in `request()`
and the options→config wiring) runs for real. The capstone path is genuinely walked.

**DRY.** The auth header is constructed in exactly one place (`request()`); a repo
scan confirms no other site sets `Authorization`/`x-api-key`. The default lives in
one place (`defaultHttpConfig`); `client.ts` threads `options.authMode` through
without a redundant second default, so there is no double-defaulting to drift.

**API hygiene.** `AuthMode` is re-exported from `index.ts`, so consumers can name
the type. JSDoc on `MemoryClientOptions.authMode`, `HttpClientConfig.authMode`, and
the `AuthMode` type; README gains an "Auth header form" subsection. DaC satisfied.

**"Byte-identical" claim — honestly scoped.** The executor correctly notes the only
behavioral delta on the default path is header-object key insertion order (`X-Org-Id`
now precedes `Authorization`), which is wire-invisible (HTTP headers are unordered)
and the default test asserts the value is preserved. This is a precise, truthful
self-attestation, not an overclaim.

**Quality gate (verified by reviewer at the under-review code state).** The card's
files (`http.ts`, `client.ts`, `http.test.ts`) are byte-identical between b4c1254 and
current HEAD (the only intervening change is an additive `index.ts` export from a
sibling filter-DSL card), so the gate is representative:
- `npm run typecheck` → exit 0
- `npm test` → 77 passed (incl. the 5 new `http.test.ts` tests)
- `npm run build` → success (ESM/CJS/DTS)

## BLOCKERS

None.

## FOLLOW-UP

None. The "confirm x-api-key acceptance against the live API when credentials exist"
note is already tracked on the card as a future-investigation item and is correctly
out of scope here (no credentials; opt-in, off by default — design-doc risk row
accepts unit-level header-shape verification for this phase). It is not a gap this
diff introduces.

## Outstanding close-out actions

- Code Review Approved checkbox → tick on approval.
- Remaining review/merge-gated boxes (PR merged, stakeholders notified, ticket
  closed) are correctly left for the PR/closeout flow.
