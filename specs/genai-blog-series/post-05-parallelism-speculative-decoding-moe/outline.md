# Post 5 — Going Bigger & Faster: Parallelism, Speculative Decoding, MoE

**Status:** Post 5 v2 — answers locked from review.

## Locked answers (from review)

1. **3D parallelism:** include a dedicated small section between Sequence Parallelism and the decision tree. Combines TP × PP × DP for the multi-thousand-GPU case.
2. **Speculative decoding figure:** Leviathan et al. 2022 (the paper figure).
3. **MoE depth:** keep it simple — Mixtral 8 experts, top-2 routing. No DeepSeek-MoE shared+fine-grained variant in this post.
4. **Length:** draft first, evaluate. Be diligent about per-section pacing; split or trim if overflow looks ugly.
5. **Decision-tree image (§6):** keep as a flowchart — readers want a quick "which one for which scenario" reference.

**Slug:** `llm-internals-05-parallelism-speculative-decoding-moe`
**File path:** `src/app/blog/posts/llm-internals-05-parallelism-speculative-decoding-moe.mdx`
**Image folder:** `public/images/blog/llm-internals-05-parallelism-speculative-decoding-moe/`

## Source notes mapped

- `~/Documents/AI Theory/Inference/Parallelism` — full file (DP, PP, TP, SP, NVLink, 3D parallelism for inference).
- `~/Documents/AI Theory/Inference/Mixture Of Experts` — full file (router, sparse activation, Mixtral, training/fine-tune challenges).
- `~/Documents/AI Theory/Inference/vLLM` — sections on speculative decoding and prefill/decode disaggregation.

## Frontmatter draft

```yaml
---
title: "Going Bigger & Faster: Parallelism, Speculative Decoding, and MoE"
subtitle: "When one GPU isn't enough, when one model isn't enough, and the trick that lets a big model talk back as fast as a small one"
publishedAt: "2026-06-05"
summary: "Part 5 of The LLM Internals Course. Models outgrew single GPUs years ago. We walk through the four parallelism strategies (DP, PP, TP, SP) and when each one fits, then jump to two more advanced tricks: speculative decoding (a small draft model proposes, the big model verifies in one pass), prefill/decode disaggregation (run them on different hardware), and Mixture-of-Experts (only a fraction of parameters fire per token)."
tag: "AI"
series: "llm-internals-course"
part: 5
partTitle: "Parallelism, Spec Decoding & MoE"
images: []
team: []
---
```

## Section outline (target ~2200–2600 words)

