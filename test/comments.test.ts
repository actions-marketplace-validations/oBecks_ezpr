import { describe, expect, it } from 'vitest';
import { SUMMARY_MARKER } from '../src/config';
import { findStickyComment } from '../src/github/comments';

describe('findStickyComment', () => {
  it('finds the comment carrying the marker', () => {
    const comments = [
      { id: 1, body: 'hello' },
      { id: 2, body: `${SUMMARY_MARKER}\nold review` },
      { id: 3, body: null },
    ];
    expect(findStickyComment(comments)?.id).toBe(2);
  });

  it('returns undefined when there is none', () => {
    expect(findStickyComment([{ id: 1, body: 'x' }])).toBeUndefined();
  });
});
