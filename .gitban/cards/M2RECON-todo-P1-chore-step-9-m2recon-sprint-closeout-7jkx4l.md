# step 9: M2RECON Sprint Closeout

> **Sprint**: M2RECON | **Type**: chore | **Step**: 9 (final)
>
> Mandatory closeout card for sprint M2RECON. Dispatched last. Archives done cards, generates the sprint summary, updates CHANGELOG, marks the roadmap complete, and walks accumulated retrospective items using the four-type deferral grid (see planner/SKILL.md per-item block format).

## Cleanup Scope & Context

* **Sprint/Release:** M2RECON → v0.3.0
* **Primary Feature Work:** SDK↔spec 1.0 reconciliation + search surface (m2/s5)
* **Cleanup Category:** Sprint closeout

**Required Checks:**
* [ ] Sprint/Release is identified above.
* [ ] Primary feature work that generated this cleanup is documented.

## Purpose

Close out sprint M2RECON: archive done cards, generate the sprint summary, update `CHANGELOG.md`, mark roadmap story m2/s5 (and milestone m2) complete, and process every item in the Sprint Retrospective section using the four-type deferral grid each item carries.

## Sprint Retrospective

<!-- planner appends items below this line during the sprint. Each item is a self-contained block with its own classification grid per planner/SKILL.md. Leave this section empty if no items accumulate. -->

## Deferred Work Review

* [ ] Reviewed commit messages for "TODO" and "FIXME" comments added during sprint.
* [ ] Reviewed PR comments for "out of scope" or "follow-up needed" discussions.
* [ ] Reviewed code for new TODO/FIXME markers (grep for them).
* [ ] Checked team chat/standup notes for deferred items.

| Cleanup Category | Specific Item / Location | Priority | Justification for Cleanup |
| :--- | :--- | :---: | :--- |
| **Retrospective** | Items appended to Sprint Retrospective during dispatch | P2 | Walk the four-type deferral grid at close |
| **Roadmap** | m2/s5 features → done / won't-do | P1 | Reflect shipped + deferred dispositions |
| **Archive** | All M2RECON done cards | P2 | Keep board clean |

## Cleanup Checklist

### Documentation Updates (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **CHANGELOG** | confirm v0.3.0 entry present (from step 8) | - [ ] |
| **Roadmap** | mark m2/s5 features done; PATCH-update + expand/server-template as won't-do (ADR rationale) | - [ ] |
| **Sprint summary** | `generate_archive_summary` | - [ ] |

### Code Quality & Technical  (optional)

| Task | Status / Details | Done? |
| :--- | :--- | :---: |
| **Retro items processed** | each Sprint Retrospective item classified + actioned (four-type grid) | - [ ] |
| **Cards archived** | `archive_cards` for all M2RECON done cards | - [ ] |

## Acceptance Criteria

- [ ] Every item under `## Sprint Retrospective` has exactly one deferral-type row marked true in its inline grid (exactly-one-true constraint)
- [ ] Every item has its `Action taken:` field filled in matching the chosen deferral type (card id for backlog/sprint, prose for note-only, commit hash for fixed-with-note)
- [ ] Every item's two per-item checkboxes (`Item {N} classified`, `Item {N} actioned`) are ticked
- [ ] Sprint summary generated via `generate_archive_summary`
- [ ] Roadmap updated for the stories/features this sprint completed (m2/s5; m2 milestone)
- [ ] `CHANGELOG.md` updated for the user-visible changes landed this sprint
- [ ] All sprint cards archived via `archive_cards`

## Validation & Closeout

### Pre-Completion Verification

| Verification Task | Status / Evidence |
| :--- | :--- |
| **All P0 Items Complete** | N/A |
| **All P1 Items Complete or Ticketed** | All work cards (steps 2–8) done |
| **Tests Passing** | release card gate green |
| **No New Warnings** | typecheck clean |
| **Documentation Updated** | README + CHANGELOG |
| **Code Review** | per-card reviewers in dispatch |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Remaining P2 Items** | per Sprint Retrospective processing |
| **Recurring Issues** | captured in retro |
| **Process Improvements** | captured in retro |
| **Technical Debt Tickets** | none expected (additive sprint) |

