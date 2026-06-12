# memory-sdk-ts — project conventions

TypeScript SDK for the xtrace memory API (`@xtraceai/memory`). Published manually
to npm (see `RELEASING.md`). Node 18+. Build: `tsup`. Tests: `vitest`.

## Contributing & gitban overlay  ← settled; do not re-litigate

This checkout is a **fork** of `XTraceAI/memory-sdk-ts` used as our gitban
workspace. The strategy below is decided — follow it, don't redesign it.

### Remotes
- `origin`   → `github.com/muunkky/memory-sdk-ts` — our fork. We push here.
- `upstream` → `github.com/XTraceAI/memory-sdk-ts` — canonical. Read-only for us
  (the authed account has pull, not push).

### The overlay is tracked on purpose
`.gitban/` (cards, roadmap, hooks, agent inboxes) and `.claude/` (agents, skills,
`settings.json`) are **committed** on our fork. Reason: parallel-subagent
dispatch uses git worktrees, and a worktree is a checkout of HEAD — it only
receives *tracked* files. If the overlay were blanket-ignored (`.gitban/**`),
every worktree would spawn missing its hooks/cards/inboxes and dispatch would
thrash. So we track the durable surface and ignore only regenerable runtime
junk (worktrees, logs, traces, audit, views, viewer-port) — see `.gitignore`.
This mirrors the `../deepnote` repo's setup. The `.gitignore.gitban` sample is
ignored; its intent is already merged into `.gitignore`.

### Day-to-day work
Work on `main` (our fork's workspace branch — carries the overlay). Track gitban
cards locally for tasks; commit board state freely. The pre-commit gate
(`.git/hooks/pre-commit`, local-only) runs `typecheck → test → build` **only when
code is staged** — board/doc-only commits skip it. There is **no CI**, so this
local gate (= the `prepublishOnly` gate) is the only automated safety net.

### Contributing upstream (clean PRs)
`main` carries the overlay, so **never PR a branch cut from `main`** — it would
drag 200+ gitban files into the diff. Instead, branch the code change from the
pristine canonical ref:
```bash
git fetch upstream
git checkout -b cr/<topic> upstream/main      # clean base — no overlay
# port/commit ONLY the code change (src/, examples/, spec/, package.json, …)
npm run typecheck && npm test && npm run build
git push -u origin cr/<topic>
gh pr create --repo XTraceAI/memory-sdk-ts --base main --draft
```
Branch naming: `<initials>/<topic>` (matches their history, e.g. `tc/recall-pools`).
Pre-1.0 versioning: breaking changes bump the **minor** — call them out in the PR.

### Note on the `.gitban/hooks/*.sh`
These are Claude Code **PreToolUse guards** (they stop direct edits to gitban
state), not git hooks and unrelated to the SDK build. Don't conflate them with
the `.git/hooks/pre-commit` gate above.
