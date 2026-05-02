# Post 1 — Tokenization, Embeddings & Sampling

**Status:** outline approved — moving to MDX writing.

## Locked answers (from review)

1. **Tokenizer screenshot (#2):** OpenAI tokenizer (https://platform.openai.com/tokenizer). _Action: needs a manual screenshot — see "Asks of the user" below._
2. **Embedding-cluster image (#6):** Jay Alammar's "Illustrated Word2Vec".
3. **Equation toolchain:** add `mathjax-node-cli` as dev-dependency; render LaTeX → SVG offline. Locked for the whole series.
4. **RAG detour (§6):** keep the section, but open with a clear note to readers: this is a brief detour; you don't have to fully grok it on first read — RAG is its own world and we cover it elsewhere.
5. **Length:** target ~1800–2200 words confirmed.

## Asks of the user (small, can do offline)

- Capture a screenshot of https://platform.openai.com/tokenizer with a sample prompt (suggested: `"Tokenization is the first thing an LLM does to your text — even before it's a number."`). Save to `public/images/blog/llm-internals-01-tokenization-embeddings-sampling/openai-tokenizer-screenshot.png`. The MDX will reference this filename. If you'd rather use tiktokenizer.vercel.app instead, save with the same filename and we'll go with that.

**Slug:** `llm-internals-01-tokenization-embeddings-sampling`
**File path:** `src/app/blog/posts/llm-internals-01-tokenization-embeddings-sampling.mdx`
**Image folder:** `public/images/blog/llm-internals-01-tokenization-embeddings-sampling/`

## Source notes mapped

- `~/Documents/AI Theory/Inference/Tokenization & Embeddings` — full file (tokenization, IDs, attention mask, token type ID, embeddings, RAG chunking, subword rationale).
- `~/Documents/AI Theory/Inference/Temperature and Top_P` — full file (temperature math, top-p, ranges).
- One-liners from `~/Documents/AI Theory/Training/Training Topics.txt` (Topic 11): auto-regression definition, zero-vs-few-shot definition.

## Frontmatter draft

```yaml
---
title: "Tokenization, Embeddings & Sampling: How an LLM Sees Your Prompt"
subtitle: "Where prompts begin and where tokens come out — the two ends of the inference pipe"
publishedAt: "2026-05-08"
summary: "Part 1 of The LLM Internals Course. Before we look inside the model, we trace the full path from raw text to tokens to embeddings, and from logits back out to sampled tokens — including why subword tokenization exists, what attention masks really do, and how temperature and top-p actually shape the model's output."
tag: "AI"
series: "llm-internals-course"
part: 1
partTitle: "Tokenization, Embeddings & Sampling"
images: []
team: []
---
```

## Section outline (target ~1800–2200 words; sweet spot 1500–2500, hard cap 3000)

1. **Before you start** — prereq callout. Three or four curated links (Karpathy "Let's build GPT", 3Blue1Brown transformer series, Jay Alammar's Illustrated Transformer, HF LLM course Chapter 2). One short paragraph of mental model: token → embedding → transformer block → logits → next token.
2. **From text to tokens** — tokenization fundamentals. Why we tokenize. Subword tokenization as the dominant strategy.
3. **The three numbers per token** — token ID + attention mask + token-type ID. What each one means and why the model needs them.
4. **Why subword? Vocab size and unknown words** — the two problems subword tokenization solves. The "Awesomeeee" / typo example.
5. **From IDs to embeddings** — first model layer. Lookup table. Why embeddings are dense vectors, not one-hots.
6. **A brief detour: how RAG reuses embeddings** — chunking, vector DB, cosine similarity. Just a paragraph since the rest of this post is about generation, not retrieval — but worth grounding because most readers meet embeddings via RAG first.
7. **Auto-regression: generation is a loop** — short section explaining the next-token-at-a-time pattern. This is the *only* time auto-regression gets a dedicated explanation in the series.
8. **From logits to tokens: sampling** — softmax converts logits to probabilities. Greedy decoding. Why pure greedy is rarely what we want.
9. **Temperature** — what `logit / T` does to the distribution. Recommended ranges from your notes.
10. **Top-p (nucleus sampling)** — cumulative probability cutoff. Recommended ranges from your notes. Brief note on top-k as the older cousin.
11. **Zero-shot vs few-shot — one paragraph** — fold the Topic 11 definitions in here.
12. **Coming up next** — single-paragraph teaser for Post 2 (forward pass, KV cache).

## Images & Equations Plan

> Per the agreed workflow: this table needs your sign-off (and any swaps/additions you want) before MDX is written. Filenames are placeholders until the assets are sourced.

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2 From text to tokens | A — Mermaid | End-to-end pipe: prompt → tokenize → IDs → embeddings → model → logits → sample → next token. The mental map for the whole post. | Authored mermaid `flowchart LR` | to draft |
| 2 | §2 From text to tokens | B — Sourced image | Visual of GPT-4 tokenizer in action on a sentence (color-coded tokens). | OpenAI tokenizer page screenshot (https://platform.openai.com/tokenizer) **or** tiktokenizer.vercel.app screenshot. Caption + link. | needs sourcing |
| 3 | §3 The three numbers per token | A — Mermaid | A small table-style diagram: each token gets [ID, attention_mask, token_type_id]. Side by side for a 2-sentence input. | Authored mermaid (or a styled MDX table — TBD) | to draft |
| 4 | §4 Why subword? | B — Sourced image | Subword splitting example showing "Jumping" → ["Jump", "##ing"] and "Awesomeeee" → ["Awesome", "##e", "##e", "##e"]. | Hugging Face LLM course Chapter 2 figure (https://huggingface.co/learn/llm-course/en/chapter2/4) **or** Jay Alammar's BPE illustration. Caption + link. | needs sourcing |
| 5 | §5 From IDs to embeddings | A — Mermaid | Token ID lookup → embedding matrix row → dense vector. Show shape (V × d_model). | Authored mermaid | to draft |
| 6 | §5 From IDs to embeddings | B — Sourced image | 2D projection (t-SNE / UMAP) of word embeddings showing cluster of related words ("king/queen/man/woman" classic). | Jay Alammar's Illustrated Word2Vec **or** TensorFlow Embedding Projector screenshot. Caption + link. | needs sourcing |
| 7 | §7 Auto-regression | A — Mermaid | The decode loop: input tokens → next-token prediction → append → feed back. | Authored mermaid `flowchart LR` with self-loop | to draft |
| 8 | §8 From logits to tokens | C — Equation | Softmax: `p_i = exp(z_i) / Σ_j exp(z_j)`. Caption: "Softmax converts logits z into a probability distribution p over the vocabulary." | LaTeX → SVG. File: `eq-softmax.svg`. | to render |
| 9 | §9 Temperature | C — Equation | Temperature-adjusted logits + softmax: `p_i = exp(z_i / T) / Σ_j exp(z_j / T)`. Caption: "Dividing logits by temperature T before softmax. T<1 sharpens the distribution; T>1 flattens it." | LaTeX → SVG. File: `eq-temperature.svg`. | to render |
| 10 | §9 Temperature | B — Sourced image | Bar-chart showing how the same logits distribute under T=0.5, T=1.0, T=1.5. | Hugging Face blog "How to generate text" (Patrick von Platen, 2020) — has this figure. Or Lilian Weng's "Controllable Text Generation" post. Caption + link. | needs sourcing |
| 11 | §10 Top-p | C — Equation | Top-p set definition: smallest set V_p such that `Σ_{i ∈ V_p} p_i ≥ p`, sample uniformly within renormalised V_p. | LaTeX → SVG. File: `eq-top-p.svg`. | to render |
| 12 | §10 Top-p | B — Sourced image | Visualization of nucleus sampling: cumulative probability bar showing the cutoff. | Holtzman et al. 2019 "The Curious Case of Neural Text Degeneration" Figure 2 — the canonical top-p figure. Caption + link to the paper. | needs sourcing |

**Image-density check:** 12 visuals across ~10 sections. Heavier visual coverage on the math-heavy sections (sampling/temperature/top-p) and the conceptual flow at the start, lighter on the one-paragraph detours (RAG, zero-vs-few-shot). Matches the "as visual as possible" goal.

### Specific image URL candidates (for B-category rows)

URLs below are best-known candidates. `[verify]` flags ones I'm not 100% sure about — please confirm before downloading.

| Row | Source | URL |
|---|---|---|
| #2 | OpenAI tokenizer (interactive — capture screenshot of a sample sentence) | https://platform.openai.com/tokenizer |
| #2 alt | tiktokenizer (interactive — capture screenshot) | https://tiktokenizer.vercel.app |
| #4 | Hugging Face LLM Course, Chapter 2.4 — subword tokenization figure showing "Awesomeeee"-style splits | https://huggingface.co/learn/llm-course/en/chapter2/4 |
| #6 | Jay Alammar, "Illustrated Word2Vec" — king/queen/man/woman embedding-cluster figure | Page: https://jalammar.github.io/illustrated-word2vec/ — direct image candidate `[verify]`: https://jalammar.github.io/images/word2vec/king-man+woman-table.png |
| #10 | Patrick von Platen, HF blog "How to generate text" — temperature-distribution bar chart | https://huggingface.co/blog/how-to-generate (images embedded on page; search for `temperature` figure) |
| #12 | Holtzman et al. 2019 "The Curious Case of Neural Text Degeneration" Figure 2 — nucleus sampling cumulative-probability cutoff | Paper: https://arxiv.org/abs/1904.09751 — HTML for figure: https://arxiv.org/html/1904.09751 |
| Audit #5 | Jay Alammar, "Illustrated Word2Vec" — embedding-matrix lookup figure | https://jalammar.github.io/illustrated-word2vec/ |
| Audit #7 | Jay Alammar, "How GPT3 Works — Visualizations and Animations" — auto-regression animation | https://jalammar.github.io/how-gpt3-works-visualizations-animations/ |

## Visual Sources Audit (mermaid → sourced candidates)

Per the series-wide "sourced images > mermaid" rule, here's the audit of every mermaid row above and a sourced candidate where one exists. Mermaid stays where the candidate is genuinely missing.

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (full pipeline mermaid) | **Keep mermaid.** This is the post's narrative spine, no canonical figure of this exact framing. | — |
| #3 (token + attention_mask + token_type_id table) | **Keep mermaid.** Small data table, no canonical figure. | — |
| #5 (ID → embedding matrix lookup) | **Replace with sourced.** | Jay Alammar, "The Illustrated Word2Vec" (embedding-matrix lookup illustration). https://jalammar.github.io/illustrated-word2vec/ — *Mermaid kept as fallback.* |
| #7 (auto-regression loop) | **Replace with sourced.** | Jay Alammar, "How GPT3 Works — Visualizations and Animations" (auto-regression loop animation). https://jalammar.github.io/how-gpt3-works-visualizations-animations/ — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

Curated list to render at the bottom of the post as the "Sources & Further Reading" section. Mix of links from your study notes and canonical references readers can deep-dive into.

**From your study notes**
- Hugging Face LLM Course, Chapter 2 — Tokenization. https://huggingface.co/learn/llm-course/en/chapter2/4

**Prerequisite primer (linked from §1)**
- Karpathy, "Let's build GPT: from scratch, in code, spelled out." https://www.youtube.com/watch?v=kCc8FmEb1nY
- Karpathy, "Let's build the GPT Tokenizer." https://www.youtube.com/watch?v=zduSFxRajkE
- 3Blue1Brown, "But what is a GPT? — Visual intro to transformers." https://www.youtube.com/watch?v=wjZofJX0v4M
- Jay Alammar, "The Illustrated Transformer." https://jalammar.github.io/illustrated-transformer/

**Tokenization & embeddings**
- OpenAI Tokenizer playground. https://platform.openai.com/tokenizer
- tiktokenizer.vercel.app — third-party, multi-model tokenizer playground.
- Jay Alammar, "The Illustrated Word2Vec." https://jalammar.github.io/illustrated-word2vec/

**Sampling, temperature, top-p**
- Holtzman et al. 2019, "The Curious Case of Neural Text Degeneration" (the top-p / nucleus sampling paper). https://arxiv.org/abs/1904.09751
- Patrick von Platen, HuggingFace blog, "How to generate text: using different decoding methods." https://huggingface.co/blog/how-to-generate
- Lilian Weng, "Controllable Neural Text Generation." https://lilianweng.github.io/posts/2021-01-02-controllable-text-generation/

## Open questions / asks

1. **The two GPT/HF tokenizer screenshots (#2):** any preference between the OpenAI tokenizer page and tiktokenizer.vercel.app? The latter is cleaner but third-party.
2. **Embedding-projection image (#6):** do you have a favorite from your own learning sources, or should I default to Jay Alammar's "Illustrated Word2Vec"? (You linked HF Chapter 2 in your notes — that has a related figure, may also work.)
3. **Equation rendering toolchain:** I'd like to render LaTeX to SVG via a one-time script using `mathjax-node-cli` (no runtime cost, no MDX plugin). OK to add `mathjax-node-cli` as a dev-dependency for this purpose? Alternative is hand-export from a LaTeX site like Codecogs and check the SVGs in directly.
4. **Section 6 RAG detour:** include or skip? It's a brief paragraph. Argument for keeping: most engineers met embeddings via RAG first, so it grounds the concept. Argument for skipping: the series isn't really about RAG.
5. **Length:** target is ~1800–2200 words. OK with that?

## What happens after your review

1. You either approve the image plan as-is or send back swaps / additions.
2. I source/render the assets, drop them into `public/images/blog/llm-internals-01-.../`, then write the MDX.
3. You review the MDX in `pnpm dev`, request changes, we iterate.
4. Mark Post 1 complete in `specs/genai-blog-series/README.md`, move on to Post 2.
