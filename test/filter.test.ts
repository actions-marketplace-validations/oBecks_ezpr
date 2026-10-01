import { describe, expect, it } from 'vitest';
import { skipReason } from '../src/context/filter';

describe('skipReason', () => {
  it('skips lock files, bundles and binaries as noise', () => {
    for (const p of [
      'package-lock.json',
      'a/yarn.lock',
      'dist/index.cjs',
      'x.min.js',
      'logo.png',
    ]) {
      expect(skipReason(p)).toBe('noise');
    }
  });

  it('flags secret-like files', () => {
    for (const p of ['.env', 'config/.env.production', 'certs/server.pem', 'home/id_rsa']) {
      expect(skipReason(p)).toBe('secret');
    }
  });

  it('allows normal source files', () => {
    expect(skipReason('src/main.ts')).toBeNull();
    expect(skipReason('README.md')).toBeNull();
  });
});
