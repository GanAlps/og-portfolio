# Post 2 — Inside the Transformer at Inference Time

**Status:** Post 2 v2 — answers locked from review.

## Locked answers (from review)

1. **Math density:** reduce by one. Drop the FFN equation (`eq-ffn`); the prose carries it. Keep attention, multi-head, residual = 3 equations total.
2. **Vaswani Figure 2 vs. cleaner redrawn:** use Jay Alammar's `transformer_attention_heads_qkv.png` redrawn version instead of the Vaswani paper figure.
3. **Pre-norm vs post-norm:** include the callout (already present in §7 as a blockquote).
4. **Causal masking section §5:** keep.
5. **Positional encoding teaser §10:** keep the one-line forward reference to Post 6.

Specific edits:
- Replace `ja-embeddings.png` (non-English example tokens, weak conceptual fit) with an authored mermaid showing token → ID → matrix row → dense vector.
- Remove `eq-ffn.svg` reference; explanation lives in prose.
- Swap `vaswani-multihead-fig2.png` for `ja-multi-head-qkv.png`.

## Locked answers (defaults applied — flag any to revise)

1. **Math density:** 4 equations as planned (scaled-dot-product attention, multi-head concat, FFN forward, residual + LayerNorm). No explicit softmax restatement — readers carry that from Post 1.
2. **Vaswani Figure 2:** original paper figure preferred (most authoritative).
3. **Pre-norm vs post-norm:** brief callout in §7 — modern LLMs use pre-norm; the equation in the post represents post-norm but the conceptual story is identical.
4. **Causal masking (§5):** keep, dedicated short section.
5. **Positional encoding (§10):** one-line forward reference to Post 6.

**Slug:** `llm-internals-02-inside-the-transformer-at-inference-time`
**File path:** `src/app/blog/posts/llm-internals-02-inside-the-transformer-at-inference-time.mdx`
**Image folder:** `public/images/blog/llm-internals-02-inside-the-transformer-at-inference-time/`

## Source notes mapped

- `~/Documents/AI Theory/Inference/Forward Pass` — full file (embedding, attention Q/K/V math, FFN up/down projection, residuals, un-embedding to logits).
- `~/Documents/AI Theory/Inference/Layers of LLM` — full file (parameter split ~30/60/10, FFN as "the brain", residual + add-and-norm).
- `~/Documents/AI Theory/Inference/K-V Cache` — full file (prefill vs decode, KV is history not dictionary, layer-depth parallelism).

## Frontmatter draft

```yaml
---
title: "Inside the Transformer at Inference Time"
subtitle: "What actually happens between the prompt and the next token — attention, FFN, and the KV cache that makes it all tractable"
publishedAt: "2026-05-15"
summary: "Part 2 of The LLM Internals Course. We open the transformer block and trace one forward pass: how Q, K, V are computed, how attention scores aggregate context, why the FFN is where the model 'thinks', and why the KV cache is a history of position-encoded vectors rather than a dictionary."
tag: "AI"
series: "llm-internals-course"
part: 2
partTitle: "Inside the Transformer"
images: []
team: []
---
```

## Section outline (target ~2200–2600 words; this is the load-bearing post)

