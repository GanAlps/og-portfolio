# Post 9 — From Pre-Training to Instruction-Tuned: CPT, FFT, SFT

**Status:** outline / awaiting review

**Slug:** `llm-internals-09-pretraining-to-instruction-tuned`
**File path:** `src/app/blog/posts/llm-internals-09-pretraining-to-instruction-tuned.mdx`
**Image folder:** `public/images/blog/llm-internals-09-pretraining-to-instruction-tuned/`

## Source notes mapped

- `~/Documents/AI Theory/Training/CPT` — full file (continued pre-training; smaller LR, linear warm-up, data mixing).
- `~/Documents/AI Theory/Training/Fine Tuning` — sections 1-2 (FFT and SFT/Instruction Tuning), plus the framing "core differences" intro: labelled data, intent, loss masking.

## Frontmatter draft

```yaml
---
title: "From Pre-Training to Instruction-Tuned: CPT, FFT and SFT"
subtitle: "How a base model that just predicts the next token becomes a model that follows instructions"
publishedAt: "2026-07-03"
summary: "Part 9 of The LLM Internals Course. Pre-training builds knowledge; everything after pre-training shapes behavior. We start with continued pre-training (CPT) for domain specialization, then move into fine-tuning: full fine-tuning (FFT) updates every weight, while supervised fine-tuning (SFT) reshapes prompt-response behavior using loss masking. Three small ideas — but they're the foundation for everything in Posts 10 and 11."
tag: "AI"
series: "llm-internals-course"
part: 9
partTitle: "CPT, FFT, SFT"
images: []
team: []
---
```

## Section outline (target ~1600–2000 words)

1. **What changes after pre-training** — three things: labelled data, intent (shaping behavior, not adding knowledge), and loss masking. Set the frame for all of Part 2's remaining posts.
2. **Continued Pre-Training (CPT)** — why you'd take a base model and feed it medical / legal / finance corpora. Three twists: (a) much smaller learning rate (~10–15% of pre-train), (b) linear LR warm-up, (c) mix in 5–15% original pre-training data to avoid catastrophic forgetting.
3. **Full Fine-Tuning (FFT)** — update every weight, on labelled data. Lower forgetting risk than CPT (smaller datasets) but still real — same mitigations apply, or use LoRA (Post 10).
4. **Supervised Fine-Tuning (SFT) / Instruction Tuning** — the term confusion explained: SFT is the *how* (supervised, prompt-response pairs), instruction tuning is the *why* (teach the model to follow instructions). They map 1:1 in practice.
5. **Loss masking** — the key SFT mechanic. Compute logits for the whole sequence, but only count loss on response tokens. Visual.
6. **The chat template** — `<|user|> ... <|assistant|> ...` style formatting. Why getting this exact during fine-tuning AND inference is critical.
7. **FFT vs SFT: a 2×2 you can memorise** — FFT is "how many params" (100%), SFT is "what data" (prompt-response). You can do SFT with LoRA, or FFT on raw text.
8. **Why SFT is mandatory before alignment** — preview Post 10: without SFT, the model has no good behavior to "align" toward.
9. **Coming up next** — Post 10 (Alignment: RLHF/DPO/PPO/KTO + PEFT: LoRA, QLoRA, prompt/prefix tuning).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 What changes | A — Mermaid | Three-stage timeline: Pre-training → CPT → FFT/SFT → Alignment. Annotate which one adds knowledge vs shapes behavior. | Authored mermaid | to draft |
| 2 | §2 CPT | B — Sourced image | Learning-rate schedule plot: linear warm-up + cosine decay at 10–15% of pre-train peak LR. | Sebastian Raschka's "LLM Training" blog OR HF blog. Caption + link. | needs sourcing |
| 3 | §2 CPT | A — Mermaid | Data-mixing strategy: 85% domain data + 15% original data → CPT corpus. | Authored mermaid | to draft |
| 4 | §3 FFT | A — Mermaid | "All weights updated" visualisation: every layer's parameters get a delta. | Authored mermaid | to draft |
| 5 | §4 SFT | B — Sourced image | Example of an Alpaca-style training row: instruction + input + response, with response highlighted. | Stanford Alpaca blog OR HF datasets viewer screenshot. Caption + link. | needs sourcing |
| 6 | §5 Loss masking | A — Mermaid | Token sequence with mask vector: 0s on prompt tokens, 1s on response tokens. Loss only summed where mask=1. | Authored mermaid | to draft |
| 7 | §5 Loss masking | C — Equation | `L_SFT = -Σ_{t ∈ response} log p_θ(x_t \| x_<t)`. Caption: "We compute logits for everything but only score the assistant's tokens." | LaTeX → SVG. File: `eq-sft-loss.svg`. | to render |
| 8 | §6 Chat template | B — Sourced image | Side-by-side: Llama 3 chat template vs ChatML vs Alpaca. | HF chat-templating docs OR a blog comparing templates. Caption + link. | needs sourcing |
| 9 | §7 FFT vs SFT 2×2 | A — Mermaid (or table) | 2×2: rows = how many params (FFT/PEFT), columns = what data (raw/prompt-response). | Authored mermaid | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #2 | Sebastian Raschka, "LLM Training" article — LR schedule plot (linear warm-up + cosine decay) | https://magazine.sebastianraschka.com/p/the-state-of-llm-training |
| #2 alt | HF blog, "Optimizing your LLM in production" — LR schedule figure | https://huggingface.co/blog/optimize-llm |
| #5 | Stanford Alpaca blog — example training row (instruction + input + response) | https://crfm.stanford.edu/2023/03/13/alpaca.html |
| #5 alt | HF Datasets Viewer screenshot of `tatsu-lab/alpaca` | https://huggingface.co/datasets/tatsu-lab/alpaca/viewer |
| #8 | Hugging Face "Chat Templates" docs — comparison of Llama 3 vs ChatML vs Alpaca formats | https://huggingface.co/docs/transformers/main/chat_templating |
| Audit #6 | HF TRL `SFTTrainer` docs — loss-masking diagram | https://huggingface.co/docs/trl/sft_trainer |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (four-stage timeline Pre-train → CPT → FFT/SFT → Alignment) | **Keep mermaid.** Custom narrative spine for this post and Post 10. | — |
| #3 (CPT data mixing 85/15) | **Keep mermaid.** Specific to your notes' rule of thumb. | — |
| #4 (FFT all-weights-updated visualization) | **Keep mermaid.** Simple conceptual aid. | — |
| #6 (SFT loss masking: prompt mask=0, response mask=1) | **Replace with sourced.** | Hugging Face TRL `SFTTrainer` docs (loss-masking diagram) OR Stanford Alpaca page (training format with response-only loss). https://huggingface.co/docs/trl/sft_trainer — *Mermaid kept as fallback.* |
| #9 (FFT vs SFT 2×2: how-many-params × what-data) | **Keep mermaid.** Custom 2×2 framing this post invents. | — |

