import type { Review } from '../prompt/schema';

export interface Brain {
  /** Human-readable id used in the footer, e.g. "gemini/gemini-3.5-flash". */
  id: string;
  maxInputTokens: number;
  review(system: string, prompt: string): Promise<Review>;
}
