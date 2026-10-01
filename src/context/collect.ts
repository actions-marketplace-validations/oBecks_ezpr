import { fitToBudget, type FileEntry } from './budget';
import { skipReason } from './filter';
import { redact } from './redact';

export interface RawFile {
  path: string;
  status: string;
  patch?: string;
}

export interface Context {
  files: FileEntry[];
  skippedNoise: string[];
  skippedSecrets: string[];
  droppedDiffs: string[];
  droppedContents: string[];
}

/** Maximum size of one file's full content we will consider sending. */
const MAX_FILE_CHARS = 200_000;

export async function collectContext(
  raw: RawFile[],
  readFile: (path: string) => Promise<string | null>,
  budgetTokens: number,
): Promise<Context> {
  const skippedNoise: string[] = [];
  const skippedSecrets: string[] = [];
  const candidates: FileEntry[] = [];

  for (const f of raw) {
    const reason = skipReason(f.path);
    if (reason === 'secret') {
      skippedSecrets.push(f.path);
      continue;
    }
    if (reason === 'noise' || !f.patch) {
      skippedNoise.push(f.path);
      continue;
    }
    const content = f.status === 'removed' ? null : await readFile(f.path);
    candidates.push({
      path: f.path,
      status: f.status,
      patch: redact(f.patch),
      content: content !== null && content.length <= MAX_FILE_CHARS ? redact(content) : undefined,
    });
  }

  const fitted = fitToBudget(candidates, budgetTokens);
  return {
    files: fitted.files,
    skippedNoise,
    skippedSecrets,
    droppedDiffs: fitted.droppedDiffs,
    droppedContents: fitted.droppedContents,
  };
}
