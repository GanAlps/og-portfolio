# Post 10 — Alignment & Parameter-Efficient Fine-Tuning

**Status:** outline / awaiting review

**Slug:** `llm-internals-10-alignment-and-peft`
**File path:** `src/app/blog/posts/llm-internals-10-alignment-and-peft.mdx`
**Image folder:** `public/images/blog/llm-internals-10-alignment-and-peft/`

## Source notes mapped

- `~/Documents/AI Theory/Training/Fine Tuning` — sections 3 (Alignment Tuning: RLHF, DPO, KTO) and 4 (Optimizations: LoRA, QLoRA, Prompt/Prefix Tuning).

## Frontmatter draft

```yaml
---
title: "Alignment & Parameter-Efficient Fine-Tuning"
subtitle: "Teaching a model what 'good' means — and doing it without paying to train every weight"
publishedAt: "2026-07-10"
summary: "Part 10 of The LLM Internals Course. After SFT (Post 9), the model knows how to respond — but not necessarily how to respond *well*. This post is the densest one in Part 2: the full alignment progression from RLHF+PPO through DPO and KTO, then the PEFT family — LoRA, QLoRA, and prompt/prefix tuning — that makes all of it tractable on real hardware."
tag: "AI"
series: "llm-internals-course"
part: 10
partTitle: "Alignment & PEFT"
images: []
team: []
---
```

## Section outline (target ~2400–2800 words; densest training post)

