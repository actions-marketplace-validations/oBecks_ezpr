import { SUMMARY_MARKER } from '../config';
import type { Context } from '../context/collect';
import type { Review } from '../prompt/schema';

const ICON = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' } as const;

export function renderReview(
  review: Review,
  brainId: string,
  ctx: Context,
  failures: { brain: string; error: string }[] = [],
): string {
  const lines = [SUMMARY_MARKER, '## EzPR review', '', review.summary, ''];

  if (review.findings.length) {
    lines.push('### Findings', '');
    for (const f of review.findings) {
      lines.push(`- ${ICON[f.severity]} **${f.severity}** \`${f.file}:${f.line}\` — ${f.message}`);
    }
    lines.push('');
  }

  const omitted = [...ctx.droppedDiffs, ...ctx.droppedContents];
  if (omitted.length) {
    const list = omitted.map((p) => `\`${p}\``).join(', ');
    lines.push(`> Some context was left out to fit model limits: ${list}`, '');
  }
  if (failures.length) {
    lines.push(`> Skipped: ${failures.map((f) => f.brain).join(', ')} (failed, fell back)`, '');
  }
  lines.push(`<sub>Reviewed by EzPR using \`${brainId}\`</sub>`);
  return lines.join('\n');
}

export function renderSetupComment(): string {
  return [
    SUMMARY_MARKER,
    '## EzPR needs an API key',
    '',
    'No model credentials were found, so no review was run.',
    '',
    '1. Create a free key at https://aistudio.google.com/apikey',
    '2. Add it as a repository secret named `GEMINI_API_KEY` (Settings → Secrets and variables → Actions).',
    '3. Pass it to the action:',
    '',
    '```yaml',
    '- uses: oBecks/ezpr@main',
    '  env:',
    '    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}',
    '```',
  ].join('\n');
}

export function renderErrorComment(message: string): string {
  return [
    SUMMARY_MARKER,
    '## EzPR could not complete the review',
    '',
    message,
    '',
    'The job log has details. Re-push or re-run the workflow to try again.',
  ].join('\n');
}
