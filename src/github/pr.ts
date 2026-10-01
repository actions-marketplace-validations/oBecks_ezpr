import * as github from '@actions/github';
import type { RawFile } from '../context/collect';

export type Octokit = ReturnType<typeof github.getOctokit>;

export interface PrInfo {
  number: number;
  title: string;
  body: string;
  headSha: string;
  headRepo: { owner: string; repo: string };
  isFork: boolean;
}

export async function loadPr(
  octokit: Octokit,
  repo: { owner: string; repo: string },
  number: number,
): Promise<PrInfo> {
  const { data } = await octokit.rest.pulls.get({ ...repo, pull_number: number });
  const head = data.head.repo;
  const headRepo = head ? { owner: head.owner.login, repo: head.name } : repo;
  return {
    number,
    title: data.title,
    body: data.body ?? '',
    headSha: data.head.sha,
    headRepo,
    isFork: !head || head.full_name !== data.base.repo.full_name,
  };
}

export async function listChangedFiles(
  octokit: Octokit,
  repo: { owner: string; repo: string },
  number: number,
): Promise<RawFile[]> {
  const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
    ...repo,
    pull_number: number,
    per_page: 100,
  });
  return files.map((f) => ({ path: f.filename, status: f.status, patch: f.patch }));
}

export function fileReader(octokit: Octokit, pr: PrInfo) {
  return async (path: string): Promise<string | null> => {
    try {
      const { data } = await octokit.rest.repos.getContent({
        ...pr.headRepo,
        path,
        ref: pr.headSha,
        mediaType: { format: 'raw' },
      });
      return typeof data === 'string' ? data : null;
    } catch {
      return null;
    }
  };
}
