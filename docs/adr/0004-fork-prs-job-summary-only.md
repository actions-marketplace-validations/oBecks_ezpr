# Fork PRs write to the job summary only

On `pull_request` from a fork the token is read-only and secrets are unavailable, so comments cannot be posted. We write the Review to the job summary and document the limitation rather than supporting `pull_request_target`, which runs with write access next to untrusted code. If added later it must be opt-in and must only read PR code as text, never execute it.
