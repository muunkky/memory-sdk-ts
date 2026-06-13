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