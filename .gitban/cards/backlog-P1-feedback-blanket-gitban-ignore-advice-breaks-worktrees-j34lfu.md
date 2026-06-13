# Feedback Capture Template

**When to use this template:** Capturing a documentation/advice defect in the gitban scaffold before it becomes a formal work item.

---

## Feedback Overview & Context

* **Feedback Topic:** The `.gitignore.gitban` advice for non-gitban repos ("Ignore the whole tree with a single line: `.gitban/**`") is bad advice — it breaks parallel-subagent worktree dispatch.
* **Feedback Source:** Claude Code agent setting up gitban on a forked, non-owned repo for a user.
* **Source Details:** File shipped by `gitban setup`/`sync`: `.gitignore.gitban`, header comment block. gitban package version 2.0.0a1.
* **Feedback Date:** 2026-06-12
* **Feedback Channel:** send_feedback (gitban MCP)
* **Urgency Level:** Medium — silently degrades dispatch on any repo that follows the advice; not data-loss.
* **Affected Stakeholders:** Anyone running gitban on a repo whose `.gitban/` PM surface they do not commit (forks, contributions, evaluation repos) AND who uses parallel subagent worktrees.

**Required Checks:**
* [x] **Feedback topic** is clearly stated.
* [x] **Feedback source** is documented with reference link/details.
* [x] **Urgency level** is assigned based on impact and scope.

---

## Initial Feedback Collection

> Raw advice as shipped, and why it fails.

**Raw Feedback / Quotes:**
* From `.gitignore.gitban`: "Non-gitban repo (you do NOT track your .gitban/ PM surface)? Ignore the whole tree with a single line instead of the allowlist below: `.gitban/**`"
* Contradicted by the same file's allowlist rationale: "Harness hooks are tracked... Git worktrees and fresh clones receive only tracked files... untracking them breaks worktree dispatch."

**Observed Pain Points:**
* A blanket `.gitban/**` (and `.claude/`) ignore means worktrees — which are `git worktree add` checkouts of HEAD — come up missing hooks, cards, agent inboxes, and `.claude` agents/skills/settings, because untracked files never propagate into a worktree.
* Result: dispatch thrashes / re-scaffolds / orphans worktrees instead of running cleanly.

**Context / Background:**
* Repo was a fork of an upstream the user does not own, so committing the overlay upstream is undesirable — which is exactly the case the blanket-ignore advice targets.
* The `worktree-create.sh` hook forks worktrees from parent HEAD; only tracked files are present in that checkout.

**Initial Hypotheses / Questions:**
* The blanket-ignore line predates (or ignores) the parallel-worktree dispatch model and was never reconciled with it.
* Question: should the non-gitban-repo guidance instead recommend the deepnote-style pattern (track durable surface, ignore only runtime artifacts) with the overlay kept on a fork/non-upstream branch?

---

## Related Context Review

* [x] Existing documentation reviewed (README, wiki, user guides).
* [x] Similar feedback or related issues reviewed (support tickets, GitHub issues, past surveys).
* [ ] Product roadmap reviewed for planned work in this area.
* [ ] Analytics or metrics reviewed (if applicable - usage data, error rates, performance metrics).
* [x] Team knowledge gathered (asked relevant team members for context).

| Review Source | Link / Location | Key Findings / Relevance |
| :--- | :--- | :--- |
| **Shipped advice** | `.gitignore.gitban` header comment | Recommends `.gitban/**` blanket ignore for non-gitban repos |
| **Same file's allowlist** | `.gitignore.gitban` body | States untracking hooks "breaks worktree dispatch" — self-contradictory with the blanket-ignore advice |
| **Reference repo (works well)** | `../deepnote` `.gitignore` + tracked tree | Tracks 202 files under `.gitban/`, 38 under `.claude/`; ignores ONLY `.claude/worktrees/`, agent logs/traces, audit, views, `.viewer-port`, `/log/` |
| **Worktree hook** | `.gitban/hooks/worktree-create.sh` | Forks worktree from parent HEAD → only tracked files present in the worktree |

---

## Feedback Analysis & Categorization

| Iteration # | Analysis Goal | Investigation / Action | Finding / Insight |
| :---: | :--- | :--- | :--- |
| **1** | Confirm the blanket ignore is what breaks worktrees | Read worktree-create.sh + git worktree semantics | Worktrees are HEAD checkouts; untracked `.gitban/`/`.claude/` is absent in them |
| **2** | Find the correct pattern | Inspected the deepnote repo's gitignore + tracked files | Track durable surface, ignore only regenerable runtime artifacts |

---

#### Iteration 1: Confirm Root Cause

**Analysis Goal:** Confirm that the blanket `.gitban/**` ignore is what degrades worktree dispatch.

