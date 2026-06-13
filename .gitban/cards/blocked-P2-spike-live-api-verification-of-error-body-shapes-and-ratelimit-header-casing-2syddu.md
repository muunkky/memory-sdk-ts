# Live-API verification of error-body shapes and RateLimit-* header casing/units

**When to use this template:** Time-boxed investigation that validates assumptions against the live deployed Memory API before pruning tolerance code. Gated on the existence of live API credentials.

---

## Spike Overview

* **Investigation Question:** Against the deployed Memory API, what is the actual JSON shape of error response bodies, and exactly which `RateLimit-*` headers does the server emit (name, casing, units)? Do the live shapes match the envelopes/header names the SDK currently parses and tolerates?
* **Problem/Opportunity:** All current evidence for `parseErrorBody` (multi-envelope) and `parseRateLimit` is **mocked-fetch only** (see `src/errors.test.ts`). The error-body shapes and `RateLimit-*` header casing/units were never confirmed against the real server. This is the ADR-001 **Validation** follow-up ("probe live error shape when creds exist") and is the recorded trigger to **prune the tolerated tolerance branches** in `parseErrorBody`/`parseRateLimit` once the live shape is confirmed. Until then the SDK carries defensive branches whose necessity is unverified.
* **Time Box:** 0.5 day max (probe + record + prune decision). It is an investigation, not an implementation effort.
* **Success Criteria:**
  * Captured at least one **real** error response body for each error class the SDK distinguishes (e.g., 400/401/404/422/429/5xx as the API produces them), with the raw JSON recorded as a verification artifact.
  * Confirmed the actual `RateLimit-*` header names/casing/units the live server returns on a rate-limited (429) response — specifically whether it uses RFC-draft `RateLimit-Limit`/`-Remaining`/`-Reset` or a vendor variant such as `X-RateLimit-*`, and whether `-Reset` is delta-seconds or an epoch timestamp.
  * A clear prune/keep decision recorded for each tolerance branch in `parseErrorBody` and `parseRateLimit`, with any branch the live API proves unnecessary either removed (follow-up card) or explicitly retained-with-rationale.
* **Priority:** P2 - hardening / tech-debt removal; not blocking M2RECON. Blocked on live credentials.
* **Related Work:** M2RECON card m89x9w (step-2b: error-envelope + rate-limit hardening) — this is its deferred live-verification follow-up. ADR-001 Validation step. Reviewer report `.gitban/agents/reviewer/inbox/M2RECON-m89x9w-reviewer-1.md` items L2 (live-artifact-verification-gap) and L3 (header-casing-assumption).

**Required Checks:**
* [ ] **Investigation question** is specific and answerable.
* [ ] **Time box** is defined (prevents endless investigation).
* [ ] **Success criteria** clearly defines what "done" looks like.

---

## Context & Background Research

Before probing, review what the SDK currently assumes and why those assumptions exist.

* [ ] Existing documentation reviewed (ADR-001 Validation step; `RELEASING.md` for env/creds setup).
* [ ] Related tickets/issues reviewed (m89x9w card and its reviewer report; M2RECON closeout retrospective).
* [ ] Similar systems/implementations reviewed (RFC-draft `RateLimit` header fields vs common `X-RateLimit-*` vendor convention).
* [ ] Team knowledge consulted (whoever owns the deployed Memory API can confirm its error envelope + header contract directly).
* [ ] External research reviewed (IETF draft-ietf-httpapi-ratelimit-headers for `RateLimit-*` semantics; Fetch spec on `Headers.get()` case-insensitivity).

| Source Type | Link / Location | Key Findings / Relevant Context |
| :--- | :--- | :--- |
| **Internal Docs** | ADR-001 (Validation step) | Probe live error shape when creds exist; prune tolerated branches once confirmed |
| **Past Tickets** | m89x9w (M2RECON step-2b) | Implemented `parseErrorBody` multi-envelope + `RateLimitSnapshot`; evidence mocked-fetch only |
| **Similar Systems** | RFC `RateLimit-*` draft vs `X-RateLimit-*` | Need to confirm which family the live server emits |
| **Team Knowledge** | Memory API owner | Can confirm error envelope + rate-limit header contract |
| **External Research** | Fetch spec `Headers.get()` | Case-insensitive — casing mismatch is safe in principle, but header *family* must still be confirmed |

---

## Initial Hypotheses & Questions

> Brainstorm the assumptions the SDK currently bakes in and what the live probe must confirm or refute.

**Initial Hypotheses:**
* Hypothesis: The live server emits RFC-draft `RateLimit-Limit` / `RateLimit-Remaining` / `RateLimit-Reset` (the names `parseRateLimit` reads), not `X-RateLimit-*`.
* Hypothesis: At least one of the multiple error-body envelopes `parseErrorBody` tolerates is **never** produced by the live API and can be pruned.
* Hypothesis: `RateLimit-Reset` is delta-seconds (not an absolute epoch timestamp).

**Key Questions to Answer:**
* Question: What is the exact JSON body the API returns for each error status the SDK maps?
* Question: What are the exact `RateLimit-*` header names/casing on a real 429, and what units does `-Reset` use?
* Question: Which `parseErrorBody`/`parseRateLimit` tolerance branches are exercised by the live API, and which are dead?

