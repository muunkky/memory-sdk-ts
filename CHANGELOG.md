# Changelog

All notable changes to `@xtraceai/memory` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Pre-1.0 versioning follows the project policy in [`RELEASING.md`](./RELEASING.md):
breaking changes bump the **minor**; everything in `0.3.0` is **additive and
non-breaking** — `0.2.x` consumers upgrade with zero code changes and opt into
the new surface at will.

## [0.3.0] — 2026-06-13

The M2 spec-reconciliation and search-surface release. Hardens error and
rate-limit handling, adds an opt-in auth header form, a typed filter DSL, and
several search/recall conveniences. **Non-breaking** — no method signature
changed, no default behaviour changed, and no export was removed.

### Added

- **Both-envelope error handling.** `error.code` is now populated regardless of
  which envelope the server emits: the legacy `{ error: { code, message } }`,
  the spec `{ detail: { code, message } }`, or FastAPI's plain
  `{ detail: "..." }` string (which sets `error.message`). A `422`
  `{ detail: [...] }` validation response surfaces as `Unprocessable` with
  `error.code === "validation_error"` and the raw per-field array under
  `error.details.validation_errors`. The legacy path is byte-identical to
  `0.2.x`.
- **`RateLimitSnapshot` rate-limit visibility.** The SDK parses the
  `RateLimit-Limit` / `RateLimit-Remaining` / `RateLimit-Reset` response headers
  into a new exported `RateLimitSnapshot` type, exposed on
  `MemoryError.rateLimit` so you can back off proactively. Absent or non-numeric
  headers leave each field `undefined` (never a throw). Exposed per-response;
  there is no client-level "last seen" global. See the README note for the
  success-path caveat.
- **Opt-in `x-api-key` auth mode.** New `authMode?: "bearer" | "x-api-key"` on
  `MemoryClientOptions`. Defaults to `"bearer"` (`Authorization: Bearer <key>` —
  unchanged), so existing code is unaffected. `authMode: "x-api-key"` sends
  `x-api-key: <key>` and omits the `Authorization` header. `X-Org-Id` is sent in
  both modes.
- **Typed filter DSL (`f`).** New `src/filter.ts` module exporting `f`, plus the
  `Clause`, `Comparable`, and `FieldOps` types. Builds the wire JSON for
  `SearchRequest.filters` discoverably: per-field operators (`$eq`, `$ne`,
  `$in`, `$nin`, `$exists`, `$gt`, `$gte`, `$lt`, `$lte`, `$between`), `null` for
  "unset", and `AND` / `OR` / `NOT` composition. `f.field(name, ops)` is the only
  way to put multiple operators on one field (a two-sided range can't silently
  collapse), and `f.all(...)` throws on a duplicate field rather than dropping
  operators. Key-agnostic by design: it filters arbitrary indexed payload keys
  (including customer metadata keys) identically to entity axes. The raw
  `Filter` (`Record<string, unknown>`) escape hatch still works.
- **`recall(..., { include: ["full_content"] })`.** New optional `include` field
  on `RecallParams`, forwarded to every per-pool search so heavy artifact bodies
  (`ArtifactDetails.full_content`) are populated on the merged rows in the same
  round-trip — no follow-up `get()` calls. Omitting it leaves the wire request
  byte-identical to before.
- **`Memories.searchAll(body, ctx)`.** New async-generator method — the `search`
  twin of `list()`. Auto-paginates a search query, threading the cursor across
  pages until the server reports `has_more: false`. Spreads a fresh
  `{ ...body, cursor }` per page, so the caller's `body` is never mutated.
- **`Memories.resolveSuperseded(result, oldId, ctx?)`** and the batch twin
  **`Memories.resolveAllSuperseded(result, ctx?)`.** When an ingest supersedes a
  fact, the server reports the old → new id mapping in
  `IngestJobResult.memories_superseded_by` (and only there). `resolveSuperseded`
  follows that map and fetches the replacement `Memory` (or `null` if `oldId`
  wasn't superseded in this ingest); `resolveAllSuperseded` resolves every
  superseded id to its replacement in one call, returning a `Map<oldId, Memory>`
  with the per-id `get()` fetches run in parallel.
- **`check:types-sync` publish guard.** New npm script (`gen:types` +
  `git diff --exit-code` on `src/generated/types.ts`), chained into
  `prepublishOnly`, that proves the committed spec-derived reference is exactly
  what the current `spec/memory.json` produces — catching reference drift before
  a publish.

### Changed

- **Spec reconciliation (`spec/memory.json`, additive/annotative — ADR-001).**
  - A2a: documents the `Authorization: Bearer <key>` security scheme additively,
    alongside the existing `Token` / `x-api-key` schemes (nothing removed). This
    is the form the SDK ships and the live API accepts.
  - A4: annotates `PATCH /v1/memories/{memory_id}` and `UpdateRequest` as removed
    server-side (`405`); entries retained for diff legibility, with a note that
    corrections flow through ingest (the API has no update endpoint).
  - A5: annotates the dropped `metadata` field references in `info.description`
    (Memory object, ingest contract, filter-DSL note). The typed `metadata`
    field is not reintroduced; the key-agnostic filter DSL covers payload keys.
- **Type-surface source of truth (ADR-002).** Corrected the `src/types.ts`
  header reference to `spec/memory.json` and regenerated the spec-derived
  reference at `src/generated/types.ts` (a reference only — imported by nothing
  in `src/`; do not hand-edit, regenerate via `npm run gen:types`).

### Notes

- Migration: pure addition. Upgrade `0.2.x → 0.3.0` with no code changes.
- On the **success** path the rate-limit snapshot is parsed but currently only
  available on the internal `HttpClient.request()` return; the public methods
  return just the parsed body. A public success-path rate-limit surface is
  deferred until there is demand. Today, `err.rateLimit` on a thrown error is the
  supported way to observe the bucket state.

## [0.2.1]

- Recall pools fix: reject a non-array `group_ids` in a recall pool.

## [0.2.0]

- Recall pools and earlier surface (see git history).

## [0.1.1]

- Initial published surface (see git history).

[0.3.0]: https://github.com/XTraceAI/memory-sdk-ts/releases/tag/v0.3.0
[0.2.1]: https://github.com/XTraceAI/memory-sdk-ts/releases/tag/v0.2.1
[0.2.0]: https://github.com/XTraceAI/memory-sdk-ts/releases/tag/v0.2.0
[0.1.1]: https://github.com/XTraceAI/memory-sdk-ts/releases/tag/v0.1.1
