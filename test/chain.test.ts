import { describe, expect, it } from 'vitest';
import { ChainError, runChain } from '../src/providers/chain';
import type { Brain } from '../src/providers/types';

const brain = (id: string): Brain => ({
  id,
  maxInputTokens: 1,
  review: async () => ({ summary: id, findings: [] }),
});

describe('runChain', () => {
  it('returns the first brain that succeeds and records failures', async () => {
    const a = brain('a');
    const b = brain('b');
    const r = await runChain([a, b], async (x) => {
      if (x === a) throw new Error('429');
      return { summary: x.id, findings: [] };
    });
    expect(r.brain).toBe(b);
    expect(r.failures).toEqual([{ brain: 'a', error: '429' }]);
  });

  it('throws ChainError when all brains fail', async () => {
    await expect(
      runChain([brain('a')], async () => {
        throw new Error('boom');
      }),
    ).rejects.toBeInstanceOf(ChainError);
  });
});