### Completion Checklist

<!-- gate0: upper-checklist -->

* [ ] All P0 items are complete and verified. <!-- cite: none -->
* [ ] All P1 items are complete or have follow-up tickets created. <!-- cite: none -->
* [ ] P2 items are complete or explicitly deferred with tickets. <!-- cite: none -->
* [ ] All tests are passing (unit, integration, and regression). <!-- cite: none -->
* [ ] No new linter warnings or errors introduced. <!-- cite: none -->
* [ ] All documentation updates are complete and reviewed. <!-- cite: none -->
* [ ] Code changes (if any) are reviewed and merged. <!-- cite: none -->
* [ ] Follow-up tickets are created and prioritized for next sprint. <!-- cite: none -->
* [ ] Team retrospective includes discussion of cleanup backlog (if significant). <!-- cite: none -->


### Item 1: Doc-snippet typecheck gate so README ```ts examples can't drift from the public surface

The README's TypeScript code blocks are not type-checked by any gate, so a
non-compiling example (exactly the B1 defect that blocked card m89x9w) sails
through `typecheck → test → build` silently. There is no CI — this local gate is
the only automated safety net — so untyped doc snippets are a standing
public-surface-drift hazard. A lightweight mechanism would close it: a
`tsd`/`expect-error` check, or a doc-snippet extraction step that compiles the
README ```ts fences against the package's compiled public surface, wired into
the existing `typecheck → test → build` gate. It is a self-contained tooling
addition with no live-API dependency, and it directly hardens against the class
of defect that blocked m89x9w.

Captured here (not filed as a sprint card) because it blocks no downstream
M2RECON card and has no external prerequisite — it is a non-blocking hardening
opportunity. At closeout it is a natural promotion candidate: it could be folded
into card f5ddyp's regen-guard work (step 7, "type-surface source-of-truth fix +
regen guard") or shipped alongside the README updates in card u4uqio (step 8,
release v0.3.0), or promoted to a next-sprint card if neither fits cleanly.

| Deferral Type | Description | Applies (true/false) |
|---------------|-------------|----------------------|
| backlog | Genuinely future work; external prerequisite or belongs to a different milestone; can't be done in upcoming work without a shape-change. | |
| sprint | Blocks or enables sprint-scoped work (current or next); needs its own card with a sprint tag. | |
| note-only | Captured for record; no action; current output is fine as-is. | |
| fixed-with-note | Trivial enough for the closeout agent to fix inline during closeout, with a note of what was done (typo, lint fix, stale comment). | |

**Source:** m89x9w review 1
**Files touched:** README.md (```ts fences), package.json (gate wiring / scripts), possibly a new doc-snippet extraction or tsd/expect-error harness under the repo root
**Action taken:** {closeout fills prose — card {id} created in sprint {tag} / card {id} created in loose backlog / noted, no action / fixed in commit {hash}}

- [ ] Item 1 classified (exactly one deferral type marked `true` above)
- [ ] Item 1 actioned (action taken matches chosen type)

### Item 2: resolveAllSuperseded uses Promise.all — whole-batch rejection on a single unreachable replacement

The batch helper `resolveAllSuperseded` fans out per-entry `get()` calls via
`Promise.all`, which rejects wholesale the moment any single `get()` fails. The
real client throws on a 404 (the test fixture mirrors this), so if a replacement
memory was deleted between the ingest and the batch call, the entire batch
rejects and the caller loses every successfully-resolved entry. The single-entry
`resolveSuperseded` has no such surprise. This may be the intended contract, but
it is neither documented in the JSDoc nor exercised by a test — the existing
batch tests cover only the all-success and empty-map cases.

