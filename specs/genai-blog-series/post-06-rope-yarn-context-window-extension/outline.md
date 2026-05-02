# Post 6 — Going Longer: RoPE, YaRN & Context-Window Extension

**Status:** outline / awaiting review

**Slug:** `llm-internals-06-rope-yarn-context-window-extension`
**File path:** `src/app/blog/posts/llm-internals-06-rope-yarn-context-window-extension.mdx`
**Image folder:** `public/images/blog/llm-internals-06-rope-yarn-context-window-extension/`

## Source notes mapped

- `~/Documents/AI Theory/Inference/Context window extension(RoPE & YaRN)` — full file (sinusoidal encoding, RoPE rotation, YaRN ramp).

## Frontmatter draft

```yaml
---
title: "Going Longer: RoPE, YaRN & Context-Window Extension"
subtitle: "How modern LLMs got to 128K-token windows without going insane"
publishedAt: "2026-06-12"
summary: "Part 6 of The LLM Internals Course. A short, focused post on positional encoding. We start with the original sinusoidal scheme, see why absolute positions break at long context, then unpack RoPE's rotation trick (relative positions for free) and YaRN's ramp (stretch the long-frequency dimensions while preserving local detail). The math is dense; the visuals carry it."
tag: "AI"
series: "llm-internals-course"
part: 6
partTitle: "RoPE & Context Extension"
images: []
team: []
---
```

## Section outline (target ~1500–1900 words; deliberately shorter, equation-heavy)

1. **Why position matters** — recap from Post 2: attention is inherently order-blind; we have to inject position info somewhere.
2. **The original trick: sinusoidal positional encoding** — sin/cos at varying frequencies, added to embeddings before attention. Bit-representation analogy.
3. **The two limitations** — absolute (model has to learn relative behavior implicitly) and bounded (positions beyond training distribution go off the rails).
4. **RoPE: rotate, don't add** — instead of adding a position vector, rotate pairs of dimensions by an angle proportional to position. Why `Q · K` then naturally encodes the *relative* distance.
5. **The intuition: angles instead of bits** — visual section. How RoPE preserves the bit-frequency idea but in rotation space.
6. **The remaining problem: extrapolation still fails** — even with relative encoding, untrained-on positions still misbehave.
7. **YaRN: not all frequencies are equal** — ramp function: stretch the slow (long-range) frequencies a lot, leave the fast (local) ones alone. Why this preserves local fidelity.
8. **Where RoPE/YaRN show up in practice** — Llama, DeepSeek, Code LLMs (preview Post 12), 128K+ context windows.
9. **Coming up next** — Post 7 (training fundamentals: backprop, optimizers, AdamW).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2 Sinusoidal | C — Equation | `PE(pos, 2i) = sin(pos / 10000^(2i/d))`, `PE(pos, 2i+1) = cos(pos / 10000^(2i/d))`. | LaTeX → SVG. File: `eq-sinusoidal.svg`. | to render |
| 2 | §2 Sinusoidal | B — Sourced image | Heatmap of sinusoidal positional encoding values for positions × dimensions. | Jay Alammar's Illustrated Transformer ("Position Encoding" figure) OR Tensor2Tensor visualization. Caption + link. | needs sourcing |
| 3 | §4 RoPE | C — Equation | RoPE rotation matrix for a 2D pair: `R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]]`, applied to (Q_i, Q_{i+1}) at frequency θ_pos. | LaTeX → SVG. File: `eq-rope-rotation.svg`. | to render |
| 4 | §4 RoPE | C — Equation | Why dot product becomes relative: `(R(θ_n) Q) · (R(θ_m) K) = Q · K · ... = function(n - m)`. (Sketched, not full derivation.) | LaTeX → SVG. File: `eq-rope-relative.svg`. | to render |
| 5 | §5 RoPE intuition | B — Sourced image | RoPE figure from Su et al. 2021 paper showing pairwise rotations across vector dimensions. | RoFormer paper (arXiv 2104.09864) Figure 1. Caption + link. | needs sourcing |
| 6 | §5 RoPE intuition | A — Mermaid (or static SVG) | Two vectors rotated by different angles; their dot product depending only on the angle difference. | Authored mermaid OR small hand-drawn SVG | to draft |
| 7 | §7 YaRN | C — Equation | YaRN ramp function (piecewise): stretch factor varies by frequency band. | LaTeX → SVG. File: `eq-yarn-ramp.svg`. | to render |
| 8 | §7 YaRN | B — Sourced image | YaRN paper figure showing per-dimension scaling vs. uniform Position Interpolation. | Peng et al. 2023 "YaRN" Figure 2 OR EleutherAI blog "The Curse of NoPE"-style figure. Caption + link. | needs sourcing |
| 9 | §8 In practice | A — Mermaid (or table) | A short table: Llama 3 (RoPE base 500K), Code Llama (RoPE 1M), DeepSeek (YaRN), GPT-4o (?). | Authored as styled MDX table | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #2 | Tensor2Tensor / Jay Alammar visualization of sinusoidal positional encoding heatmap | Page (Jay Alammar Illustrated Transformer, "Position Encoding"): https://jalammar.github.io/illustrated-transformer/ |
| #2 alt | Vaswani et al. 2017 Figure showing sinusoidal encoding (often reproduced in blog explainers) | Paper: https://arxiv.org/abs/1706.03762 |
| #5 | Su et al. 2021 "RoFormer" Figure 1 — pairwise rotation across vector dimensions | Paper: https://arxiv.org/abs/2104.09864 — HTML: https://arxiv.org/html/2104.09864 |
| #8 | Peng et al. 2023 "YaRN" Figure 2 — per-dimension scaling ramp | Paper: https://arxiv.org/abs/2309.00071 — HTML: https://arxiv.org/html/2309.00071 |
| #8 alt | EleutherAI blog, "Rotary Embeddings: A Relative Revolution" — frequency-band scaling visualization | https://blog.eleuther.ai/rotary-embeddings/ |
| Audit #6 | EleutherAI blog, "Rotary Embeddings" — rotation visualizations + relative-distance intuition | https://blog.eleuther.ai/rotary-embeddings/ |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #6 (RoPE rotation visual: two vectors rotated, dot product = function of angle difference) | **Replace with sourced.** | EleutherAI blog, "Rotary Embeddings: A Relative Revolution" — has rotation visualizations and the relative-distance intuition. https://blog.eleuther.ai/rotary-embeddings/ — *Mermaid kept as fallback.* |
| #9 (table of model → positional scheme → context window) | **Use styled MDX `Table` component.** Cleaner than mermaid for tabular data. | — |

