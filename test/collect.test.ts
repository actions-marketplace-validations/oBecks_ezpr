import { describe, expect, it } from 'vitest';
import { collectContext } from '../src/context/collect';

describe('collectContext', () => {
  it('skips noise and secrets, redacts content, and reads files at head', async () => {
    const read = async (p: string) =>
      p === 'src/a.ts' ? `const t = "ghp_${'a'.repeat(36)}";` : null;
    const ctx = await collectContext(
      [
        { path: 'src/a.ts', status: 'modified', patch: '@@ -1 +1 @@\n+x' },
        { path: 'package-lock.json', status: 'modified', patch: '@@' },
        { path: '.env', status: 'added', patch: '@@\n+KEY=1' },
        { path: 'logo.png', status: 'added' },
      ],
      read,
      10_000,
    );
    expect(ctx.files.map((f) => f.path)).toEqual(['src/a.ts']);
    expect(ctx.files[0]?.content).toContain('[REDACTED]');
    expect(ctx.skippedSecrets).toEqual(['.env']);
    expect(ctx.skippedNoise).toEqual(['package-lock.json', 'logo.png']);
  });

  it('does not read content for removed files', async () => {
    let reads = 0;
    const ctx = await collectContext(
      [{ path: 'old.ts', status: 'removed', patch: '@@ -1 +0,0 @@\n-x' }],
      async () => {
        reads++;
        return 'x';
      },
      10_000,
    );
    expect(reads).toBe(0);
    expect(ctx.files[0]?.content).toBeUndefined();
  });
});
