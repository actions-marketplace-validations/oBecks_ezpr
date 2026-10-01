# EzPR

A free, open-source AI pull request reviewer that runs as a GitHub Action.

> Status: Phase 1 (MVP). One summary comment per PR. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Setup

1. Create a free Gemini key at https://aistudio.google.com/apikey
2. Add it as a repository secret named `GEMINI_API_KEY`.
3. Add `.github/workflows/ai-review.yml`:

```yaml
name: AI Review
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
permissions:
  contents: read
  pull-requests: write
jobs:
  review:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    steps:
      - uses: oBecks/ezpr@main
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

Without a key, EzPR posts a comment explaining how to add one.

## Privacy

Free API tiers may use submitted code to improve the provider's models. For private
repositories, decide what you are comfortable sending. EzPR skips secret-like files
(`.env`, keys) and redacts common secret formats before sending anything.

## Fork PRs

On pull requests from forks the token is read-only, so EzPR writes the review to the job
summary instead of commenting (see [ADR-0004](docs/adr/0004-fork-prs-job-summary-only.md)).

## Development

```bash
npm ci
npm test
npm run build   # rebuilds dist/, which must be committed
```