1. **From SFT to alignment: the goal** — SFT teaches one good response per prompt. Alignment teaches preference: increase the probability of *better* responses, decrease the probability of *worse* ones. New mathematical machinery required.
2. **The mechanical differences from SFT** — (a) loss is over full responses, not per token; (b) loss function changes (Bradley-Terry / preference); (c) the model often doesn't generate during training — it just scores candidate responses. Plus the reference-model guardrail to prevent the model from "hacking" the loss by forgetting language.
3. **Original RLHF + PPO** — three steps: SFT → reward model → PPO. The reward model and the value model. Why this is slow and complex.
4. **DPO: the modern gold standard** — skip the reward model. Pre-labeled (winner, loser) pairs. The Bradley-Terry preference loss.
5. **KTO: when you can't get pairs** — single-response good/bad labels. Running average as the implicit reference. Use case: when human labelers can rate but not compare.
6. **The reference-model trick with LoRA** — when training with LoRA, the un-adapted base model *is* the reference model. Half the memory.
7. **PEFT: why update fewer parameters** — the framing: training-cost / catastrophic-forgetting / many-adapters-one-base story.
8. **LoRA: the rank-decomposition trick** — `ΔW = A · B` where A is `d × r` and B is `r × d`, `r ≪ d`. Why initialise A with random and B with zero.
9. **Where LoRA goes** — applied to all linear layers (attention Q/K/V, output projection, FFN up/down). Not on embeddings or activations.
10. **QLoRA: 4-bit base + 16-bit adapters** — NF4 quantization for the frozen base. Why "Normal Float 4" works (weights are zero-centred). Memory wins.
11. **Prompt and prefix tuning** — train a small set of prefix vectors instead of any weights. Prompt: prefix at input. Prefix: prefix at every layer. Why LoRA generally won.
12. **Coming up next** — Post 11 (Reasoning: Chain of Thought, STaR, RFT, GRPO, PRM/ORM, distillation).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 SFT → alignment | A — Mermaid | Two-panel: SFT (prompt → response, single example) vs alignment (prompt → response_winner / response_loser, comparative). | Authored mermaid | to draft |
| 2 | §3 RLHF + PPO | B — Sourced image | The famous 3-step InstructGPT figure. | Ouyang et al. 2022 "InstructGPT" Figure 2. Caption + link. | needs sourcing |
| 3 | §3 RLHF + PPO | A — Mermaid | RLHF data flow: SFT model → generate → reward model scores → PPO updates policy with reference-model KL penalty. | Authored mermaid | to draft |
| 4 | §3 RLHF + PPO | C — Equation | PPO clipped objective (sketched, not full): `L_PPO = E[min(r_t · Â_t, clip(r_t, 1±ε) · Â_t)] - β · KL(π_θ \|\| π_ref)`. | LaTeX → SVG. File: `eq-ppo.svg`. | to render |
| 5 | §4 DPO | C — Equation | Bradley-Terry preference probability: `P(y_w > y_l \| x) = σ(r(x, y_w) - r(x, y_l))`. | LaTeX → SVG. File: `eq-bradley-terry.svg`. | to render |
| 6 | §4 DPO | C — Equation | DPO loss: `L_DPO = -E[log σ(β · log(π_θ(y_w\|x) / π_ref(y_w\|x)) - β · log(π_θ(y_l\|x) / π_ref(y_l\|x)))]`. | LaTeX → SVG. File: `eq-dpo.svg`. | to render |
| 7 | §4 DPO | B — Sourced image | DPO paper diagram showing offline optimization without a reward model. | Rafailov et al. 2023 "Direct Preference Optimization" Figure 1. Caption + link. | needs sourcing |
| 8 | §5 KTO | C — Equation | KTO loss formulation: per-example "prospect"-style binary signal vs the running reference baseline. | LaTeX → SVG. File: `eq-kto.svg`. | to render |
| 9 | §8 LoRA | B — Sourced image | The canonical LoRA decomposition figure. | Hu et al. 2021 "LoRA" Figure 1. Caption + link. | needs sourcing |
| 10 | §8 LoRA | C — Equation | `W' = W + ΔW = W + A · B`, with A initialized randomly and B initialized to zero. Note dim shapes `d×r` and `r×d`. | LaTeX → SVG. File: `eq-lora.svg`. | to render |
| 11 | §10 QLoRA | B — Sourced image | QLoRA paper figure showing 4-bit NF4 base + 16-bit BF16 adapters + paged optimizers. | Dettmers et al. 2023 "QLoRA" Figure 1. Caption + link. | needs sourcing |
| 12 | §11 Prompt/Prefix tuning | B — Sourced image | Side-by-side from Lester et al. 2021 "The Power of Scale for Parameter-Efficient Prompt Tuning" or Li & Liang 2021 "Prefix-Tuning" Figure 1. | Caption + link. | needs sourcing |
| 13 | §11 Prompt vs Prefix | A — Mermaid | Two diagrams: prompt tuning (prefix vectors at input only) vs prefix tuning (at every layer). | Authored mermaid | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #2 | Ouyang et al. 2022 "InstructGPT" Figure 2 — three-step RLHF | Paper: https://arxiv.org/abs/2203.02155 — HTML: https://arxiv.org/html/2203.02155 |
| #2 alt | OpenAI blog post on InstructGPT — same three-step figure | https://openai.com/index/instruction-following/ |
| #7 | Rafailov et al. 2023 "DPO" Figure 1 — offline preference optimization without reward model | Paper: https://arxiv.org/abs/2305.18290 — HTML: https://arxiv.org/html/2305.18290 |
| #9 | Hu et al. 2021 "LoRA" Figure 1 — A·B rank decomposition | Paper: https://arxiv.org/abs/2106.09685 — HTML: https://arxiv.org/html/2106.09685 |
| #11 | Dettmers et al. 2023 "QLoRA" Figure 1 — 4-bit NF4 base + 16-bit BF16 adapters + paged optimizers | Paper: https://arxiv.org/abs/2305.14314 — HTML: https://arxiv.org/html/2305.14314 |
| #12 | Lester et al. 2021 "The Power of Scale for Parameter-Efficient Prompt Tuning" Figure 1 — prompt tuning at input only | Paper: https://arxiv.org/abs/2104.08691 — HTML: https://arxiv.org/html/2104.08691 |
| #12 alt | Li & Liang 2021 "Prefix-Tuning" Figure 1 — prefix at every layer | Paper: https://arxiv.org/abs/2101.00190 — HTML: https://arxiv.org/html/2101.00190 |
| Audit #3 | HF blog, "Illustrating Reinforcement Learning from Human Feedback (RLHF)" — full RLHF data flow | https://huggingface.co/blog/rlhf |
| Audit #13 | Lester 2021 + Li & Liang 2021 figures (same as #12) | https://arxiv.org/abs/2104.08691 + https://arxiv.org/abs/2101.00190 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (SFT vs alignment two-panel) | **Keep mermaid.** Custom comparison for this post; no published equivalent. | — |
| #3 (RLHF data flow: SFT → reward model → PPO with KL penalty) | **Replace with sourced.** | Hugging Face blog, "Illustrating RLHF" (the canonical RLHF data-flow figure). https://huggingface.co/blog/rlhf — *Mermaid kept as fallback.* |
| #13 (prompt vs prefix tuning side-by-side) | **Replace with sourced.** Already covered by #12 in image plan. | Lester et al. 2021 "Power of Scale for Parameter-Efficient Prompt Tuning" Figure 1 + Li & Liang 2021 "Prefix-Tuning" Figure 1 (side-by-side from both papers). https://arxiv.org/abs/2104.08691 https://arxiv.org/abs/2101.00190 — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

