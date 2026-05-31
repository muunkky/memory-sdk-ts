# Releasing `@xtraceai/memory`

Releases are **published manually from a local machine**. There is no CI/GitHub
Action, no release-please, and no Stainless step — any such config in git history
is **legacy and unused** (e.g. a stale `v0.2.0` tag that was never published).
**npm `latest` is the source of truth** for what's actually released.

## Steps

1. **Start from a clean, green `main`:**
   ```bash
   git checkout main && git pull
   ```

2. **Bump the version in `package.json`** — npm won't republish an existing
   version, so this must change. Commit and push it:
   ```bash
   # edit package.json:  "version": "0.3.0"
   git commit -am "release: v0.3.0"
   git push origin main
   ```

3. **Tag the release and push the tag** (keep it in sync with `package.json`):
   ```bash
   git tag v0.3.0
   git push origin v0.3.0
   ```

4. **Authenticate to npm if needed** (publishes as `tristangc`, the `@xtraceai`
   maintainer):
   ```bash
   npm whoami || npm login    # browser OAuth
   ```

5. **Publish.** The `prepublishOnly` hook runs `typecheck → test → build` first
   and aborts the publish if any of them fail:
   ```bash
   npm publish --access public
   ```
   `--access public` is required because the package is scoped (`@xtraceai/…`).

6. **Confirm:**
   ```bash
   npm view @xtraceai/memory version
   ```

## Notes

- **Versioning** (pre-1.0): breaking changes bump the minor (e.g. removing a
  method). Note breaking changes in the PR / release so consumers know to adjust.
- The **`prepublishOnly` gate** (`package.json`) is the safety net — a red
  typecheck/test/build means nothing ships.
- Tag format is `vX.Y.Z`, matching the `package.json` version exactly.
