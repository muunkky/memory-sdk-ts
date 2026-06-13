Use `.venv/Scripts/python.exe` to run Python commands.

The code for the gitban card with id esxk0v has been approved as of commit 39e11c5. Please use the gitban tools to update the gitban card and begin the tasks required to properly complete it.

## Card Close-out tasks:
- Use gitban's checkbox tools to ensure all checkboxes on the card are checked off for completed work if not already. In particular, the single remaining unchecked box — "Documentation is peer-reviewed for accuracy" — has now been satisfied by reviewer cycle 1 (verdict: APPROVAL, commit 39e11c5); check it off.
- Do not mark any work as deferred. This card will be closed and archived and likely never seen again.
- Use gitban's complete card tool to submit and validate if not already completed.
- Close-out items: none beyond the checkbox above. The review recorded no blockers and no new follow-up from this diff. The two known open threads (live-API probe to confirm the Bearer/error-envelope inferences, and metadata-key-filtering redesign) are already tracked elsewhere — in ADR-001 Validation and the B1 typed-filter-DSL design doc respectively — and are out of scope for this spec-only card. Do not re-capture them.
- If this card is not in a sprint, push the feature branch and create a draft PR to main using `gh pr create --draft`. Do not merge it — the user reviews and merges.

Note: You are closing out this card only. The dispatcher owns sprint lifecycle — do not close, archive, or finalize the sprint itself. The exception is a sprint close-out card, which will be obvious from its content.
