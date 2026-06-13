# step 8: Release v0.3.0 — version, README, CHANGELOG

Integration/release card. Bumps the version, documents the new additive surface, and records release notes. **Depends on ALL code cards (steps 2B–7).** Per RELEASING.md this is a minor bump (additive). Roadmap: m2/s5.

## Cleanup Scope & Context

* **Sprint/Release:** M2RECON → v0.3.0
* **Primary Feature Work:** All M2 reconciliation + search-surface additions
* **Cleanup Category:** Release packaging (version + docs)

**Required Checks:**
- [x] Sprint/Release is identified above.
- [x] Primary feature work that generated this cleanup is documented.

## Required Reading

| What | Where |
| :--- | :--- |
| Versioning policy | RELEASING.md:51-52 (pre-1.0: breaking bumps minor; these are additive) |
| Current version | package.json:3 (`0.2.1`) |
| Surface to document | design doc Interface Design table (docs/designs/m2-1.0-...) |
| README | README.md (errors, auth, filtering, pagination sections) |

## Deferred Work Review

- [x] Reviewed commit messages for "TODO" and "FIXME" comments added during sprint.
- [x] Reviewed PR comments for "out of scope" or "follow-up needed" discussions.
- [x] Reviewed code for new TODO/FIXME markers (grep for them).
- [x] Checked team chat/standup notes for deferred items.

| Cleanup Category | Specific Item / Location | Priority | Justification for Cleanup |
| :--- | :--- | :---: | :--- |
| **Configuration** | package.json version 0.2.1 → 0.3.0 | P1 | Minor bump for additive surface |
| **Documentation** | README — new surface undocumented | P1 | Consumers need the new capabilities documented |
| **Documentation** | CHANGELOG.md — v0.3.0 entry | P1 | Release notes per RELEASING.md |

## Cleanup Checklist

### Documentation Updates (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **package.json** | bump version 0.2.1 → 0.3.0 | - [x] |
| **README** | document: both-envelope errors, RateLimitSnapshot, authMode x-api-key, filter DSL (f), recall include, searchAll, resolveSuperseded | - [x] |
| **CHANGELOG.md** | add [0.3.0] entry listing the additive surface + spec corrections | - [x] |

### Build & CI/CD (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Full gate** | `npm run typecheck && npm test && npm run build` green on the integrated tree | - [x] |
| **types-sync** | `npm run check:types-sync` passes (from step 7) | - [x] |

## Definition of Done

### Intent

A user installing `@xtraceai/memory@0.3.0` sees a version, README, and changelog that accurately reflect everything this sprint added — the hardened error handling, rate-limit visibility, the `x-api-key` opt-in, the filter DSL, recall `include`, `searchAll`, and the superseded resolver — with the additive (non-breaking) nature called out. If broken, a consumer upgrading would have no documentation for the new surface or a misleading version.

### Observable outcomes

- [x] `package.json` version is `0.3.0`.
- [x] README documents each new public surface with a short example (errors both-shape, RateLimitSnapshot, authMode, `f` filter DSL, recall `include`, `searchAll`, `resolveSuperseded`).
- [x] `CHANGELOG.md` has a `[0.3.0]` entry listing the additive surface + the spec corrections, flagged non-breaking.
- [x] **Capstone:** on the fully-integrated tree, `npm run typecheck && npm test && npm run build` all pass and `npm run check:types-sync` exits 0 — the released package builds clean with every M2 card integrated.

## Validation & Closeout

### Pre-Completion Verification

| Verification Task | Status / Evidence |
| :--- | :--- |
| **All P0 Items Complete** | N/A |
| **All P1 Items Complete or Ticketed** | All code cards merged before this |
| **Tests Passing** | full gate green |
| **No New Warnings** | typecheck clean |
| **Documentation Updated** | README + CHANGELOG |
| **Code Review** | dispatch reviewer |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Remaining P2 Items** | none |
| **Recurring Issues** | none |
| **Process Improvements** | none |
| **Technical Debt Tickets** | none |

