# Post 8 — Distributed Training: DP, TP, PP, ZeRO/FSDP

**Status:** outline / awaiting review

**Slug:** `llm-internals-08-distributed-training`
**File path:** `src/app/blog/posts/llm-internals-08-distributed-training.mdx`
**Image folder:** `public/images/blog/llm-internals-08-distributed-training/`

## Source notes mapped

- `~/Documents/AI Theory/Training/Parallelism in Training` — full file (DP with all-reduce overlap, PP with 1F1B, TP, 3D parallelism, ZeRO-1/2/3, ZeRO-Offload, FSDP vs DDP).

## Frontmatter draft

```yaml
---
title: "Distributed Training: DP, TP, PP, ZeRO and FSDP"
subtitle: "Why training a frontier model takes thousands of GPUs — and how they cooperate"
publishedAt: "2026-06-26"
summary: "Part 8 of The LLM Internals Course. Inference parallelism (Post 5) was about throughput; training parallelism is about whether the model fits at all. We re-examine DP/PP/TP through a training lens (gradients, all-reduce, pipeline bubbles, NVLink), then go deeper: ZeRO's three sharding stages, FSDP, ZeRO-Offload, and the 3D-parallelism pattern that powers real frontier-model training."
tag: "AI"
series: "llm-internals-course"
part: 8
partTitle: "Distributed Training"
images: []
team: []
---
```

## Section outline (target ~2200–2600 words)

