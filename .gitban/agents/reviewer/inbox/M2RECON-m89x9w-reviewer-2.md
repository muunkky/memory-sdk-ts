---
verdict: APPROVAL
card_id: m89x9w
review_number: 2
commit: f3a8893
date: 2026-06-12
has_backlog_items: false
---

# Review — m89x9w (step-2B: error-envelope + rate-limit hardening) — cycle 2

## Summary

**APPROVED.** Cycle 1 rejected on a single Gate 2 / DaC blocker (B1): the README
documented a phantom public API (`client.http.request`) for the success-path
rate-limit surface. The implementation, types, exports, and tests were all
approved as-is in cycle 1 — only the documentation was wrong.

Commit `f3a8893` is README-only (`docs(http): fix rate-limit README to match
public surface`) and applies exactly the in-scope Option 1 fix the router
instructed: drop the non-compiling success-path snippet, document only the
reachable surface, and honestly record the KD-2 deferral. No code was widened.

### B1 verification — resolved

- **No `client.http` references remain in README** (`grep` clean).
- The new success-path-adjacent example uses only reachable symbols:
  - `RateLimited` is exported from `src/index.ts`.
  - `MemoryError.rateLimit: RateLimitSnapshot | undefined` exists
    (`src/errors.ts:27`), so `err.rateLimit?.remaining` is valid; `RateLimited`
    adds `retryAfter` (`src/errors.ts:58`), so the `err.retryAfter` comment is
    accurate.
  - `client.memories.search({ … })` is reachable: `MemoryClient` exposes
    `readonly memories` (`src/client.ts`) and `Memories.search` exists
    (`src/memories.ts:240`).
- The lone surviving `HttpClient.request()` mention (`README.md:225`) is in
  **prose** explaining the deferred internal surface, not a code fence a
  consumer would call — and it correctly states the public methods
  (`memories.*`, `groups.*`) return only the parsed body. That matches the code:
  every public method destructures `{ body }` and discards `rateLimit`
  (`src/memories.ts:241`). The KD-2 deferral note is truthful for v0.3.0.

### Regression / scope check

- `git diff --name-only 5319ef8 f3a8893 -- src/` is empty — `src/` is untouched
  since the approved code commit. No code, type, or export change crept in.
- Gates re-run for confidence (README isn't compiled by the gate, but verifying
  nothing regressed): `tsc --noEmit` exit 0; `vitest run` **51 passed** (35
  pre-existing + 16 new), identical to cycle 1.

The "Documentation Complete" box is now truthful — the single user-facing
artifact for this feature compiles against the real `@xtraceai/memory` surface.

## BLOCKERS

None. The cycle-1 blocker B1 is fully resolved within the prescribed README-only
scope.

## FOLLOW-UP

No new follow-ups from this cycle's diff. The two follow-ups recorded in cycle 1
remain valid and are already routed to the planner; restated here only so the
ledger is complete (not re-raised):

- **L1 (doc-example-compile-gap):** README ```ts blocks are still not
  type-checked by any gate. B1 is fixed by hand this cycle, but the gap that let
  a non-compiling example pass `typecheck → test → build` silently is
  structural. A doc-snippet extraction / `tsd`-style check would prevent
  recurrence. Already on the planner's in-sprint card list.

- **L2 (live-artifact-verification-gap):** All evidence is still mocked-fetch
  only; live error-body shapes and `RateLimit-*` header casing/units remain
  unverified against the deployed API (no creds). Correctly the ADR-001
  Validation follow-up, already routed (blocked on creds). Not this card's
  scope.

## Outstanding close-out actions

- The "Code Review Approved" box may now be checked — this review is the gate.
- Remaining unchecked Completion Checklist items ("PR merged", "deployed to
  production via release card v0.3.0", "stakeholders notified", "ticket closed")
  are downstream of the executor and owned by the PR/release stages — correctly
  left unchecked.
- Card flipped to `in_progress` via MCP for the dispatcher to advance.