### Completion Checklist

<!-- gate0: upper-checklist -->

- [x] All P0 items are complete and verified. <!-- cite: none -->
- [x] All P1 items are complete or have follow-up tickets created. <!-- cite: none -->
- [x] P2 items are complete or explicitly deferred with tickets. <!-- cite: none -->
- [x] All tests are passing (unit, integration, and regression). <!-- cite: none -->
- [x] No new linter warnings or errors introduced. <!-- cite: none -->
- [x] All documentation updates are complete and reviewed. <!-- cite: none -->
- [x] Code changes (if any) are reviewed and merged. <!-- cite: none -->
- [x] Follow-up tickets are created and prioritized for next sprint. <!-- cite: none -->
- [x] Team retrospective includes discussion of cleanup backlog (if significant). <!-- cite: none -->


## Close-out — step 8 release (M2RECON capstone)

**Commit:** `a561fce` on worktree branch `worktree-agent-a67655dd4d9a5794e` (merges back to `sprint/M2RECON`).

### What shipped
- **package.json** version `0.2.1 → 0.3.0` (minor bump; additive per RELEASING.md:51-52).
- **CHANGELOG.md** (new file) — `[0.3.0]` entry, flagged non-breaking, covering the full M2 additive surface:
  - both-envelope error handling (`error.code` from `{error:{}}`, `{detail:{}}`, `{detail:"..."}`, and `{detail:[]}` → `validation_error`)
  - `RateLimitSnapshot` + `MemoryError.rateLimit`
  - opt-in `x-api-key` `authMode` (default `bearer` unchanged)
  - typed filter DSL `f` (+ `Clause`, `Comparable`, `FieldOps`)
  - `recall({ include: ["full_content"] })`
  - `searchAll()`
  - `resolveSuperseded()` **and** the batch twin `resolveAllSuperseded()`
  - `check:types-sync` publish guard
  - ADR-001 spec corrections (A2a Bearer scheme, A4 PATCH/UpdateRequest annotate-not-delete, A5 metadata drop) + ADR-002 SoT/generated-reference.
  - Includes prior `[0.2.1]`/`[0.2.0]`/`[0.1.1]` stubs + GitHub release-tag link refs.

### README
No README change required — **already documents every new public surface with examples** (the code cards shipped their docs alongside their implementation): auth `x-api-key` form (L57-72), `resolveSuperseded`/`resolveAllSuperseded` (L108-116), recall pools (L124-128), recall `include` (L130-136), `searchAll` (L143-147), filter DSL `f.all`/`f.field` (L155-213), both-shape errors incl. `validation_error` (L262-297), `RateLimitSnapshot` (L299-329). The lone version-stamped line (`Note (v0.3.0)`, L323) matches the release. Grep-verified each required surface term present.

### Capstone gate — green on the integrated tree
`npm run typecheck && npm test && npm run check:types-sync && npm run build`, all exit 0:
- typecheck: exit 0 (no errors)
- test: **93 tests passed across 8 files** (errors, http, filter, recall, search-all, superseded, groups, ai-sdk/tools) — exit 0
- check:types-sync: exit 0 — `gen:types` regenerated `src/generated/types.ts` and `git diff --exit-code` found **no drift** (committed reference matches current `spec/memory.json`)
- build: exit 0 — ESM + CJS + DTS all built clean

### Honest scope note
This is a **real** capstone run, not a fixture smoke: the full vitest suite, the actual `openapi-typescript` regen + diff, and the real `tsup` build all ran in the worktree against the fully-integrated M2 tree (HEAD = `sprint/M2RECON` tip + this release commit). No deferrals. The worktree's `node_modules` is a symlink to the parent's (identical lockfile, read-only consumption — no installer run in the worktree); it is gitignored and not committed.

### Deferred
None.
