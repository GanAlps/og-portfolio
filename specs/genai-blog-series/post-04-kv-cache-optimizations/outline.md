# Post 4 — KV Cache Optimizations

**Status:** Post 4 v2 — answers locked from review.

## Locked answers (from review)

1. **PagedAttention image:** use the on-disk file (compressed). Apply image compression rule going forward.
2. **FlashAttention v1 only.** Add one-line callout linking to v2 / v3 reads but don't expand here. Brief inference-focused treatment; deeper training treatment moves to Post 7.
3. **Quantization** — not covered elsewhere in series for inference. Add a dedicated section in Post 4 (between FlashAttention and continuous batching) covering INT8/INT4 weight quantization, NF4, and KV-cache quantization. Section title: "Quantization (a brief tour)".
4. **FlashAttention placement:** stays in Post 4 with inference focus; expanded in Post 7 with training-specific framing.
5. **Length:** up to 2800 words.

**Slug:** `llm-internals-04-kv-cache-optimizations`
**File path:** `src/app/blog/posts/llm-internals-04-kv-cache-optimizations.mdx`
**Image folder:** `public/images/blog/llm-internals-04-kv-cache-optimizations/`

## Source notes mapped

- `~/Documents/AI Theory/Inference/K-V Cache optimizations` — full file (architectural: MQA, GQA; engineering: PagedAttention, FlashAttention, prefix caching).
- `~/Documents/AI Theory/Inference/vLLM` — sections on continuous batching, chunked prefill, prefix caching.

## Frontmatter draft

```yaml
---
title: "KV Cache Optimizations: PagedAttention, MQA/GQA, FlashAttention & Batching"
subtitle: "The set of tricks that turned LLM serving from a research demo into a real business"
publishedAt: "2026-05-29"
summary: "Part 4 of The LLM Internals Course. The KV cache is the single biggest constraint on LLM serving — it grows linearly with tokens and quadratically with batch size, and it's why your GPU runs out of memory before it runs out of compute. We unpack the architectural fixes (MQA, GQA), the engineering fixes (PagedAttention, FlashAttention, continuous batching, chunked prefill, prefix caching), and how they all fit together inside vLLM."
tag: "AI"
series: "llm-internals-course"
part: 4
partTitle: "KV Cache Optimizations"
images: []
team: []
---
```

## Section outline (target ~2400–2800 words; this is the densest inference post)