Two remediation options the reviewer named: (a) a JSDoc note ("rejects if any
replacement is unreachable") plus a partial-failure test that asserts the
documented all-or-nothing behavior, or (b) a `Promise.allSettled` variant that
skips unresolvable entries and returns only the successfully-resolved ones.
Option (b) is a behavior change to a freshly-shipped public method and would want
its own test + JSDoc; option (a) pins the current contract with no behavior
change.

Captured here (not filed as a sprint card) because it blocks no downstream
M2RECON card — the single-resolve path is the card's capstone and is unaffected,
and the all-success batch path is already covered — and it has no external
prerequisite; it is fully doable in-repo today. At closeout it is a natural
promotion candidate: small enough to fold into the release card's polish or
promote to a next-sprint card if a behavior change (option b) is chosen over a
contract-pinning doc+test (option a).

| Deferral Type | Description | Applies (true/false) |
|---------------|-------------|----------------------|
| backlog | Genuinely future work; external prerequisite or belongs to a different milestone; can't be done in upcoming work without a shape-change. | |
| sprint | Blocks or enables sprint-scoped work (current or next); needs its own card with a sprint tag. | |
| note-only | Captured for record; no action; current output is fine as-is. | |
| fixed-with-note | Trivial enough for the closeout agent to fix inline during closeout, with a note of what was done (typo, lint fix, stale comment). | |

**Source:** l3jhjg review 1
**Files touched:** src/memories.ts (resolveAllSuperseded, ~line 272), src/superseded.test.ts (batch coverage), README.md (if JSDoc/contract documented for the public surface)
**Action taken:** {closeout fills prose — card {id} created in sprint {tag} / card {id} created in loose backlog / noted, no action / fixed in commit {hash}}

- [ ] Item 2 classified (exactly one deferral type marked `true` above)
- [ ] Item 2 actioned (action taken matches chosen type)

### Item 3: Conformance assertions — guard proves reproducibility, not that canonical src/types.ts matches the spec-derived schemas

The `check:types-sync` guard added in card f5ddyp proves *reproducibility* only:
the committed `src/generated/types.ts` reference equals what `gen:types` produces
from `spec/memory.json`. It does **not** prove *conformance* — that the
hand-authored canonical `src/types.ts` actually matches the spec-derived schemas.
The two are independent surfaces: the generated reference can be perfectly
in-sync with the spec while the hand-authored canonical type silently diverges
from it on a wire-critical field, and no automated check would catch the drift.

This is correctly deferred, not a blocker. ADR-002 KF3 (Implementation Notes)
explicitly scopes `expectAssignable`-style conformance assertions — pinning the
canonical surface against the generated reference — as an **optional follow-up,
not a 1.0 precondition**. No downstream M2RECON card blocks on it (the release
card u4uqio ships without it per ADR-002), and it has no external prerequisite:
both `src/types.ts` and `src/generated/types.ts` exist today, so the assertions
are fully writable in-repo now. Captured here so the gap is on the record and
deduped — a roadmap search confirmed no existing conformance card. At closeout it
is a promotion candidate: a small `tsd`/`expect-type` harness asserting the
canonical types are assignable to (and from) the spec-derived schemas, wired into
the existing `typecheck → test → build` gate, would close it. Failure mode if
never done: the canonical surface diverges from the spec on a wire-critical type
and ships silently.

| Deferral Type | Description | Applies (true/false) |
|---------------|-------------|----------------------|
| backlog | Genuinely future work; external prerequisite or belongs to a different milestone; can't be done in upcoming work without a shape-change. | |
| sprint | Blocks or enables sprint-scoped work (current or next); needs its own card with a sprint tag. | |
| note-only | Captured for record; no action; current output is fine as-is. | |
| fixed-with-note | Trivial enough for the closeout agent to fix inline during closeout, with a note of what was done (typo, lint fix, stale comment). | |

**Source:** f5ddyp review 1
**Files touched:** src/types.ts (canonical surface), src/generated/types.ts (spec-derived reference), package.json (gate wiring if a conformance harness is added), docs/adr/ADR-002 (KF3 — Implementation Notes scoping the deferral)
**Action taken:** {closeout fills prose — card {id} created in sprint {tag} / card {id} created in loose backlog / noted, no action / fixed in commit {hash}}

- [ ] Item 3 classified (exactly one deferral type marked `true` above)
- [ ] Item 3 actioned (action taken matches chosen type)