1. **Where parameters live** — the ~30 / 60 / 10 split (attention / FFN / embeddings). One paragraph framing why this matters: optimisations target the biggest pile of parameters, and that's the FFN.
2. **The lookup: embedding layer** — token ID → row of the embedding matrix → context-free vector.
3. **Attention: Q, K, V demystified** — the "fluffy blue creature" example from your notes. Q as the question, K as the label, V as the payload. Concrete dimensions (e.g., 12K → 128 per head).
4. **The attention math** — Q·Kᵀ, softmax, weighted V. Why softmax. Multi-head as parallel context lenses.
5. **Causal masking** — one short section: why decoders mask future tokens, what `-∞` does to softmax.
6. **FFN: where the model actually thinks** — up-projection → non-linearity (ReLU/GeLU) → down-projection. Why FFN is per-token (no cross-token interaction). Why the FFN is so wide.
7. **Residuals and Add-and-Norm** — the "delta" framing from your notes: each layer outputs a delta added back to the input. Why this preserves gradient flow.
8. **From last block to logits** — final norm, un-embedding matrix, softmax, next token. Closes the loop with Post 1.
9. **The KV cache: history, not dictionary** — prefill computes Q/K/V for all prompt tokens, caches K and V. Decode computes one new Q, attends to all cached K/V. Why we don't cache Q.
10. **Why KV isn't reusable across positions** — positional encoding is baked in, so the same word at position 5 vs. 500 has different K/V. This sets up Posts 4 and 6 (KV opts and RoPE).
11. **Coming up next** — Post 3 (Serving LLMs in Production: vLLM, batching, streaming).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 Where parameters live | A — Mermaid (or styled chart) | Pie/bar chart of parameter split: 30% attention, 60% FFN, 10% embeddings. | Authored mermaid pie chart | to draft |
| 2 | §2 Embedding lookup | A — Mermaid | Token ID → embedding matrix row → vector. Shape annotated. | Authored mermaid | to draft |
| 3 | §3 Attention Q/K/V | B — Sourced image | The "fluffy blue creature" / "the animal didn't cross the street because it was tired" attention visualization. | Jay Alammar's Illustrated Transformer ("Self-Attention in Detail" figure). Caption + link. | needs sourcing |
| 4 | §4 Attention math | C — Equation | `Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V`. Caption explains scaling and softmax. | LaTeX → SVG. File: `eq-attention.svg`. | to render |
| 5 | §4 Multi-head | C — Equation | `MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W^O`. | LaTeX → SVG. File: `eq-multihead.svg`. | to render |
| 6 | §4 Multi-head | B — Sourced image | Multi-head attention figure from "Attention Is All You Need" (Vaswani et al. 2017, Figure 2). | arXiv 1706.03762, Figure 2. Caption + link. | needs sourcing |
| 7 | §5 Causal masking | A — Mermaid | 4×4 attention matrix grid with future positions greyed out (i.e., set to `-∞` before softmax). | Authored mermaid table | to draft |
| 8 | §6 FFN | A — Mermaid | Input vector (12K) → up-projection (48K) → ReLU/GeLU → down-projection (12K) → residual add. | Authored mermaid | to draft |
| 9 | §7 Residuals | A — Mermaid | Side-by-side: with vs. without residual; arrow showing input added back to output. Brief gradient-flow caption. | Authored mermaid | to draft |
| 10 | §7 Residuals | C — Equation | `y = LayerNorm(x + SubLayer(x))`. Caption: pre-norm vs. post-norm note. | LaTeX → SVG. File: `eq-residual.svg`. | to render |
| 11 | §8 Logits | A — Mermaid | Final hidden state → un-embed → vocab-size logits → softmax → token. (Reuse pipe from Post 1 for continuity.) | Authored mermaid | to draft |
| 12 | §9 KV cache lifecycle | A — Mermaid | Two-frame diagram: (a) prefill — K/V written to cache for all prompt tokens; (b) decode — new Q reads against cache. | Authored mermaid | to draft |
| 13 | §9 KV cache lifecycle | B — Sourced image | KV cache visualization. | HuggingFace blog "KV caching explained" or vLLM blog illustrations. Caption + link. | needs sourcing |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #3 | Jay Alammar, "The Illustrated Transformer" — self-attention visualization (the "the animal didn't cross the street because it was too tired" image) | Page: https://jalammar.github.io/illustrated-transformer/ — direct image `[verify]`: https://jalammar.github.io/images/t/transformer_self-attention_visualization.png |
| #6 | Vaswani et al. 2017 "Attention Is All You Need" Figure 2 (Multi-Head Attention) | Paper: https://arxiv.org/abs/1706.03762 — HTML for figure: https://arxiv.org/html/1706.03762v7 |
| #13 | Hugging Face blog, "KV Caching Explained" — KV cache lifecycle figure | https://huggingface.co/blog/not-lain/kv-caching |
| Audit #2 | Jay Alammar, "Illustrated Transformer" — embedding lookup section | https://jalammar.github.io/illustrated-transformer/ |
| Audit #7 | Karpathy `nanoGPT` causal mask — `tril` mask in `model.py` OR "Let's build GPT" video screenshot at ~50:00 | Repo: https://github.com/karpathy/nanoGPT/blob/master/model.py — Video: https://www.youtube.com/watch?v=kCc8FmEb1nY |
| Audit #8 | Jay Alammar, "Illustrated Transformer" — Feed-Forward sub-layer figure | https://jalammar.github.io/illustrated-transformer/ |
| Audit #9 | He et al. 2015 "Deep Residual Learning" Figure 2 — canonical residual block | Paper: https://arxiv.org/abs/1512.03385 — HTML: https://arxiv.org/html/1512.03385 |
| Audit #11 | Jay Alammar, "Illustrated Transformer" — final linear + softmax section | https://jalammar.github.io/illustrated-transformer/ |
| Audit #12 | Hugging Face blog, "KV Caching Explained" | https://huggingface.co/blog/not-lain/kv-caching |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (parameter pie 30/60/10) | **Keep mermaid.** No widely-cited figure with these exact ratios; numbers vary by model. | — |
| #2 (token ID → embedding matrix row) | **Replace with sourced.** | Jay Alammar, "The Illustrated Transformer" (embedding-lookup section). https://jalammar.github.io/illustrated-transformer/ — *Mermaid kept as fallback.* |
| #7 (causal mask grid) | **Replace with sourced.** | Karpathy nanoGPT README OR a 3Blue1Brown attention-video screenshot showing the lower-triangular mask. https://github.com/karpathy/nanoGPT — *Mermaid kept as fallback.* |
| #8 (FFN up/down projection) | **Replace with sourced.** | Jay Alammar, "The Illustrated Transformer" (FFN sub-layer figure). https://jalammar.github.io/illustrated-transformer/ — *Mermaid kept as fallback.* |
| #9 (residual side-by-side) | **Replace with sourced.** | He et al. 2015 "Deep Residual Learning" Figure 2 (the canonical residual block). https://arxiv.org/abs/1512.03385 — *Mermaid kept as fallback.* |
| #11 (final un-embed → softmax → token) | **Replace with sourced.** | Jay Alammar, "The Illustrated Transformer" (decoder output / softmax figure). https://jalammar.github.io/illustrated-transformer/ — *Mermaid kept as fallback.* |
| #12 (KV cache lifecycle two-frame) | **Replace with sourced.** | Hugging Face, "KV Caching Explained" — has two-frame prefill vs decode visualization. https://huggingface.co/blog/not-lain/kv-caching — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