1. **Why this post exists** — recap from Post 2: KV cache is per-token-per-layer-per-head, scales linearly with sequence length, and is the dominant memory cost during decode. Frame: optimisations split into "store less" (architectural) and "process smarter" (engineering).
2. **Multi-Query Attention (MQA)** — share K and V across all query heads. Memory wins, modest quality loss.
3. **Grouped-Query Attention (GQA)** — middle ground: groups of query heads share K/V. The Llama 3 / modern default.
4. **PagedAttention** — borrow virtual memory paging for KV cache. Fixed-size blocks, indirection table per request, no fragmentation. Why it unlocked vLLM.
5. **FlashAttention** — go below the model: GPU memory hierarchy (SRAM vs DRAM), tiling, fused softmax. Why it's a bigger deal in training than inference but still matters in prefill.
6. **Continuous batching** — the in-flight batching loop. Mid-batch eviction of finished requests, mid-batch admission of new ones. Why it pegs GPU utilisation.
7. **Chunked prefill** — long prompts don't get to monopolise the GPU; cap chunk size and interleave with decode requests.
8. **Prefix caching** — hash a request's prefix tokens, reuse the K/V blocks if a future request matches. The "you are a helpful assistant…" win.
9. **Putting it together: how vLLM stacks them** — short section showing how a request's life under load benefits from PagedAttention + GQA + continuous batching + chunked prefill + prefix caching simultaneously.
10. **Coming up next** — Post 5 (parallelism, speculative decoding, MoE, prefill/decode disaggregation).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 Why this post exists | C — Equation | KV cache size formula: `2 × n_layers × n_heads × d_head × seq_len × batch × bytes_per_element`. Caption: "For Llama-3 70B at 4K context and batch 32, this is ~80 GB just for the cache." | LaTeX → SVG. File: `eq-kv-size.svg`. | to render |
| 2 | §2-§3 MHA / MQA / GQA | B — Sourced image | The canonical side-by-side figure showing MHA (one K/V per head), MQA (one K/V total), GQA (one K/V per group). | Ainslie et al. 2023 "GQA: Training Generalized Multi-Query Transformer Models" Figure 2, OR HF blog "GQA in Llama 2". Caption + link. | needs sourcing |
| 3 | §4 PagedAttention | B — Sourced image | KV blocks + per-request block table (already on disk: `~/Documents/AI Theory/Inference/PagedAttention_ContinuousBatching.png`). | Local file already saved. Copy into post asset folder. Caption + link to vLLM blog. | already on hand |
| 4 | §4 PagedAttention | A — Mermaid | Mini diagram: a request's logical token positions → block table → physical KV blocks (some shared with other requests via prefix caching). | Authored mermaid | to draft |
| 5 | §5 FlashAttention | B — Sourced image | Tri Dao's FlashAttention figure showing tiling and SRAM/HBM data flow. | Tri Dao 2022 "FlashAttention" Figure 1. Caption + link. | needs sourcing |
| 6 | §5 FlashAttention | A — Mermaid | GPU memory hierarchy: registers → SRAM → HBM → host. Annotate sizes and bandwidths. | Authored mermaid | to draft |
| 7 | §6 Continuous batching | B — Sourced image | The classic vLLM continuous batching figure (rows = time, columns = sequences, colours per request). | Anyscale blog "How Continuous Batching Enables 23x Throughput" OR vLLM blog. Caption + link. | needs sourcing |
| 8 | §7 Chunked prefill | A — Mermaid | Two timelines: without chunked prefill (long prompt blocks decodes) vs with chunked prefill (interleaved). | Authored mermaid Gantt | to draft |
| 9 | §8 Prefix caching | A — Mermaid | Two requests sharing prefix → both block-tables point to the same physical KV blocks; suffix tokens diverge. | Authored mermaid | to draft |
| 10 | §9 Putting it together | A — Mermaid | One full picture: a vLLM scheduler step combining all five optimisations. | Authored mermaid (might be best as a labelled annotated diagram) | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #2 | Ainslie et al. 2023 "GQA" Figure 2 — MHA / MQA / GQA side-by-side | Paper: https://arxiv.org/abs/2305.13245 — HTML: https://arxiv.org/html/2305.13245 |
| #2 alt | HF blog "Llama 2: Grouped-Query Attention" figure | https://huggingface.co/blog/llama2 |
| #3 | LOCAL FILE — already on disk | `/home/oshogupta/Documents/AI Theory/Inference/PagedAttention_ContinuousBatching.png` (copy into post asset folder); original from vLLM blog https://blog.vllm.ai/2023/06/20/vllm.html |
| #5 | Tri Dao et al. 2022 "FlashAttention" Figure 1 — tiling + SRAM/HBM data flow | Paper: https://arxiv.org/abs/2205.14135 — HTML: https://arxiv.org/html/2205.14135 |
| #7 | Anyscale blog, "How Continuous Batching Enables 23x Throughput in LLM Inference" — the rows-and-columns continuous batching figure | https://www.anyscale.com/blog/continuous-batching-llm-inference |
| Audit #4 | Kwon et al. 2023 "PagedAttention" Figure 4 — block-table indirection | Paper: https://arxiv.org/abs/2309.06180 — HTML: https://arxiv.org/html/2309.06180 |
| Audit #6 | Tri Dao 2022 "FlashAttention" Figure 1 — SRAM vs HBM hierarchy (same as #5) | https://arxiv.org/abs/2205.14135 |
| Audit #8 | Agrawal et al. 2023 "Sarathi" Figure 1 — chunked-prefill timeline | Paper: https://arxiv.org/abs/2308.16369 — HTML: https://arxiv.org/html/2308.16369 |
| Audit #9 | vLLM blog, "Automatic Prefix Caching" — block-sharing figure | https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #4 (PagedAttention block table per request) | **Replace with sourced.** | Kwon et al. 2023 "PagedAttention" Figure 4 (block-table indirection). https://arxiv.org/abs/2309.06180 — *Mermaid kept as fallback.* |
| #6 (GPU memory hierarchy registers/SRAM/HBM) | **Replace with sourced.** | Tri Dao 2022 "FlashAttention" Figure 1 (SRAM vs HBM bandwidth/size diagram) — exactly this visual. https://arxiv.org/abs/2205.14135 — *Mermaid kept as fallback.* |
| #8 (chunked prefill timeline) | **Replace with sourced.** | Agrawal et al. 2023 "Sarathi" Figure 1 (chunked-prefill timeline visualization). https://arxiv.org/abs/2308.16369 — *Mermaid kept as fallback.* |
| #9 (prefix caching: shared blocks across requests) | **Replace with sourced.** | vLLM official blog post on prefix caching (has a per-request block-table diagram with shared prefix blocks). https://blog.vllm.ai/ — *Mermaid kept as fallback.* |
| #10 (putting it all together inside a vLLM step) | **Keep mermaid.** Custom synthesis figure for this post; no single published version combines all five optimisations. | — |

