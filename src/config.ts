export interface BrainConfig {
  model: string;
  /** Approximate input token budget for the whole prompt. */
  maxInputTokens: number;
}

export const DEFAULT_GEMINI: BrainConfig = {
  model: 'gemini-3.5-flash',
  maxInputTokens: 100_000,
};

export const SUMMARY_MARKER = '<!-- ezpr:summary -->';
