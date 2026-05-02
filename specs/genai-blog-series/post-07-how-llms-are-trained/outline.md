# Post 7 — How LLMs Are Actually Trained

**Status:** outline / awaiting review

**Slug:** `llm-internals-07-how-llms-are-trained`
**File path:** `src/app/blog/posts/llm-internals-07-how-llms-are-trained.mdx`
**Image folder:** `public/images/blog/llm-internals-07-how-llms-are-trained/`

## Source notes mapped

- `~/Documents/AI Theory/Training/High Level Training Flow.txt` — full file (self-supervised learning, logits/softmax recap, weight breakdown, forward pass, cross-entropy loss, backprop, AdamW, gradient checkpointing, FlashAttention in training, mixed-precision quantization).

## Frontmatter draft

```yaml
---
title: "How LLMs Are Actually Trained"
subtitle: "Self-supervision, the cross-entropy loss, AdamW, and the memory crunch backprop creates"
publishedAt: "2026-06-19"
summary: "Part 7 of The LLM Internals Course. Pre-training is conceptually simple — predict the next token — but the engineering reality is dense. We trace one training step end-to-end: causal masking, the cross-entropy loss, gradient flow through residuals, and why AdamW carries momentum and variance per parameter. Plus the memory tricks (gradient checkpointing, FlashAttention in training, mixed precision) that make the whole thing fit on a GPU."
tag: "AI"
series: "llm-internals-course"
part: 7
partTitle: "How LLMs Are Trained"
images: []
team: []
---
```

## Section outline (target ~2200–2600 words)

