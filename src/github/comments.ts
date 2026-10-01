import { SUMMARY_MARKER } from '../config';
import type { Octokit } from './pr';

export function findStickyComment<T extends { id: number; body?: string | null }>(
  comments: T[],
): T | undefined {
  return comments.find((c) => c.body?.includes(SUMMARY_MARKER));
}

export async function upsertSummary(
  octokit: Octokit,
  repo: { owner: string; repo: string },
  issueNumber: number,
  body: string,
): Promise<void> {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    ...repo,
    issue_number: issueNumber,
    per_page: 100,
  });
  const existing = findStickyComment(comments);
  if (existing) {
    await octokit.rest.issues.updateComment({ ...repo, comment_id: existing.id, body });
  } else {
    await octokit.rest.issues.createComment({ ...repo, issue_number: issueNumber, body });
  }
}
