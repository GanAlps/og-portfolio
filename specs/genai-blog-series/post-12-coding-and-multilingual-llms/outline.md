# Post 12 — Specialised Text LLMs: Coding & Multilingual

**Status:** outline / awaiting review

**Slug:** `llm-internals-12-coding-and-multilingual-llms`
**File path:** `src/app/blog/posts/llm-internals-12-coding-and-multilingual-llms.mdx`
**Image folder:** `public/images/blog/llm-internals-12-coding-and-multilingual-llms/`

## Source notes mapped

- `~/Documents/AI Theory/Multi-Modal/Coding LLMs` — full file (tokenization, vocab design, FIM, long context, repo awareness, RLAIF).
- `~/Documents/AI Theory/Multi-Modal/Multi-Lingual` — full file (vocab expansion, cross-language vector similarity).

## Frontmatter draft

```yaml
---
title: "Specialised Text LLMs: Coding & Multilingual"
subtitle: "Same architecture, different vocab and training signal — the bridge from pure text into multi-modal"
publishedAt: "2026-07-24"
summary: "Part 12 of The LLM Internals Course. Coding LLMs and multilingual LLMs use the same transformer everyone else does — what makes them different is tokenization, training format, and the reward signal. We unpack code-specific vocab, fill-in-the-middle training, repo-level awareness, and RLAIF on unit tests; then a short look at why a single LLM can speak fifty languages without separate per-language models."
tag: "AI"
series: "llm-internals-course"
part: 12
partTitle: "Coding & Multilingual LLMs"
images: []
team: []
---
```

## Section outline (target ~1700–2000 words)

1. **Same engine, different fuel** — framing: code and language variants don't need new architectures, they need different tokenizers, training formats, and reward signals. Bridge from Part 2 (training tricks) to Part 3 (modalities).
2. **Code tokenization is special** — whitespace gets its own tokens (4-space indent ≠ 2 × 2-space indent), keywords (`return`, `def`, `import`) are dedicated tokens, frequent idioms (`return null;`, `import numpy as np`) sometimes collapse to one token. CamelCase / snake_case splitting rules.
3. **Vocabulary tells you what the model sees a lot of** — the giveaway: the most frequent tokens. Code vocabularies look very different from natural-language ones.
4. **Fill-in-the-Middle (FIM): the most important difference** — natural-language LLMs always predict next-token. Code LLMs are usually predicting in the *middle* of a function. Training reorders chunks: `<PRE>...<SUF>...<MID>...`. Inference runs on cursor-position prefix + suffix.
5. **Long context: why code lives at 32K–128K** — single files are big, repos are bigger. RoPE/YaRN (Post 6) shows up here in a real production way.
6. **Repo-level awareness** — training data includes virtual file structure context. The `import { AuthService } from './auth'` pattern.
7. **RLHF/RLAIF on objective rewards** — code has a luxury other domains don't: you can compile and run it. Reward function = compile + unit tests pass + perf metrics. Brief link to Post 11's reasoning RL.
8. **Multilingual: just expand the vocabulary** — modern multilingual LLMs do not need separate models. The token-vocabulary expansion + the fact that meaning lives in vector space (not in the token surface form) means cross-language understanding emerges from training.
9. **Why translation works "for free"** — the model produces an output vector representing intent; the un-embedding picks the closest token in the target language's slice of vocab. Brief.
10. **Tokenizer tradeoffs in multilingual models** — non-Latin scripts often use way more tokens per word; trade vocab size against compression.
11. **Coming up next** — Post 13 (Vision: ViT and Diffusion).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2 Code tokenization | B — Sourced image | Tokenizer comparison: same code snippet split by GPT-4o tokenizer vs Code-Llama tokenizer. Highlights whitespace/keyword differences. | tiktokenizer.vercel.app screenshot OR HF tokenizer comparison. Caption + link. | needs sourcing |
| 2 | §4 FIM training | B — Sourced image | The FIM format figure from the original Bavarian et al. paper. | Bavarian et al. 2022 "Efficient Training of Language Models to Fill in the Middle" Figure 1. Caption + link. | needs sourcing |
| 3 | §4 FIM training | A — Mermaid | Three-step transformation: original code → split into prefix/middle/suffix → reorder as `<PRE> ... <SUF> ... <MID> ...`. | Authored mermaid | to draft |
| 4 | §4 FIM inference | A — Mermaid | At inference: cursor splits buffer → send prefix + suffix → model fills middle. | Authored mermaid | to draft |
| 5 | §6 Repo awareness | A — Mermaid | A multi-file mini-repo with import statements; arrows showing how the LLM virtual-context joins them. | Authored mermaid | to draft |
| 6 | §7 RLAIF on tests | A — Mermaid | Code generation → compile → run unit tests → reward signal → policy update. | Authored mermaid | to draft |
| 7 | §8 Multilingual | B — Sourced image | Cross-language embedding cluster (e.g., "dog" / "perro" / "chien" landing in similar regions). | XLM-R paper Figure 2 OR Multilingual BERT visualizations. Caption + link. | needs sourcing |
| 8 | §10 Tokenizer ratios | B — Sourced image (or table) | Tokens-per-word by language: English ~1.3, Spanish ~1.5, Hindi/Korean/Chinese much higher. | OpenAI tokenizer doc OR Mielke et al. survey. Caption + link. | needs sourcing |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #1 | tiktokenizer.vercel.app — same code snippet under different model tokenizers (capture screenshot) | https://tiktokenizer.vercel.app |
| #2 | Bavarian et al. 2022 "FIM" Figure 1 — PSM and SPM training-data reordering | Paper: https://arxiv.org/abs/2207.14255 — HTML: https://arxiv.org/html/2207.14255 |
| #7 | Conneau et al. 2019 "XLM-R" Figure 2 — cross-lingual representation alignment | Paper: https://arxiv.org/abs/1911.02116 — HTML: https://arxiv.org/html/1911.02116 |
| #7 alt | Pires et al. 2019 "How multilingual is Multilingual BERT?" — cross-lingual embedding clusters | Paper: https://arxiv.org/abs/1906.01502 |
| #8 | OpenAI tokenizer doc / blog — tokens-per-word by language chart | https://platform.openai.com/docs/guides/text-generation |
| #8 alt | Mielke et al. 2021 survey "Between Words and Characters" — per-language token-count comparison | Paper: https://arxiv.org/abs/2112.10508 |
| Audit #3 | Bavarian et al. 2022 Figure 2 (PSM/SPM token reordering) | https://arxiv.org/abs/2207.14255 |
| Audit #6 | Rozière et al. 2023 "Code Llama" — RLAIF reward setup figure | Paper: https://arxiv.org/abs/2308.12950 — HTML: https://arxiv.org/html/2308.12950 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #3 (FIM training transformation) | **Replace with sourced.** Already covered by #2 in image plan. | Bavarian et al. 2022 "FIM" Figure 2 (PSM/SPM token reordering). https://arxiv.org/abs/2207.14255 — *Mermaid kept as fallback.* |
| #4 (FIM at inference: cursor splits buffer → fill middle) | **Keep mermaid.** Small follow-up to #3; no published figure of inference-time FIM. | — |
| #5 (multi-file repo with imports → virtual context) | **Keep mermaid.** Custom illustration; no canonical figure. | — |
| #6 (RLAIF on tests: code → compile → unit tests → reward) | **Replace with sourced.** | Code Llama paper (Rozière et al. 2023) — has the RLAIF reward-setup diagram. https://arxiv.org/abs/2308.12950 — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

