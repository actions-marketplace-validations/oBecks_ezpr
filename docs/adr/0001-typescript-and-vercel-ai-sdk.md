# TypeScript JavaScript action with the Vercel AI SDK

The original brief proposed Python + LiteLLM. We chose a native TypeScript JavaScript action using the Vercel AI SDK for multi-provider support: it starts fast (no per-run `pip install`), needs no Python setup step, and is the idiomatic way to ship a Marketplace Action. The cost is that LiteLLM's built-in fallbacks are gone, so we own the fallback chain (see ADR-0002), and the bundled `dist/` must be built and committed.