1. **Inference parallelism vs training parallelism** — quick recap from Post 5; flag the training-only twists: gradient sync, optimizer state, activation memory.
2. **Data Parallel (DP/DDP)** — replicate model, split micro-batches. All-reduce of gradients. Gradient/communication overlap (compute layer 1's gradient while layer 80's gradient is already syncing).
3. **Pipeline Parallel (PP)** — split layers, run micro-batches. The 1F1B schedule. Pipeline bubbles. Activation memory pressure → why gradient checkpointing is almost mandatory with PP.
4. **Tensor Parallel (TP)** — split each layer's matrices across GPUs. NVLink required. No idle time, but every layer needs an all-reduce.
5. **3D Parallelism** — combine TP (within node) + PP (across nodes) + DP (across replicas). The 64-GPU walk-through from your notes.
6. **The optimizer-state problem** — recap from Post 7: AdamW carries 2 extra tensors per parameter. With DP, every GPU stores them all. Wasteful.
7. **ZeRO-1: shard optimizer states** — sync m and v at the end of the backward pass.
8. **ZeRO-2: shard gradients too** — free gradient memory mid-backward, on the fly.
9. **ZeRO-3: shard the weights themselves** — fetch-compute-discard. Why it needs higher network bandwidth than ZeRO-2 but lower than TP.
10. **ZeRO-Offload** — push optimizer state to CPU RAM. Slower, but fits bigger models on smaller boxes.
11. **FSDP vs DDP vs DeepSpeed** — Meta's FSDP ≈ ZeRO-3 in PyTorch; DDP is the optimised plain-DP path; DeepSpeed is Microsoft's full ZeRO suite.
12. **What actually ships** — most real training uses ZeRO-1 or ZeRO-2 + PP + TP. ZeRO-3 / FSDP is popular for simplicity.
13. **Coming up next** — Post 9 (continuous pre-training, full fine-tuning, supervised fine-tuning).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2 DDP | B — Sourced image | All-reduce ring across N GPUs; gradient sync overlapping with backward pass. | NVIDIA NCCL docs OR PyTorch DDP tutorial figure. Caption + link. | needs sourcing |
| 2 | §3 PP | B — Sourced image | 1F1B schedule timeline (the canonical PipeDream/Megatron figure). | Megatron-LM "Efficient Large-Scale Language Model Training" Figure 4 OR PipeDream paper Figure 4. Caption + link. | needs sourcing |
| 3 | §3 PP | A — Mermaid | Bubble visualisation: vanilla pipeline (large bubble) vs 1F1B (small bubble). | Authored mermaid Gantt | to draft |
| 4 | §4 TP | B — Sourced image | Megatron's TP figure showing column-parallel + row-parallel for an MLP. | Shoeybi et al. 2019 "Megatron-LM" Figure 3 OR HF "Model Parallelism" guide. Caption + link. | needs sourcing |
| 5 | §5 3D parallelism | B — Sourced image | The DeepSpeed 3D parallelism cube: TP × PP × DP. | DeepSpeed blog "Mixture of Experts and 3D parallelism" OR Megatron+DeepSpeed combined figure. Caption + link. | needs sourcing |
| 6 | §6 Memory baseline | A — Mermaid (chart) | Per-GPU memory stack with full DP: weights + gradients + Adam m + v + activations = 16+ bytes per parameter equivalents. | Authored | to draft |
| 7 | §7-§9 ZeRO stages | B — Sourced image | The DeepSpeed ZeRO three-stage figure showing how memory drops from stage 1 to stage 3. | Microsoft DeepSpeed blog "ZeRO: Memory Optimization Towards Training A Trillion Parameter Models" Figure 1. Caption + link. | needs sourcing |
| 8 | §9 ZeRO-3 lifecycle | A — Mermaid | Fetch-Compute-Discard: gather full layer weights → forward → discard. Rinse and repeat each layer. | Authored mermaid | to draft |
| 9 | §10 ZeRO-Offload | A — Mermaid | GPU ↔ CPU data flow: optimizer states live on CPU, weights ship over PCIe. | Authored mermaid | to draft |
| 10 | §11 FSDP/DDP/DeepSpeed | A — Mermaid (table) | Mapping table: ZeRO-1/2/3 ↔ DeepSpeed flag ↔ PyTorch FSDP equivalent. | Authored as styled MDX table | to draft |
| 11 | §12 What ships | C — Equation | Memory budget: `M_total = M_weights/N_zero + M_grads/N_zero + M_optim/N_zero + M_activations/N_PP`. | LaTeX → SVG. File: `eq-memory-budget.svg`. | to render |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #1 | NVIDIA NCCL docs — all-reduce ring across N GPUs | https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html |
| #1 alt | PyTorch DDP tutorial — gradient sync overlap | https://pytorch.org/tutorials/intermediate/ddp_tutorial.html |
| #2 | Narayanan et al. 2021 "Megatron-LM" Figure 4 — 1F1B pipeline schedule | Paper: https://arxiv.org/abs/2104.04473 — HTML: https://arxiv.org/html/2104.04473 |
| #2 alt | Harlap et al. 2018 "PipeDream" Figure 4 | Paper: https://arxiv.org/abs/1806.03377 |
| #4 | Shoeybi et al. 2019 "Megatron-LM" Figure 3 — TP column-parallel + row-parallel | Paper: https://arxiv.org/abs/1909.08053 — HTML: https://arxiv.org/html/1909.08053 |
| #5 | DeepSpeed blog "ZeRO-Infinity / 3D parallelism" — TP × PP × DP cube | https://www.microsoft.com/en-us/research/blog/zero-infinity-and-deepspeed-unlocking-unprecedented-model-scale-for-deep-learning-training/ |
| #5 alt | Smith et al. 2022 "Using DeepSpeed and Megatron to Train Megatron-Turing NLG 530B" Figure | Paper: https://arxiv.org/abs/2201.11990 |
| #7 | Rajbhandari et al. 2019 "ZeRO" Figure 1 — three-stage memory drop | Paper: https://arxiv.org/abs/1910.02054 — HTML: https://arxiv.org/html/1910.02054 |
| Audit #3 | Harlap et al. 2018 "PipeDream" Figure 4 — vanilla vs 1F1B bubble comparison | https://arxiv.org/abs/1806.03377 |
| Audit #6 | Rajbhandari et al. 2019 "ZeRO" Figure 1 (same as #7) | https://arxiv.org/abs/1910.02054 |
| Audit #8 | Microsoft DeepSpeed blog post on ZeRO-3 | https://www.deepspeed.ai/2021/03/07/zero3-offload.html |
| Audit #9 | Ren et al. 2021 "ZeRO-Offload" Figure 3 — GPU↔CPU offload architecture | Paper: https://arxiv.org/abs/2101.06840 — HTML: https://arxiv.org/html/2101.06840 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #3 (PP bubble: vanilla vs 1F1B comparison) | **Replace with sourced.** Already covered by #2 in image plan. | Harlap et al. 2018 "PipeDream" Figure 4 (1F1B vs vanilla schedule). https://arxiv.org/abs/1806.03377 — *Mermaid kept as fallback.* |
| #6 (per-GPU memory baseline: weights + grads + Adam states + activations) | **Replace with sourced.** | Rajbhandari et al. 2019 "ZeRO" Figure 1 — exact memory breakdown. https://arxiv.org/abs/1910.02054 — *Mermaid kept as fallback.* |
| #8 (ZeRO-3 fetch-compute-discard lifecycle) | **Replace with sourced.** | Microsoft DeepSpeed blog "ZeRO-3 explained" or Rajbhandari et al. 2019 Figure 2 (parameter partitioning). https://arxiv.org/abs/1910.02054 — *Mermaid kept as fallback.* |
| #9 (ZeRO-Offload GPU↔CPU data flow) | **Replace with sourced.** | Ren et al. 2021 "ZeRO-Offload" Figure 3 — GPU-CPU offload architecture. https://arxiv.org/abs/2101.06840 — *Mermaid kept as fallback.* |
| #10 (FSDP/DDP/DeepSpeed mapping table) | **Use styled MDX `Table` component.** Cleaner than mermaid for tabular comparison. | — |