1. **Self-supervised: where the labels come from** — "the world is beautiful" → multiple input/output pairs from one sentence. Causal masking is what lets the transformer learn all of them in one pass.
2. **Forward pass during training** — same as inference prefill, but on batched sequences (e.g., 512 sequences × 2048 tokens). Causal masking grid.
3. **The loss: cross-entropy** — derive from "negative log probability of the correct token". Why it's the natural fit for next-token prediction.
4. **Backprop in 2 minutes** — gradient = activation × error signal, propagated layer by layer in reverse. One paragraph; readers should already know this.
5. **The basic update** — `w_new = w_old - lr · ∇L`. Why this alone is unstable at LLM scale.
6. **AdamW: momentum and variance per parameter** — first moment (mean), second moment (variance), bias correction, decoupled weight decay. Why each scenario (consistent / exploding / sparse gradient) is handled.
7. **The memory blow-up** — why training needs ~4× model size in memory (weights + gradients + Adam's m + v). Sets up Post 8 (ZeRO/FSDP).
8. **Activations, the second memory monster** — to backprop, we need the forward-pass activations stored at every layer. For 2048 tokens × 4 micro-batch × 40 layers, that's the bigger problem.
9. **Three memory tricks** — (a) gradient checkpointing: save activations every N layers, recompute the rest; (b) FlashAttention: tiled SRAM compute, no materialised attention matrix; (c) mixed precision: BF16 forward/backward, FP32 master weights.
10. **One full training step, end-to-end** — recap diagram putting it all together.
11. **Coming up next** — Post 8 (distributed training: ZeRO, FSDP, 3D parallelism — once one GPU isn't enough for the optimizer state).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 Self-supervised | A — Mermaid | "The world is beautiful" → 3 input/output pairs in one sequence with causal mask. Visualises the trick. | Authored mermaid | to draft |
| 2 | §2 Forward pass | A — Mermaid | Training-step pipeline: batch → tokens → embed → transformer blocks → logits → loss. | Authored mermaid `flowchart LR` | to draft |
| 3 | §2 Forward pass | B — Sourced image | Causal attention matrix grid (visualises the lower-triangular mask). | Lilian Weng's blog "Attention? Attention!" OR Karpathy's nanoGPT figure. Caption + link. | needs sourcing |
| 4 | §3 Cross-entropy loss | C — Equation | `L = -Σ_t log p_θ(x_t \| x_<t)`, expanded for one position. Caption: "Negative log-probability of the correct next token, averaged over positions." | LaTeX → SVG. File: `eq-cross-entropy.svg`. | to render |
| 5 | §5 Basic update | C — Equation | `w_{t+1} = w_t - η · ∇L(w_t)`. | LaTeX → SVG. File: `eq-sgd-update.svg`. | to render |
| 6 | §6 AdamW | C — Equation | AdamW update: `m_t = β_1 m_{t-1} + (1-β_1) g_t`, `v_t = β_2 v_{t-1} + (1-β_2) g_t^2`, `w_{t+1} = w_t - η · (m̂_t / (√v̂_t + ε) + λ w_t)`. | LaTeX → SVG. File: `eq-adamw.svg`. | to render |
| 7 | §6 AdamW intuition | B — Sourced image | Loss-landscape illustration showing momentum smoothing and variance scaling. | Sebastian Ruder's "Optimization Algorithms" blog OR Lilian Weng's optimizer post. Caption + link. | needs sourcing |
| 8 | §7 Memory blow-up | A — Mermaid (chart) | Stacked bar chart: weights (1×) + gradients (1×) + Adam m (1×) + Adam v (1×) = 4× model size in memory. | Authored mermaid OR styled MDX | to draft |
| 9 | §8 Activations | B — Sourced image | Memory profile of a training step over time: activations dominate. | NVIDIA / Megatron / DeepSpeed memory-profile figure. Caption + link. | needs sourcing |
| 10 | §9 Gradient checkpointing | A — Mermaid | Two layer-stacks side-by-side: (a) all activations stored; (b) only every-Nth, recompute on backward. | Authored mermaid | to draft |
| 11 | §9 Mixed precision | B — Sourced image | NVIDIA mixed-precision diagram showing FP32 master + BF16 forward/backward. | NVIDIA mixed-precision training docs OR PyTorch AMP docs. Caption + link. | needs sourcing |
| 12 | §10 Full step | A — Mermaid | One full step end-to-end: data → forward → loss → backward → optimizer step → next iteration. Annotated with which optimizations live where. | Authored mermaid | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #3 | Lilian Weng, "Attention? Attention!" — causal attention matrix visualization | https://lilianweng.github.io/posts/2018-06-24-attention/ |
| #3 alt | Karpathy `nanoGPT` — causal mask grid figure / video frame from "Let's build GPT" | Repo: https://github.com/karpathy/nanoGPT — Video: https://www.youtube.com/watch?v=kCc8FmEb1nY (~50:00 timestamp) |
| #7 | Sebastian Ruder, "An overview of gradient descent optimization algorithms" — optimizer landscape illustrations | https://www.ruder.io/optimizing-gradient-descent/ |
| #7 alt | Lilian Weng, "Optimization Algorithms for Deep Learning" — momentum/variance visualization | https://lilianweng.github.io/posts/2020-09-25-train-large/ |
| #9 | NVIDIA / Megatron-LM activation memory profile figure | https://developer.nvidia.com/blog/scaling-language-model-training-to-a-trillion-parameters-using-megatron/ |
| #9 alt | DeepSpeed memory profile blog | https://www.deepspeed.ai/tutorials/zero/ |
| #11 | NVIDIA Mixed-Precision Training docs — FP32 master + BF16 forward/backward diagram | https://docs.nvidia.com/deeplearning/performance/mixed-precision-training/index.html |
| #11 alt | PyTorch AMP docs — amp.GradScaler diagram | https://pytorch.org/docs/stable/amp.html |
| Audit #1 | Karpathy "Let's build GPT" — self-supervised one-sentence-many-pairs frame | https://www.youtube.com/watch?v=kCc8FmEb1nY |
| Audit #2 | Sebastian Raschka, "Build a Large Language Model (From Scratch)" — Chapter 5 training-loop figure | https://github.com/rasbt/LLMs-from-scratch |
| Audit #8 | Rajbhandari et al. 2019 "ZeRO" Figure 1 — memory-consumption breakdown (weights + grads + Adam states) | Paper: https://arxiv.org/abs/1910.02054 — HTML: https://arxiv.org/html/1910.02054 |
| Audit #10 | Chen et al. 2016 "Training Deep Nets with Sublinear Memory Cost" Figure 1 — gradient checkpointing | Paper: https://arxiv.org/abs/1604.06174 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (self-supervised: one sentence → multiple training pairs via causal mask) | **Replace with sourced.** | Karpathy "Let's build GPT" video — exact frame around 30:00 shows this. Or nanoGPT README. https://github.com/karpathy/nanoGPT — *Mermaid kept as fallback.* |
| #2 (training-step pipeline: data → forward → loss → backward → step) | **Replace with sourced.** | Sebastian Raschka, "Build a Large Language Model (From Scratch)" Chapter 5 figures — clean training-loop visuals. https://github.com/rasbt/LLMs-from-scratch — *Mermaid kept as fallback.* |
| #8 (memory blow-up bar chart: weights + grads + Adam m + v = 4×) | **Replace with sourced.** | Microsoft DeepSpeed ZeRO blog / Rajbhandari et al. 2019 Figure 1 (memory consumption breakdown). https://arxiv.org/abs/1910.02054 — *Mermaid kept as fallback.* |
| #10 (gradient checkpointing diagram) | **Replace with sourced.** | Chen et al. 2016 "Training Deep Nets with Sublinear Memory Cost" Figure 1 — the canonical checkpoint figure. https://arxiv.org/abs/1604.06174 — *Mermaid kept as fallback.* |
| #12 (full step end-to-end recap) | **Keep mermaid.** Synthesis figure highlighting which optimisations live where in this post's narrative; no published equivalent. | — |

## Further Reading (links to include in the published post)

**From your study notes**
- "From Tokens to Transformers — Chapters 3–7" (the YouTube playlist you used). https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi
- "How LLM Training Actually Works" — YouTube. https://www.youtube.com/watch?v=EFXiQSxa4d8

**Foundational papers**
- Loshchilov & Hutter 2017, "Decoupled Weight Decay Regularization" (AdamW). https://arxiv.org/abs/1711.05101
- Chen et al. 2016, "Training Deep Nets with Sublinear Memory Cost" (gradient checkpointing). https://arxiv.org/abs/1604.06174
- Tri Dao et al. 2022, "FlashAttention." https://arxiv.org/abs/2205.14135
- Micikevicius et al. 2017, "Mixed Precision Training." https://arxiv.org/abs/1710.03740

**Tutorials & code**
- Karpathy, "Let's build GPT: from scratch, in code, spelled out." https://www.youtube.com/watch?v=kCc8FmEb1nY
- Karpathy, "nanoGPT." https://github.com/karpathy/nanoGPT
- Sebastian Raschka, "Build a Large Language Model (From Scratch)." https://github.com/rasbt/LLMs-from-scratch
- PyTorch Mixed Precision (AMP) docs. https://pytorch.org/docs/stable/amp.html

**Optimizer intuition**
- Sebastian Ruder, "An overview of gradient descent optimization algorithms." https://www.ruder.io/optimizing-gradient-descent/
- Lilian Weng, "Optimization Algorithms for Deep Learning." https://lilianweng.github.io/posts/2020-09-25-train-large/

## Open questions

1. **Backprop derivation:** §4 is set to "two minutes" / one paragraph. Bump to its own short section with a chain-rule example, or keep terse?
2. **AdamW vs Adam:** worth one sentence on decoupled weight decay (the "W"), or skip?
3. **Activations memory image (#9):** any preference between NVIDIA, Megatron, or DeepSpeed sources?
4. **Mixed precision specifics:** stop at "BF16 forward, FP32 master" or also include the loss-scaling story for FP16 (mostly historical now)?
5. **Length:** lots of equations + 12 visuals. Will likely run ~2400 words. OK?
