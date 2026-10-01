import type { Review } from '../prompt/schema';
import type { Brain } from './types';

export interface ChainFailure {
  brain: string;
  error: string;
}

export interface ChainSuccess {
  review: Review;
  brain: Brain;
  failures: ChainFailure[];
}

export class ChainError extends Error {
  constructor(public failures: ChainFailure[]) {
    super(`All brains failed: ${failures.map((f) => `${f.brain}: ${f.error}`).join('; ')}`);
  }
}

/** Tries each Brain in order. Phase 2 adds error classification (see ADR-0002). */
export async function runChain(
  brains: Brain[],
  run: (brain: Brain) => Promise<Review>,
): Promise<ChainSuccess> {
  const failures: ChainFailure[] = [];
  for (const brain of brains) {
    try {
      return { review: await run(brain), brain, failures };
    } catch (err) {
      failures.push({ brain: brain.id, error: err instanceof Error ? err.message : String(err) });
    }
  }
  throw new ChainError(failures);
}
