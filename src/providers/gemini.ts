import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import type { BrainConfig } from '../config';
import { ReviewSchema } from '../prompt/schema';
import type { Brain } from './types';

export function geminiBrain(apiKey: string, cfg: BrainConfig): Brain {
  const google = createGoogleGenerativeAI({ apiKey });
  return {
    id: `gemini/${cfg.model}`,
    maxInputTokens: cfg.maxInputTokens,
    async review(system, prompt) {
      const { object } = await generateObject({
        model: google(cfg.model),
        schema: ReviewSchema,
        system,
        prompt,
      });
      return object;
    },
  };
}
