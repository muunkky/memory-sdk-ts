Use `.venv/Scripts/python.exe` to run Python commands.

The code for gitban card `m89x9w` (step-2B: error-envelope + rate-limit hardening) was reviewed and **REJECTED** with one blocker. The implementation, types, exports, and tests are all **approved as-is** — the only blocker is in the **documentation** (Gate 2 / DaC). Do not rewrite the working code; fix the README, then re-attest and re-submit.

Full review: `.gitban/agents/reviewer/inbox/M2RECON-m89x9w-reviewer-1.md`

===BEGIN REFACTORING INSTRUCTIONS===

## B1 — README documents a non-existent public API for the success-path rate-limit surface (code-quality / DaC)

`README.md:206` (added by this commit) presents this as the way a consumer reads the headline rate-limit feature on a successful response:

```ts
const { rateLimit } = await client.http.request("GET", "/v1/memories");
```

`client.http` does **not** exist on the published surface:

- `MemoryClient` (`src/client.ts`) exposes only `readonly memories` and `readonly groups`. The `HttpClient` is a local `const http` in the constructor — there is no `http` member.
- `HttpClient` is **not** exported from `src/index.ts`, so even `new HttpClient(...)` is not reachable from `@xtraceai/memory`.

So the success-path snippet **does not compile against the package** — a consumer copying it gets `Property 'http' does not exist on type 'MemoryClient'`. The card's "Documentation Complete" box is checked, and DaC requires checked documentation boxes to be truthful; the single user-facing artifact for this feature's success-path channel demonstrates a phantom API.

**Scope note (do NOT widen the code):** KD-2 deliberately scopes the success-path snapshot to the internal `HttpClient.request()` return and defers a *public* success-path aggregate to "later if demand appears … out of scope for v0.3.0." The code honours that exactly — every public method destructures only `{ body }` and intentionally discards `rateLimit`. This is purely a README fix; do not expose a new public surface.

**Required fix (README-only, the reviewer's preferred Option 1):**

1. Remove the success-path `client.http.request` example from `README.md` (around line 206).
2. Document only the surfaces a **public consumer can actually reach today**:
   - `err.rateLimit` on a thrown error — the existing error-path paragraph (~`README.md:212`) is already correct and compiles; keep it.
   - Explicitly note — per KD-2 — that the **per-success-response rate-limit snapshot is not yet exposed on the public method surface in v0.3.0** (the deferred aggregate). Tell the truth about the v0.3.0 surface without implying a method that isn't there.
3. Do **not** take Option 2 (exposing a public success-path read) — that is a code change, out of scope per KD-2, and would need its own card.

===END REFACTORING INSTRUCTIONS===

## After the README fix

- Re-verify the corrected README compiles conceptually against the real public surface (`MemoryClient` exposes only `memories`/`groups`; `RateLimitSnapshot` is reachable as `err.rateLimit`). Confirm no remaining ```ts fence references `client.http` or any unexported symbol.
- Re-attest the **"Documentation Complete"** box against the corrected README (it stays checked only if it is now truthful).
- No code change is required for approval; the implementation, types, exports, and tests are all approved as-is. Re-running `typecheck → test → build` is unaffected (the README isn't compiled by the gate), but run it anyway to confirm nothing regressed.
- Commit the README fix (no co-authored-by lines), then re-submit for review.

Note: You are addressing this card's blocker only. The dispatcher owns sprint lifecycle — do not close, archive, or finalize the sprint.
