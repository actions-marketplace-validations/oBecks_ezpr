import { z } from 'zod';

export const FindingSchema = z.object({
  file: z.string().describe('Path of the changed file, exactly as given'),
  line: z.number().int().positive().describe('Line number in the new version of the file'),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  message: z.string().describe('What is wrong and why it matters, with a suggested fix'),
});

export const ReviewSchema = z.object({
  summary: z.string().describe('Short overview of the change and the main risks'),
  findings: z.array(FindingSchema),
});

export type Finding = z.infer<typeof FindingSchema>;
export type Review = z.infer<typeof ReviewSchema>;