## Further Reading (links to include in the published post)

**From your study notes**
- "Sinusoidal positional encoding explained" — YouTube. https://www.youtube.com/watch?v=dWkm4nFikgM
- "Rotary Positional Embedding (RoPE) explained" — YouTube. https://www.youtube.com/watch?v=qKUobBR5R1A

**Foundational papers**
- Vaswani et al. 2017, "Attention Is All You Need" (original sinusoidal encoding). https://arxiv.org/abs/1706.03762
- Su et al. 2021, "RoFormer: Enhanced Transformer with Rotary Position Embedding." https://arxiv.org/abs/2104.09864
- Peng et al. 2023, "YaRN: Efficient Context Window Extension of Large Language Models." https://arxiv.org/abs/2309.00071
- Chen et al. 2023, "Extending Context Window of Large Language Models via Positional Interpolation." https://arxiv.org/abs/2306.15595

**Visual / explainer content**
- EleutherAI blog, "Rotary Embeddings: A Relative Revolution." https://blog.eleuther.ai/rotary-embeddings/
- Sebastian Raschka, "Understanding Rotary Positional Embeddings." https://magazine.sebastianraschka.com/

## Open questions

1. **Math depth:** should the RoPE relative-position derivation be sketched (1-2 lines) or fully shown? Full derivation might overwhelm; hand-wave might frustrate.
2. **Sin/cos bit-analogy in §2:** your notes have a great bit-position intuition. Should I lead with that, or with the equation?
3. **Position Interpolation (PI) vs YaRN:** PI was the precursor to YaRN. Worth a short section between §6 and §7 ("PI: just stretch everything uniformly. Doesn't quite work."), or skip?
4. **Equation rendering for the rotation matrices:** a 2×2 matrix is easy in LaTeX but visually small. Should I include a worked numerical example (e.g., position 0 vs position 100) to make it concrete?
5. **Section 8 (in practice):** OK to research and add a small table of "model → positional scheme → context window", or out of scope?
