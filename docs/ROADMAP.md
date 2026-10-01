# Roadmap

Phases are a plan and may change. Lasting decisions live in `docs/adr/`.

## Phase 1: MVP
- Scaffold: TypeScript strict, esbuild bundle to `dist/`, vitest, eslint/prettier, CI (incl. dist up-to-date check), MIT.
- Read PR diff and full changed files (head SHA) via Octokit; detect fork PRs.
- Filter noise (lock files, binaries, generated, secret-like files); redact obvious secrets.
- Per-model token budget with priority trimming (diff, changed files); note what was omitted.
- Single Brain: GitHub Models via OpenAI-compatible endpoint, zod-validated JSON output (`summary` + `findings[]`), behind the chain interface.
- Sticky Summary (hidden marker) with model footer; fork PRs go to the job summary.
- Tests: filtering, budgeting, redaction, sticky-comment upsert. End to end in private `ezpr-sandbox`.

## Phase 2: Fallback chain
- Brains for Gemini, OpenRouter, Groq, Anthropic, OpenAI, custom endpoint (`EZPR_BASE_URL`/`EZPR_MODEL`/`EZPR_API_KEY`); enabled only when credentials exist.
- Default order: Gemini, OpenRouter, Groq, Anthropic, OpenAI, custom, GitHub Models.
- Error classification per ADR-0002; footer shows final model plus skipped Brains.
- Model names live in config. Tests for chain and error classification.

## Phase 3: Inline comments
- Line-accurate placement against the diff; map Findings to review comments.
- Skip lines already commented on in earlier runs; severity threshold decides inline vs summary-only.

## Phase 4: Better context
- Follow imports: TS/JS, Python, C/C++ `#include`; grep fallback for other languages.
- Find usages of changed symbols and include caller snippets.
- Always include `REVIEW.md`; ignore list; chunk large PRs.
- Tests for context gathering.

## Phase 5: Config and errors
- `.ezpr.yml`: brain order, strictness (chill/balanced/strict), ignored paths, language, custom rules.
- Helpful comments for no keys, all Brains failed, PR too large.

## Phase 6: Commands, CLI, release
- `@ezpr review`, `@ezpr explain`, `@ezpr ignore` (separate `issue_comment` trigger).
- `npx <name> init`: writes the workflow, opens the key signup page, runs `gh secret set`.
- README polish (incl. free-tier data-use warning), Marketplace release.

## Open questions
- Phase 6: npm package name for the CLI; command trigger design.
- Verify current GitHub Models endpoint, `models: read` permission, limits and model names before Phase 1 code.