## Further Reading (links to include in the published post)

**Foundational papers**
- Rajbhandari et al. 2019, "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models." https://arxiv.org/abs/1910.02054
- Shoeybi et al. 2019, "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism." https://arxiv.org/abs/1909.08053
- Narayanan et al. 2021, "Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM." https://arxiv.org/abs/2104.04473
- Huang et al. 2018, "GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism." https://arxiv.org/abs/1811.06965
- Harlap et al. 2018, "PipeDream: Fast and Efficient Pipeline Parallel DNN Training" (1F1B scheduling). https://arxiv.org/abs/1806.03377

**Implementations & docs**
- DeepSpeed (Microsoft). https://www.deepspeed.ai/
- PyTorch FSDP tutorial. https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html
- PyTorch DDP tutorial. https://pytorch.org/tutorials/intermediate/ddp_tutorial.html
- NVIDIA NCCL docs (collective communication primitives). https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/

**Explainer / visual content**
- Hugging Face, "Performance and Scalability." https://huggingface.co/docs/transformers/main/perf_train_gpu_many
- Microsoft DeepSpeed blog, "ZeRO-Infinity and DeepSpeed: Unlocking Unprecedented Model Scale." https://www.microsoft.com/en-us/research/blog/zero-infinity-and-deepspeed-unlocking-unprecedented-model-scale-for-deep-learning-training/
- Sebastian Raschka, "Understanding Distributed Training." https://magazine.sebastianraschka.com/

## Open questions

1. **Reuse from Post 5:** parallelism is covered in inference Post 5 too. Should I write Post 8 assuming the reader has Post 5 fresh, or recap each strategy fully? My lean: brief recap, focus on training-specific differences.
2. **All-reduce algorithm depth:** worth a short box on ring vs tree all-reduce, or skip?
3. **ZeRO++ / FSDP2:** newer variants. Include or stick with ZeRO-1/2/3?
4. **DeepSeek-V3 / DeepSeek-R1 training stack:** worth name-dropping as a real-world reference (they used MoE + ZeRO-like techniques publicly), or out of scope?
5. **Length:** lots of figures from external sources. Comfortable around 2400–2600 words?
