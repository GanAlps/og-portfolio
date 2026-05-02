# Post 3 — Serving LLMs in Production

**Status:** Post 3 v2 — answers locked from review.

## Locked answers (from review)

1. **Comparison table:** rendered via markdown-table syntax. Required wiring `remark-gfm` into `src/components/mdx.tsx` (markdown tables didn't parse before). Custom `table/thead/tr/th/td` overrides give it Once UI styling. Cross-cutting fix — every post can now use markdown tables.
2. **Roofline image:** Aleksa Gordić's diagram retained.
3. **WebRTC section:** kept.
4. **Triton / TRT-LLM:** left out.
5. **Length:** confirmed acceptable.

## Locked answers (defaults applied)

1. **Comparison style:** styled MDX `Table` component for the vLLM/TGI/Ollama matrix.
2. **Roofline image:** Aleksa Gordić's vLLM internals blog.
3. **WebRTC section:** keep — sets up Post 14 (audio/video).
4. **Triton / TRT-LLM:** skip (your notes mark TRT-LLM N/R).
5. **Length:** target 2000–2400 words.

**Slug:** `llm-internals-03-serving-llms-in-production`
**File path:** `src/app/blog/posts/llm-internals-03-serving-llms-in-production.mdx`
**Image folder:** `public/images/blog/llm-internals-03-serving-llms-in-production/`

## Source notes mapped

- `~/Documents/AI Theory/Inference/Inference Servers` — full file (vLLM, TGI, Ollama comparison; OpenAI-compatible API; Modelfile / GGUF).
- `~/Documents/AI Theory/Inference/vLLM` — full file (3-step lifecycle, scheduler, prefill vs decode, optimisations overview — depth on optimisations is in Posts 4 and 5).
- `~/Documents/AI Theory/Inference/Streaming` — full file (SSE vs WebSocket, prefix-aware routing, dropped-connection recovery, WebRTC for audio/video).
- `~/Documents/AI Theory/Inference/Inference Components` — full file (SageMaker ICs, scaling, scale-to-zero, LoRA adapter packing).

## Frontmatter draft

```yaml
---
title: "Serving LLMs in Production"
subtitle: "vLLM, the prefill/decode split, streaming, and how cloud platforms pack many models onto one box"
publishedAt: "2026-05-22"
summary: "Part 3 of The LLM Internals Course. From the model out to the user — what a modern inference server actually does. We compare vLLM, TGI, and Ollama, walk through vLLM's three-step request lifecycle, see why streaming uses SSE instead of WebSockets, and look at how AWS SageMaker Inference Components pack many fine-tuned models onto a single endpoint."
tag: "AI"
series: "llm-internals-course"
part: 3
partTitle: "Serving LLMs in Production"
images: []
team: []
---
```

## Section outline (target ~2000–2400 words)

1. **From a model file to a user** — opening framing: what does an "inference server" actually do beyond `model.generate()`?
2. **The three big inference servers** — vLLM (production king), TGI (HF ecosystem, Rust+C++), Ollama (local dev, llama.cpp wrapper, GGUF format). Comparison table.
3. **The OpenAI-compatible API standard** — why it matters: drop-in swappability between vLLM, TGI, Ollama, OpenAI itself.
4. **Inside vLLM: a request's life in three steps** — Schedule → Forward → Postprocess. Brief on each.
5. **Prefill vs decode: two different beasts** — prefill is compute-bound, decode is memory-bandwidth-bound. Why the scheduler distinguishes them. Foreshadows Post 4 (KV opts) and Post 5 (P/D disaggregation).
6. **The optimisation landscape (preview)** — name-drop PagedAttention, continuous batching, chunked prefill, prefix caching, speculative decoding, P/D disaggregation. One-line each, "we'll dig into these in Posts 4 and 5."
7. **Streaming: SSE, not WebSockets** — why SSE. The dropped-connection recovery dance (request ID + last-event ID).
8. **Routing for prefix caching** — three strategies: session stickiness, prefix-aware hashing (vLLM/RayServe), explicit `prompt_cache_key` (OpenAI). Why this exists.
9. **Audio/video: WebRTC, not WebSocket** — short detour for the multimodal posts later. UDP vs TCP, built-in noise cancellation.
10. **Multi-model serving: SageMaker Inference Components** — why pack many models on one endpoint. ICs, copies, managed scaling, scale-to-zero. The LoRA-adapter packing pattern.
11. **Coming up next** — Post 4 (KV cache optimisations: PagedAttention, MQA/GQA, FlashAttention, batching).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2 Three servers | A — Mermaid (table) | Comparison table: vLLM / TGI / Ollama × backend lang, license, target use, key features. | Authored mermaid table OR styled MDX `Table` component | to draft |
| 2 | §4 vLLM lifecycle | A — Mermaid | Schedule → Forward pass → Postprocess loop. Annotate which optimisations live where. | Authored mermaid `flowchart LR` | to draft |
| 3 | §5 Prefill vs decode | B — Sourced image | Bandwidth/compute roofline: prefill on the compute axis, decode on the memory-bandwidth axis. | vLLM blog "Inference Anatomy" or aleksagordic.com/blog/vllm. Caption + link. | needs sourcing |
| 4 | §5 Prefill vs decode | A — Mermaid | Side-by-side: prefill (many tokens, one Q/K/V batch) vs decode (one new token, KV cache reads). | Authored mermaid | to draft |
| 5 | §6 Optimisation map | A — Mermaid | A taxonomy diagram: KV-cache opts, scheduler opts, multi-GPU opts. Sets up Post 4/5. | Authored mermaid | to draft |
| 6 | §7 SSE vs WebSocket | A — Mermaid | Two sequence diagrams: SSE (one-way, server pushes events) vs WebSocket (two-way). | Authored mermaid `sequenceDiagram` | to draft |
| 7 | §8 Routing | A — Mermaid | Load balancer with three strategies (session, prefix hash, cache key) routing to backend nodes. | Authored mermaid | to draft |
| 8 | §10 SageMaker ICs | B — Sourced image | AWS docs architecture diagram showing one endpoint with multiple ICs sharing instances. | AWS Blog "Reduce model deployment costs by 50% on average using the latest features of Amazon SageMaker" or AWS docs. Caption + link. | needs sourcing |
| 9 | §10 SageMaker ICs | A — Mermaid | LoRA-adapter packing: one base IC + N adapter ICs. | Authored mermaid | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #3 | Aleksa Gordić, "vLLM internals" — prefill-vs-decode roofline figure | https://www.aleksagordic.com/blog/vllm |
| #8 | AWS Machine Learning Blog, "Reduce model deployment costs by 50%" — Inference Components architecture diagram showing one endpoint with multiple ICs | https://aws.amazon.com/blogs/machine-learning/reduce-model-deployment-costs-by-50-on-average-using-sagemakers-latest-features/ |
| Audit #2 | Aleksa Gordić, "vLLM internals" — schedule → forward → postprocess lifecycle diagram | https://www.aleksagordic.com/blog/vllm |
| Audit #4 | Aleksa Gordić, "vLLM internals" — prefill vs decode side-by-side | https://www.aleksagordic.com/blog/vllm |
| Audit #6 | MDN, "Server-Sent Events" page — sequence-style illustration; pair with WebSocket equivalent | SSE: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events — WebSocket: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API |
| Audit #9 | AWS blog, "Reduce model deployment costs by 50%" — LoRA-adapter packing figure | https://aws.amazon.com/blogs/machine-learning/reduce-model-deployment-costs-by-50-on-average-using-sagemakers-latest-features/ |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (server comparison table) | **Use styled MDX `Table` component.** Cleaner than mermaid for tabular data. | — |
| #2 (vLLM lifecycle: schedule → forward → postprocess) | **Replace with sourced.** | Aleksa Gordić's vLLM internals blog (the lifecycle diagram). https://www.aleksagordic.com/blog/vllm — *Mermaid kept as fallback.* |
| #4 (prefill vs decode side-by-side) | **Replace with sourced.** | Aleksa Gordić's vLLM blog (prefill vs decode comparison) OR Hugging Face TGI architecture blog. https://huggingface.co/blog/martinigoyanes/llm-inference-at-scale-with-tgi — *Mermaid kept as fallback.* |
| #5 (optimisation taxonomy map) | **Keep mermaid.** Custom taxonomy framing for this post; no published version. | — |
| #6 (SSE vs WebSocket sequence diagrams) | **Replace with sourced.** | MDN, "Server-Sent Events" (with sequence illustrations) + WebSocket equivalent. https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events — *Mermaid kept as fallback.* |
| #7 (routing strategies for prefix caching) | **Keep mermaid.** Custom illustration of three strategies; no canonical published figure. | — |
| #9 (LoRA-adapter packing on IC) | **Replace with sourced.** | AWS Machine Learning Blog, "Reduce model deployment costs by 50%" — has LoRA-adapter-packing diagram. https://aws.amazon.com/blogs/machine-learning/reduce-model-deployment-costs-by-50-on-average-using-sagemakers-latest-features/ — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

**From your study notes**
- Aleksa Gordić, "vLLM internals." https://www.aleksagordic.com/blog/vllm
- Martín Iglesias Goyanes, "Anatomy of TGI for LLM Inference." https://medium.com/@martiniglesiasgo/anatomy-of-tgi-for-llm-inference-i-6ac8895d903d
- Hugging Face blog, "LLM Inference at Scale with TGI." https://huggingface.co/blog/martinigoyanes/llm-inference-at-scale-with-tgi

**Inference servers**
- vLLM project documentation. https://docs.vllm.ai/
- Hugging Face TGI documentation. https://huggingface.co/docs/text-generation-inference
- Ollama documentation. https://github.com/ollama/ollama/tree/main/docs
- llama.cpp project. https://github.com/ggerganov/llama.cpp

**Streaming & routing**
- MDN, "Server-Sent Events." https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- WebRTC vs WebSocket, MDN. https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
- Anyscale Ray Serve docs (prefix-aware routing). https://docs.ray.io/en/latest/serve/

**Multi-model serving**
- AWS, "Reduce model deployment costs by 50% on average using the latest features of Amazon SageMaker." https://aws.amazon.com/blogs/machine-learning/reduce-model-deployment-costs-by-50-on-average-using-sagemakers-latest-features/
- AWS SageMaker Inference Components docs. https://docs.aws.amazon.com/sagemaker/latest/dg/inference-components.html

## Open questions

1. **Comparison table style:** mermaid table vs. styled MDX `Table` component? The MDX route gives sortability/styling; mermaid renders inline as a single image.
2. **Roofline image (#3):** any preference between aleksagordic's vLLM blog version and a NVIDIA-style classic roofline diagram?
3. **Section 9 (WebRTC):** keep the detour or drop it? Argument for: it sets up multimodal posts. Argument against: it's tangential to inference proper.
4. **Should I also mention Triton Inference Server, TensorRT-LLM?** Your notes mark TRT-LLM N/R, so I've left it out. Confirm.
5. **Length:** this one might run hot toward 2400 words because of the breadth. OK?
