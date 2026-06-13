Sprint closeout card ID: 7jkx4l
Sprint card list:
- 4ofayn (step-1, done): step-1-m2recon-sprint-plan — sprint plan / kickoff chore
- esxk0v (step-2a, in_progress): step-2a-spec-reconciliation-auth-patch-metadata — spec reconciliation, auth/patch metadata (docs)
- m89x9w (step-2b, blocked): step-2b-error-envelope-and-rate-limit-hardening — parseErrorBody multi-envelope + RateLimitSnapshot in src/http.ts, src/errors.ts (THIS card)
- zc9r8x (step-3, todo): step-3-opt-in-x-api-key-auth-mode — opt-in X-API-Key auth mode
- pktue3 (step-4a, todo): step-4a-typed-filter-dsl-builder — typed filter DSL builder
- lzwwfb (step-4b, todo): step-4b-recall-include-for-full-content — recall include for full content
- 77u8f3 (step-5, todo): step-5-searchall-cursor-auto-pager — searchAll cursor auto-pager
- l3jhjg (step-6, todo): step-6-superseded-chain-helper-and-field-deferrals — superseded-chain helper + field deferrals
- f5ddyp (step-7, todo): step-7-type-surface-source-of-truth-fix-regen-guard — type-surface source-of-truth fix + regen guard
- u4uqio (step-8, todo): step-8-release-v0-3-0-version-readme-changelog — release v0.3.0 (version, README, changelog)
- 7jkx4l (step-9, todo): step-9-m2recon-sprint-closeout — sprint closeout card

The reviewer flagged 3 non-blocking follow-up items, grouped into 2 cards below.
Create ONE card per group. Do not split groups into multiple cards.
The planner is responsible for deduplication against existing cards.
All cards go into the current sprint unless marked BLOCKED with a reason.

Source review: `.gitban/agents/reviewer/inbox/M2RECON-m89x9w-reviewer-1.md`

### Card 1: Add a doc-snippet typecheck gate so README ```ts examples can't drift from the public surface
Sprint: M2RECON
Files touched: README.md (```ts fences), package.json (gate wiring / scripts), possibly a new doc-snippet extraction or tsd/expect-error harness under the repo root
Items:
- L1 (doc-example-compile-gap): The README TypeScript blocks are not type-checked by any gate, so a non-compiling example (exactly the B1 defect on this card) passes `typecheck → test → build` silently. Add a lightweight mechanism — a `tsd`/`expect-error` check or a doc-snippet extraction step that compiles the README ```ts fences against the package's public surface — wired into the existing `typecheck → test → build` gate (the project's only automated safety net; there is no CI). This would catch public-surface drift in docs going forward. In-scope for this sprint: it is a self-contained tooling addition with no live-API dependency, and directly hardens against the class of defect that blocked this card.

### Card 2: Live-API verification of error-body shapes and RateLimit-* header casing/units (BLOCKED — requires live creds)
Sprint: M2RECON
Files touched: src/errors.ts (`parseRateLimit` header-name assumptions), src/errors.test.ts / fixtures (currently mocked-fetch only); verification artifact / probe notes
Items:
- L2 (live-artifact-verification-gap): All current evidence is mocked-fetch only; the live error-body shape and `RateLimit-*` header casing/units are unverified against the deployed Memory API. This is the ADR-001 Validation follow-up ("probe live error shape when creds exist") and is the trigger to prune the tolerated tolerance branches once confirmed.
- L3 (header-casing-assumption): `parseRateLimit` reads `RateLimit-Limit` / `-Remaining` / `-Reset` and the tests inject exactly that casing. `Headers.get()` is case-insensitive per the Fetch spec so this is safe in principle, but fixtures only exercise the canonical casing — a live probe must confirm the server uses `RateLimit-*` (RFC draft) and not e.g. `X-RateLimit-*`. Low risk; the reviewer explicitly folds this into L2.

BLOCKED reason: This group cannot execute in this cycle because it requires live Memory API credentials, which do not exist in this environment (the executor's evidence was mocked-fetch only precisely because there are no creds). It is a true external dependency — the ADR-001 Validation step gates it on "when creds exist." This is the recorded prune-the-tolerated-branch trigger; keep it tracked so it is not lost, but it is not executable now.