**Potential Approaches to Explore:**
* Approach 1: Hit the deployed API with a scoped credential and trigger each error class (bad auth, missing resource, malformed payload, rate-limit burst), recording raw responses.
* Approach 2: Ask the API owner for the authoritative error-envelope + rate-limit-header contract and reconcile it against the SDK's parser branches.

**Known Unknowns:**
* Unknown: Whether live credentials/a test tenant can be provisioned for this environment at all.
* Unknown: Whether the API rate-limits deterministically enough to capture a 429 on demand.

**Investigation Constraints:**
* Constraint: **Requires live Memory API credentials, which do not exist in this environment.** This is the external prerequisite that blocks the card.
* Constraint: Must not commit any real credential or tenant-identifying response data; redact verification artifacts.

---

## Investigation Log

| Iteration # | Hypothesis / Goal | Test/Action Taken | Outcome / Findings |
| :---: | :--- | :--- | :--- |
| **1** | Confirm live error-body shapes per status class | Trigger each error class against deployed API, record raw JSON | _pending live creds_ |
| **2** | Confirm `RateLimit-*` header names/casing/units on a real 429 | Force a rate-limit, inspect response headers | _pending live creds_ |
| **3** | Decide prune/keep for each tolerance branch | Map live evidence to `parseErrorBody`/`parseRateLimit` branches | _pending live creds_ |

---

#### Iteration 1: Live error-body shape capture

**Hypothesis/Goal:** Capture the real error response body for each error class the SDK distinguishes and compare against the envelopes `parseErrorBody` tolerates.

**Test/Action Taken:** _pending — requires live credentials._

**Outcome:** _pending._

---

#### Iteration 2: RateLimit header confirmation

**Hypothesis/Goal:** Confirm the actual `RateLimit-*` header family, casing, and `-Reset` units the live server emits on a 429.

**Test/Action Taken:** _pending — requires live credentials and a way to provoke a 429._

**Outcome:** _pending._

---

#### Iteration 3: Prune decision

**Hypothesis/Goal:** For each tolerance branch in `parseErrorBody` and `parseRateLimit`, decide prune vs keep based on the live evidence.

**Test/Action Taken:** _pending — depends on Iterations 1–2._

**Outcome:** _pending._

---

## Spike Findings & Recommendation

| Task | Detail/Link |
| :--- | :--- |
| **PoC Code** | _n/a — verification probe, not a build_ |
| **Test Results** | _verification artifact: captured raw error bodies + 429 headers (redacted)_ |
| **Recommendation Doc** | _prune/keep decision per tolerance branch_ |
| **Presentation/Demo** | _n/a_ |

### Final Synthesis & Recommendation

#### Summary of Findings
_To be filled when live credentials exist and the probe runs. Must directly answer: do the live error-body shapes and `RateLimit-*` headers match the SDK's current parser assumptions, and which tolerance branches are dead?_

#### Recommendation
_To be filled. Expected form: "Prune branches X, Y from `parseErrorBody` / `parseRateLimit` (confirmed never produced by live API); retain branch Z with rationale; file a follow-up implementation card for the prune if non-trivial."_

#### Alternative Approaches Considered
_Asking the API owner for the authoritative contract instead of black-box probing — faster but should still be cross-checked against at least one captured live response._

### Follow-up & Lessons Learned

| Topic | Status / Action Required |
| :--- | :--- |
| **Implementation Card Created?** | _Create a prune card if the live evidence proves branches dead_ |
| **Further Investigation Needed?** | _TBD after probe_ |
| **Documentation Updated?** | _Update ADR-001 Validation step with the confirmed contract_ |
| **PoC Code Preserved?** | _n/a_ |
| **Team Communicated?** | _Share confirmed error/rate-limit contract with API owner + SDK consumers_ |
| **Lessons Learned?** | _TBD_ |

### Completion Checklist

* [ ] Investigation question was clearly answered.
* [ ] All hypotheses were tested and outcomes documented.
* [ ] Success criteria were met (live error bodies + 429 headers captured, prune decision recorded).
* [ ] Time box was respected (investigation completed within limit).
* [ ] Findings are documented in investigation log.
* [ ] Final recommendation is clear and actionable.
* [ ] Alternative approaches were considered and documented.
* [ ] Follow-up work is captured (prune implementation card created if warranted).
* [ ] PoC code is preserved [n/a].
* [ ] Team was communicated findings (confirmed contract shared).
* [ ] Related tickets updated or closed (m89x9w follow-up; ADR-001 Validation step).

---

### Note on validation

This card follows a structured template. Keep its sections, checkboxes, and tables and fill them in rather than removing them.


## BLOCKED
Requires live Memory API credentials, which do not exist in this environment. This is a true external prerequisite, not a "we'll get to it" deferral: the executor's evidence on the originating card (m89x9w) was mocked-fetch only precisely because there are no creds, and ADR-001's Validation step explicitly gates this probe on "when creds exist." It is the recorded trigger to prune the tolerated tolerance branches in parseErrorBody/parseRateLimit once the live error-body shapes and RateLimit-* header casing/units are confirmed. Unblock when live credentials (or a test tenant) for the deployed Memory API become available.
