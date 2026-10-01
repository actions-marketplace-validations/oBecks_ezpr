import { describe, expect, it } from 'vitest';
import { redact, REDACTED } from '../src/context/redact';

describe('redact', () => {
  it('redacts common secret formats', () => {
    const secrets = [
      'AKIAABCDEFGHIJKLMNOP',
      'ghp_' + 'a'.repeat(36),
      'sk-' + 'b'.repeat(30),
      'AIza' + 'c'.repeat(35),
      '-----BEGIN RSA PRIVATE KEY-----\nabc\n-----END RSA PRIVATE KEY-----',
    ];
    for (const s of secrets) {
      expect(redact(`const k = "${s}";`)).toBe(`const k = "${REDACTED}";`);
    }
  });

  it('leaves ordinary code untouched', () => {
    const code = 'const sky = 1; // skip this';
    expect(redact(code)).toBe(code);
  });
});