## Further Reading (links to include in the published post)

**From your study notes**
- Yashvardhan Ghuse, "Core Optimisations in LLMs: Paged Attention, Mixture of Experts, and Flash Attention." https://medium.com/@ygsh0816/core-optimisations-in-llms-paged-attention-mixture-of-experts-and-flash-attention-310295fb91e5
- "Flash Attention deep dive (visual)" — YouTube. https://www.youtube.com/watch?v=LKwyHWYEIMQ

**Architectural optimisations (MQA, GQA)**
- Shazeer 2019, "Fast Transformer Decoding: One Write-Head is All You Need" (MQA). https://arxiv.org/abs/1911.02150
- Ainslie et al. 2023, "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints." https://arxiv.org/abs/2305.13245
- Hugging Face blog, "GQA in Llama 2." https://huggingface.co/blog/llama2

**Engineering optimisations**
- Kwon et al. 2023, "Efficient Memory Management for Large Language Model Serving with PagedAttention" (vLLM). https://arxiv.org/abs/2309.06180
- Tri Dao et al. 2022, "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness." https://arxiv.org/abs/2205.14135
- Tri Dao 2023, "FlashAttention-2." https://arxiv.org/abs/2307.08691
- Agrawal et al. 2023, "Sarathi: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills." https://arxiv.org/abs/2308.16369
- Anyscale blog, "How Continuous Batching Enables 23x Throughput in LLM Inference." https://www.anyscale.com/blog/continuous-batching-llm-inference

**Reference implementation**
- vLLM repository. https://github.com/vllm-project/vllm

## Open questions

1. **The on-disk PagedAttention image** is ~900KB and 1829×2700 px. Should I crop/compress/redraw it for web, or use it as-is with width constraints?
2. **FlashAttention v2 / v3:** your notes only cover the original. Should I include a brief 2-sentence note on FA2's parallelism improvements and FA3's H100 features, or stay strictly with v1?
3. **Quantization (item 7.4 in your contents):** marked as deferred to a Gemini link. OK to include a 1-paragraph callout in §1 ("memory wins also come from quantization, but that's its own topic outside this series") or skip?
4. **Should §5 (FlashAttention) move to Part 2 (Training)** since your notes say it's "more efficient for training"? My take: keep here because it still matters in prefill, and we re-reference it in Post 7 where it shines. OK?
5. **Length:** this is the longest inference post. Comfortable going up to ~2800 words to do all five optimisations justice?