## Further Reading (links to include in the published post)

**Continued pre-training**
- Gururangan et al. 2020, "Don't Stop Pretraining: Adapt Language Models to Domains and Tasks." https://arxiv.org/abs/2004.10964
- Sebastian Raschka, "Continued pretraining vs fine-tuning: when to use which." https://magazine.sebastianraschka.com/p/continued-pretraining-vs-fine-tuning

**Supervised / Instruction Fine-Tuning**
- Wei et al. 2021, "Finetuned Language Models are Zero-Shot Learners" (FLAN). https://arxiv.org/abs/2109.01652
- Stanford Alpaca blog, "Alpaca: A Strong, Replicable Instruction-Following Model." https://crfm.stanford.edu/2023/03/13/alpaca.html
- Hugging Face, "Supervised Fine-tuning Trainer (SFT)." https://huggingface.co/docs/trl/sft_trainer
- Hugging Face, "Chat Templates." https://huggingface.co/docs/transformers/main/chat_templating

**Practical guides**
- Sebastian Raschka, "The Practical Guide to Finetuning Open-Source LLMs." https://magazine.sebastianraschka.com/
- Hugging Face TRL library. https://github.com/huggingface/trl

## Open questions

1. **CPT depth:** your notes are short on CPT (~1KB). Should this be one of the smaller sections, or do I research further?
2. **Chat template section:** worth a dedicated section, or fold into §4? It's important practically but not in your notes.
3. **Catastrophic forgetting:** mention by name in §2 and §3, or skip the term and just describe the problem?
4. **Should I mention DPO/RLHF data formats** (preference triples) in this post as a teaser, or save it strictly for Post 10?
5. **Length:** I have us at ~1700 words. Could trim or grow as needed. Anything you want elaborated?