**Investigation / Action Taken:** Read `.gitban/hooks/worktree-create.sh` (forks from parent HEAD) and reasoned about `git worktree add` semantics (checks out tracked files only; untracked files in the main worktree are not copied).

**Finding / Insight:** With `.gitban/**` and `.claude/` ignored, every spawned worktree lacks hooks, cards, agent inboxes, and `.claude` agents/skills/settings — so the dispatch harness is absent inside the worktree.

---

#### Iteration 2: Identify the Correct Pattern

**Analysis Goal:** Determine the configuration that keeps worktrees functional without committing the overlay upstream.

**Investigation / Action Taken:** Inspected a known-good repo (`../deepnote`): tracked-file listing and `.gitignore`.

**Finding / Insight:** deepnote tracks the durable PM/dispatch surface and ignores only `.claude/worktrees/`, `.gitban/agents/.active-log`, `.gitban/agents/*/logs/*.jsonl*`, `.gitban/agents/traces/`, `.gitban/audit/`, `.gitban/.viewer-port`, `.gitban/views/`, `/log/`. Worktrees inherit the harness; only runtime junk is ignored.

---

### Feedback Categorization

| Category | Value / Notes |
| :--- | :--- |
| **Feedback Type** | Documentation Gap / Bad default advice |
| **Severity** | Medium — silent dispatch degradation, not data loss |
| **Scope** | Non-gitban/fork repos using parallel subagent worktrees |
| **Root Cause** | `.gitignore.gitban` blanket-ignore line not reconciled with the worktree-checkout-of-HEAD model |
| **Effort Estimate** | Small — reword the non-gitban guidance + point at the runtime-only ignore set |
| **Business Impact** | Medium — undermines the parallel dispatch feature for an entire repo class |

---

## Feedback Processing & Action Planning

| Step | Status/Details | Universal Check |
| :---: | :--- | :---: |
| **1. Validate Feedback** | Validated via worktree-hook read + deepnote comparison | - [x] Feedback is validated with evidence (not just anecdotal). |
| **2. Prioritize** | P1 — affects a whole repo class using a headline feature | - [x] Priority assigned based on impact, scope, and urgency. |
| **3. Define Action** | Reword `.gitignore.gitban` non-gitban guidance to the runtime-only ignore set; keep overlay on a non-upstream branch for forks | - [x] Clear action is defined to address the feedback. |
| **4. Create Follow-up Card(s)** | For the gitban team to triage | - [x] Follow-up card created OR decision documented to not act. |
| **5. Communicate Decision** | Submitted via send_feedback | - [x] Feedback source is notified of decision/timeline. |
| **6. Track to Completion** | Owned by gitban maintainers | - [x] Follow-up work is tracked to completion or closure. |

#### Action Decision

> Recommendation for the gitban team.

**Decision:** Replace the "non-gitban repo → `.gitban/**`" advice in `.gitignore.gitban` with the runtime-artifacts-only ignore set, and document that the overlay should live on a fork/non-upstream branch (not be blanket-ignored) so worktrees inherit the harness.

**Rationale:** The blanket ignore directly defeats parallel-subagent worktree dispatch because worktrees only receive tracked files. The deepnote pattern proves the correct, working configuration.

**Follow-up Cards Created:**
* This feedback card (for gitban team triage)

**Estimated Timeline:** Maintainer discretion.

---

## Feedback Resolution & Follow-up

| Task | Detail/Link |
| :--- | :--- |
| **Follow-up Card(s)** | This card |
| **Decision Rationale** | Blanket `.gitban/**` ignore breaks worktree dispatch; runtime-only ignore set is correct |
| **Communication Sent** | Submitted via gitban send_feedback |
| **Completion Status** | Open — awaiting gitban maintainer triage |

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Similar Feedback Expected?** | Likely — any fork/non-owned repo following the shipped advice |
| **Process Improvement?** | Reconcile scaffold ignore guidance with the worktree dispatch model |
| **Documentation Needed?** | Yes — reword `.gitignore.gitban` non-gitban-repo section |
| **Proactive Communication?** | Optional — note in release notes when fixed |
| **Feedback Loop Closed?** | No — pending maintainer action |

### Completion Checklist

* [x] Feedback is validated with supporting evidence or data.
* [x] Root cause is understood [if applicable].
* [x] Priority and scope are assessed based on impact.
* [x] Decision is made: act on feedback, defer, or close as won't fix.
* [x] Follow-up card is created (if actionable) or decision is documented.
* [x] Feedback source is notified of decision and timeline.
* [ ] Action is tracked to completion (or documented as closed).
* [x] Lessons learned are captured for process improvement.

---

### Note on validation

This card follows the feedback template structure.
