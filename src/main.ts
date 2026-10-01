import * as core from '@actions/core';
import * as github from '@actions/github';
import { DEFAULT_GEMINI } from './config';
import { collectContext } from './context/collect';
import { upsertSummary } from './github/comments';
import { fileReader, listChangedFiles, loadPr } from './github/pr';
import { buildPrompt, SYSTEM_PROMPT } from './prompt/builder';
import { runChain } from './providers/chain';
import { geminiBrain } from './providers/gemini';
import type { Brain } from './providers/types';
import { renderErrorComment, renderReview, renderSetupComment } from './render/summary';

async function run(): Promise<void> {
  const pull = github.context.payload.pull_request;
  if (!pull) {
    core.info('Not a pull_request event; nothing to review.');
    return;
  }

  const octokit = github.getOctokit(core.getInput('github-token', { required: true }));
  const repo = github.context.repo;
  const pr = await loadPr(octokit, repo, pull.number);

  // Fork PRs get a read-only token, so results go to the job summary (ADR-0004).
  const publish = async (body: string): Promise<void> => {
    if (pr.isFork) {
      await core.summary.addRaw(body).write();
      core.info('Fork PR: wrote review to the job summary instead of commenting.');
    } else {
      await upsertSummary(octokit, repo, pr.number, body);
    }
  };

  const apiKey = core.getInput('gemini-api-key') || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    core.warning('No GEMINI_API_KEY found.');
    await publish(renderSetupComment());
    return;
  }
  core.setSecret(apiKey);

  const model = core.getInput('model') || DEFAULT_GEMINI.model;
  const brains: Brain[] = [geminiBrain(apiKey, { ...DEFAULT_GEMINI, model })];
  const budget = Math.min(...brains.map((b) => b.maxInputTokens));

  const raw = await listChangedFiles(octokit, repo, pr.number);
  const ctx = await collectContext(raw, fileReader(octokit, pr), budget);
  if (ctx.files.length === 0) {
    core.info('No reviewable files in this PR.');
    return;
  }

  const prompt = buildPrompt({ title: pr.title, body: pr.body }, ctx);
  try {
    const { review, brain, failures } = await runChain(brains, (b) =>
      b.review(SYSTEM_PROMPT, prompt),
    );
    await publish(renderReview(review, brain.id, ctx, failures));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    core.error(message);
    await publish(renderErrorComment(message));
  }
}

run().catch((err) => core.setFailed(err instanceof Error ? err.message : String(err)));
