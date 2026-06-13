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