**From your study notes**
- 3Blue1Brown, "Attention in transformers, step-by-step." https://www.youtube.com/watch?v=eMlx5fFNoYc
- 3Blue1Brown, "How might LLMs store facts (MLP layer)." https://www.youtube.com/watch?v=9-Jl0dxWQs8
- "How does the KV Cache work?" — YouTube. https://www.youtube.com/watch?v=9tvJ_GYJA-o

**Foundational paper**
- Vaswani et al. 2017, "Attention Is All You Need." https://arxiv.org/abs/1706.03762

**Visual explainers**
- Jay Alammar, "The Illustrated Transformer." https://jalammar.github.io/illustrated-transformer/
- Lilian Weng, "Attention? Attention!" https://lilianweng.github.io/posts/2018-06-24-attention/
- Karpathy, "Let's build GPT: from scratch, in code, spelled out." https://www.youtube.com/watch?v=kCc8FmEb1nY

**KV cache deep dives**
- Hugging Face, "KV Caching Explained." https://huggingface.co/blog/not-lain/kv-caching
- Aleksa Gordić, "From Attention to Modern Inference (vLLM internals)." https://www.aleksagordic.com/blog/vllm

## Open questions

1. **Math density:** I've planned 4 equation images (attention, multi-head, residual, plus implicit softmax from Post 1). Want more (e.g., explicit softmax restated, FFN as `f(x) = W_2 · σ(W_1 · x)`)? Or fewer?
2. **Vaswani Figure 2 vs. own redraw:** the original is small/cluttered. Do you prefer the original paper figure or a cleaner redrawn version (Lilian Weng / Yannic Kilcher)?
3. **Pre-norm vs post-norm aside:** worth a callout in §7, or skip? Most modern LLMs use pre-norm.
4. **Section 5 (causal masking)** — your notes mention this only briefly under prefill. OK to give it its own short section here for clarity?
5. **Positional encoding teaser in §10** — should I plant a one-liner that "positional info is added to embeddings before attention; we'll cover RoPE in Post 6", or just briefly state the fact?