1. **One GPU isn't enough** — the framing: model weights, KV cache, and batch size all push us off a single GPU.
2. **Data Parallelism (DP)** — replicate the model, split the requests. The con: model has to fit per GPU.
3. **Pipeline Parallelism (PP)** — split layers across GPUs, requests flow through. Pipeline bubbles, when PP wins (multi-node, slow interconnect).
4. **Tensor Parallelism (TP)** — split each layer across GPUs. Lowest TTFT, but needs NVLink. The single-node king.
5. **Sequence Parallelism (SP)** — for genuinely huge contexts: shard the *tokens* across GPUs. KV cache becomes a relay race.
6. **Picking your parallelism: a decision tree** — single node + NVLink → TP. Multi-node → PP across, TP within. Long context → add SP. High throughput → add DP.
7. **Speculative decoding** — the draft-and-verify dance. Why one big-model forward pass can validate K small-model tokens for free.
8. **Prefill / decode disaggregation** — different beasts deserve different boxes. KV cache transfer over high-speed network.
9. **Mixture-of-Experts** — sparse activation. Mixtral's 8 experts + router (top-2). The catches: still loaded in VRAM, hard to fine-tune, router bias risk.
10. **Coming up next** — Post 6 (positional encoding: RoPE & YaRN — the long-context trick we kept hinting at).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2-§5 Parallelism overview | B — Sourced image | The canonical 4-panel figure: DP / PP / TP / SP side by side. | NVIDIA Megatron-LM blog OR DeepSpeed docs OR HuggingFace "Model Parallelism" guide. Caption + link. | needs sourcing |
| 2 | §3 PP | A — Mermaid | Pipeline schedule with bubble. Show 4 GPUs and 4 micro-batches across timesteps. | Authored mermaid Gantt | to draft |
| 3 | §4 TP | A — Mermaid | One transformer layer split across 2 GPUs: each does half of the attention heads, all-reduce after. | Authored mermaid | to draft |
| 4 | §5 SP | A — Mermaid | Sequence sharded across GPUs, KV-cache hand-off across the boundary. | Authored mermaid | to draft |
| 5 | §6 Decision tree | A — Mermaid | Flowchart: "single node? NVLink? long context? high throughput?" → which combination. | Authored mermaid | to draft |
| 6 | §7 Speculative decoding | B — Sourced image | The draft-and-verify figure from Leviathan et al. 2022 "Fast Inference from Transformers via Speculative Decoding" Figure 1. | arXiv 2211.17192 Figure 1. Caption + link. | needs sourcing |
| 7 | §7 Speculative decoding | A — Mermaid | Step-by-step: draft model proposes K tokens → big model scores them in one pass → accept prefix + free K+1 → loop. | Authored mermaid | to draft |
| 8 | §8 P/D disaggregation | B — Sourced image | DistServe paper figure showing prefill workers + decode workers connected by high-speed KV transfer. | Zhong et al. 2024 "DistServe" Figure 1 OR vLLM blog. Caption + link. | needs sourcing |
| 9 | §9 MoE | B — Sourced image | Mixtral / Switch Transformer routing figure: input → router → top-K experts → weighted output. | Mixtral paper Figure 1 OR Switch Transformer paper Figure 2. Caption + link. | needs sourcing |
| 10 | §9 MoE | C — Equation | Sparse forward: `y = Σ_i G(x)_i · E_i(x)` where `G(x)` is the router's top-K gating. | LaTeX → SVG. File: `eq-moe-router.svg`. | to render |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #1 | HF "Model Parallelism" guide — DP/PP/TP/SP overview figures | https://huggingface.co/docs/transformers/v4.15.0/parallelism |
| #1 alt | NVIDIA Megatron-LM blog — 4-panel parallelism breakdown | https://developer.nvidia.com/blog/scaling-language-model-training-to-a-trillion-parameters-using-megatron/ |
| #6 | Leviathan et al. 2022 "Speculative Decoding" Figure 1 — draft-and-verify flow | Paper: https://arxiv.org/abs/2211.17192 — HTML: https://arxiv.org/html/2211.17192 |
| #8 | Zhong et al. 2024 "DistServe" Figure 1 — prefill workers + decode workers + KV transfer | Paper: https://arxiv.org/abs/2401.09670 — HTML: https://arxiv.org/html/2401.09670 |
| #9 | Mistral 2024 "Mixtral of Experts" Figure 1 — top-K router + expert blocks | Paper: https://arxiv.org/abs/2401.04088 — HTML: https://arxiv.org/html/2401.04088 |
| #9 alt | Switch Transformer Figure 2 (Fedus et al. 2021) | Paper: https://arxiv.org/abs/2101.03961 — HTML: https://arxiv.org/html/2101.03961 |
| Audit #2 | Megatron-LM Figure 4 — 1F1B pipeline schedule (vanilla vs interleaved) | Paper (Narayanan et al. 2021): https://arxiv.org/abs/2104.04473 |
| Audit #3 | Shoeybi et al. 2019 "Megatron-LM" Figure 3 — TP column-parallel + row-parallel for an MLP | Paper: https://arxiv.org/abs/1909.08053 — HTML: https://arxiv.org/html/1909.08053 |
| Audit #4 | Korthikanti et al. 2022 "Reducing Activation Recomputation" — Sequence Parallelism figure | Paper: https://arxiv.org/abs/2205.05198 — HTML: https://arxiv.org/html/2205.05198 |
| Audit #7 | Leviathan et al. 2022 Figure 1 (same as #6) | https://arxiv.org/abs/2211.17192 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #2 (PP schedule with bubble — vanilla vs 1F1B) | **Replace with sourced.** Already paired with #2 in image plan. | Megatron-LM Figure 4 (1F1B schedule) and GPipe Figure 2 (vanilla bubble). Already sourced. — *Mermaid kept as fallback only if the published figures are too dense.* |
| #3 (TP one layer split across 2 GPUs) | **Replace with sourced.** Same source as #4 in image plan. | Shoeybi et al. 2019 "Megatron-LM" Figure 3. https://arxiv.org/abs/1909.08053 — *Mermaid kept as fallback.* |
| #4 (sequence parallelism: KV-cache hand-off) | **Replace with sourced.** | Korthikanti et al. 2022 "Reducing Activation Recomputation in Large Transformer Models" (Sequence Parallelism in Megatron) — has the canonical SP figure. https://arxiv.org/abs/2205.05198 — *Mermaid kept as fallback.* |
| #5 (parallelism decision tree) | **Keep mermaid.** This is a custom heuristic flow this post invents to help readers pick a strategy; no published equivalent. | — |
| #7 (speculative decoding step-by-step) | **Replace with sourced.** Already covered by #6 in image plan. | Leviathan et al. 2022 Figure 1. — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