**Alignment foundations**
- Ouyang et al. 2022, "Training language models to follow instructions with human feedback" (InstructGPT). https://arxiv.org/abs/2203.02155
- Schulman et al. 2017, "Proximal Policy Optimization Algorithms" (PPO). https://arxiv.org/abs/1707.06347
- Christiano et al. 2017, "Deep Reinforcement Learning from Human Preferences." https://arxiv.org/abs/1706.03741

**DPO and friends**
- Rafailov et al. 2023, "Direct Preference Optimization: Your Language Model is Secretly a Reward Model." https://arxiv.org/abs/2305.18290
- Ethayarajh et al. 2024, "KTO: Model Alignment as Prospect Theoretic Optimization." https://arxiv.org/abs/2402.01306
- Hugging Face TRL: DPO trainer docs. https://huggingface.co/docs/trl/dpo_trainer

**PEFT family**
- Hu et al. 2021, "LoRA: Low-Rank Adaptation of Large Language Models." https://arxiv.org/abs/2106.09685
- Dettmers et al. 2023, "QLoRA: Efficient Finetuning of Quantized LLMs." https://arxiv.org/abs/2305.14314
- Lester et al. 2021, "The Power of Scale for Parameter-Efficient Prompt Tuning." https://arxiv.org/abs/2104.08691
- Li & Liang 2021, "Prefix-Tuning: Optimizing Continuous Prompts for Generation." https://arxiv.org/abs/2101.00190
- Hugging Face PEFT library. https://huggingface.co/docs/peft

**Visual explainers**
- Hugging Face blog, "Illustrating Reinforcement Learning from Human Feedback (RLHF)." https://huggingface.co/blog/rlhf
- Sebastian Raschka, "LoRA From Scratch." https://magazine.sebastianraschka.com/p/lora-and-dora-from-scratch
- Lilian Weng, "From Reward Hacking to Specification Gaming." https://lilianweng.github.io/posts/2024-11-28-reward-hacking/

## Open questions

1. **PPO equation depth:** your notes only mention PPO at a high level (reward + value model). The full PPO clipped objective is intimidating; do you want a hand-wave version with the KL penalty highlighted, or the full thing?
2. **GRPO mention here:** GRPO is reasoning-specific (Post 11) but is also a PPO variant. Brief mention here ("we'll see GRPO in Post 11") or save entirely?
3. **Constitutional AI / RLAIF:** notable variants. Brief mention or out of scope? (Your notes don't cover them; lean toward skipping.)
4. **LoRA rank choice:** typical r values (4, 8, 16, 64). Add a one-line rule of thumb, or skip?
5. **Length:** this is the densest training post — many equations, many techniques. Comfortable up to ~2800?