**Coding LLMs**
- Bavarian et al. 2022, "Efficient Training of Language Models to Fill in the Middle" (FIM). https://arxiv.org/abs/2207.14255
- Rozière et al. 2023, "Code Llama: Open Foundation Models for Code." https://arxiv.org/abs/2308.12950
- Guo et al. 2024, "DeepSeek-Coder: When the Large Language Model Meets Programming." https://arxiv.org/abs/2401.14196
- Li et al. 2023, "StarCoder: may the source be with you!" https://arxiv.org/abs/2305.06161
- Mistral AI, "Codestral." https://mistral.ai/news/codestral/

**Multilingual LLMs**
- Conneau et al. 2019, "Unsupervised Cross-lingual Representation Learning at Scale" (XLM-R). https://arxiv.org/abs/1911.02116
- Pires et al. 2019, "How multilingual is Multilingual BERT?" https://arxiv.org/abs/1906.01502
- Mielke et al. 2021, "Between words and characters: A Brief History of Open-Vocabulary Modeling and Tokenization in NLP." https://arxiv.org/abs/2112.10508

**Tokenization tools**
- OpenAI tokenizer playground. https://platform.openai.com/tokenizer
- tiktokenizer.vercel.app — multi-model tokenizer comparison.

## Open questions

1. **Coding LLM examples:** any preference for naming specific models (Code Llama, DeepSeek-Coder, Codestral, Cursor's frontier) or stay general?
2. **Section 7 (RLAIF on tests):** worth its own diagram, or fold into the FIM section?
3. **Multilingual depth:** your notes are very brief (~430 bytes). Is the post too multilingual-light? Should I research more, or keep it as a complement to the coding focus?
4. **Tokenizer compression image (#8):** rendering choices — a simple bar chart from a published tokenizer benchmark, or a hand-built table?
5. **Length:** this is on the shorter side (~1800). OK, or do you want me to find more depth for either subtopic?