**From your study notes**
- Yashvardhan Ghuse, "Core Optimisations in LLMs (MoE section)." https://medium.com/@ygsh0816/core-optimisations-in-llms-paged-attention-mixture-of-experts-and-flash-attention-310295fb91e5

**Parallelism**
- Shoeybi et al. 2019, "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism." https://arxiv.org/abs/1909.08053
- Hugging Face, "Model Parallelism" guide. https://huggingface.co/docs/transformers/v4.15.0/parallelism
- NVIDIA, "Tensor Parallelism in Megatron-LM." https://developer.nvidia.com/blog/scaling-language-model-training-to-a-trillion-parameters-using-megatron/
- DeepSpeed docs, "Pipeline Parallelism." https://www.deepspeed.ai/tutorials/pipeline/

**Speculative decoding**
- Leviathan et al. 2022, "Fast Inference from Transformers via Speculative Decoding." https://arxiv.org/abs/2211.17192
- Chen et al. 2023, "Accelerating Large Language Model Decoding with Speculative Sampling" (DeepMind). https://arxiv.org/abs/2302.01318
- Hugging Face blog, "Assisted Generation." https://huggingface.co/blog/assisted-generation

**Prefill/decode disaggregation**
- Zhong et al. 2024, "DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving." https://arxiv.org/abs/2401.09670
- vLLM blog, "Disaggregated Prefill in vLLM." https://blog.vllm.ai/

**Mixture of Experts**
- Mistral AI, "Mixtral of Experts." https://arxiv.org/abs/2401.04088
- Fedus et al. 2021, "Switch Transformers." https://arxiv.org/abs/2101.03961
- Hugging Face blog, "Mixture of Experts Explained." https://huggingface.co/blog/moe

## Open questions

1. **3D parallelism note (§6):** include or skip? Your notes mention TP+PP+DP combined; for inference (this post) it's less common than for training. Lean toward "mention as a one-paragraph aside, point to Post 8 for training depth." OK?
2. **Speculative decoding figure:** I default to Leviathan et al.; alternative is Chen et al.'s DeepMind paper from the same time. Preference?
3. **MoE depth:** stop at "Mixtral has 8 experts, top-2 routing" or also briefly mention DeepSeek MoE's shared-experts + fine-grained-experts variant? Latter risks scope creep, but is widely deployed in 2025/2026 production.
4. **Length:** four big topics (parallelism, spec decoding, P/D disaggregation, MoE) in one post. Want me to verify by drafting and only then split if it overflows?
5. **Section 6 (decision tree):** is a flowchart-style image too prescriptive for a theory post, or useful as a "memorise this" reference?
