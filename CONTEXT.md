# EzPR

A free, open-source AI pull request reviewer that runs as a GitHub Action.

## Language

**Review**:
One run of EzPR on a pull request, producing one Summary and zero or more Findings.

**Finding**:
A single issue the reviewer raises about a specific line of a changed file, with a severity and a message.

**Summary**:
The one overall comment per pull request. Updated in place on later Reviews rather than re-posted (the "sticky" Summary).

**Brain**:
A provider plus model pair that can write a Review (e.g. GitHub Models with a given model, or Gemini with a given model).

**Fallback chain**:
The ordered list of Brains tried in turn until one succeeds. Built from whichever providers have credentials.

**Zero-key mode**:
Running with no user-supplied API keys, so only the GitHub Models Brain is available. Deliberately "basic".

**Context**:
Everything sent to a Brain besides instructions: the diff, full changed files, and (later) imported files, callers, and project rules.

**Project rules**:
The repo's own `REVIEW.md`, always included in Context when present.

**Fork PR**:
A pull request from a fork, where EzPR cannot post comments and writes the Review to the job summary instead.
