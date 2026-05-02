# Post 15 — Native Multimodality & Any-to-Any Generation

**Status:** outline / awaiting review

**Slug:** `llm-internals-15-native-multimodality-and-any-to-any`
**File path:** `src/app/blog/posts/llm-internals-15-native-multimodality-and-any-to-any.mdx`
**Image folder:** `public/images/blog/llm-internals-15-native-multimodality-and-any-to-any/`

## Source notes mapped

- `~/Documents/AI Theory/Multi-Modal/Native Multi-Modality` — full file (VQ-VAE Chameleon approach, GPT-4o hybrid latent approach).
- `~/Documents/AI Theory/Multi-Modal/Any-to-Any generation` — full file (modality-switch tokens, probabilistic intent, parallel generation, real-time streaming).

## Frontmatter draft

```yaml
---
title: "Native Multimodality & Any-to-Any Generation"
subtitle: "When the same transformer reads images, hears audio, watches video, and replies in any of them"
publishedAt: "2026-08-14"
summary: "Part 15, the final post of The LLM Internals Course. Earlier multimodal systems glued separate models together. Native multimodal models like Chameleon, GPT-4o, and Gemini do it inside one transformer with a unified token vocabulary. We unpack the two architectural philosophies (VQ-VAE discrete tokens vs hybrid latent), the modality-switch tokens that gate output, and the streaming loops that make real-time video calls work."
tag: "AI"
series: "llm-internals-course"
part: 15
partTitle: "Native & Any-to-Any"
images: []
team: []
---
```

## Section outline (target ~2000–2400 words)

1. **The pre-2024 stack vs the 2025+ stack** — old way: text LLM + ViT + diffusion model + audio model glued by orchestration. New way: one transformer, one vocabulary, all modalities. Why this matters: inter-modality reasoning improves.
2. **Approach 1: VQ-VAE discrete visual tokens (Chameleon)** — break image into patches, vector-quantize each to one of ~8K visual tokens. Vocabulary is unified: 7K text + 8K visual. Auto-regressive next-token prediction can emit either kind.
3. **VQ-VAE training** — encoder + codebook + decoder. Each patch maps to its nearest codebook vector. The codebook IS the visual vocabulary.
4. **Approach 2: hybrid continuous latent (GPT-4o, Gemini)** — image gets tiled (low-res = 1 tile = 85 tokens; high-res = 4×4 tiles × 170 tokens). Tokens flow through the transformer, but final image generation goes through a separate Latent Diffusion Decoder. More complex but better image quality.
5. **Comparing the two** — Chameleon: simpler, weaker images, stronger inter-modal reasoning. GPT-4o: stronger images, more components, comparable reasoning. The likely future: hybrid.
6. **The "what should I generate next?" question** — modality-switch tokens. `<|start_of_text|>`, `<|start_of_image|>`, `<|start_of_audio|>` are real vocabulary entries. The model emits one based on training-data probabilities, then subsequent tokens are routed to that modality's decoder.
7. **Probabilistic intent** — there's no separate logic circuit picking modality. "Show me a sunset" simply has high p(<|start_of_image|>) because that's what training showed.
8. **Generating video calls: parallel streams** — two patterns: (a) Interleaved "braid" — tokens alternate `[Frame 1][Audio for Frame 1][Frame 2]...`, KV cache aligns them; (b) Multi-head latent prediction — single transformer trunk with parallel video and audio decode heads, sync-clock keeps diffusion steps aligned.
9. **Real-time loops** — streaming chunked input (200ms), prefix-as-context, immediate token generation. Distilled consistency models / speculative decoding so diffusion runs in 1–2 steps instead of 50.
10. **Course recap** — one short closing section: the path from tokenization (Post 1) to GPT-4o-style any-to-any, all running on the same transformer + the optimisations stacked along the way.
11. **Where to go from here** — pointers for further reading. Frontier papers, lecture courses, codebases (vLLM, transformers, diffusers).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 Old vs new stack | A — Mermaid | Side-by-side: orchestrated multi-model stack (text LLM + ViT + diffusion + audio) vs unified transformer with modality I/O. | Authored mermaid | to draft |
| 2 | §2 Chameleon | B — Sourced image | The Chameleon architecture figure showing unified vocabulary (text + image tokens). | Meta 2024 "Chameleon: Mixed-Modal Early-Fusion Foundation Models" Figure 1 or 2. Caption + link. | needs sourcing |
| 3 | §3 VQ-VAE | B — Sourced image | The VQ-VAE codebook figure (encoder → nearest-codebook lookup → decoder). | van den Oord et al. 2017 "Neural Discrete Representation Learning" Figure 1 OR a clean redraw. Caption + link. | needs sourcing |
| 4 | §3 VQ-VAE | A — Mermaid | Image patch → encoder → nearest codebook vector (token ID) → vocabulary entry. | Authored mermaid | to draft |
| 5 | §4 GPT-4o tiling | A — Mermaid | Low-res (1 tile, 85 tokens) vs high-res (4×4 tiles × 170 tokens) image tokenization. | Authored mermaid | to draft |
| 6 | §4 Hybrid latent | A — Mermaid | GPT-4o-style: transformer outputs latent vectors → Latent Diffusion Decoder generates image. | Authored mermaid | to draft |
| 7 | §5 Comparison | A — Mermaid (or table) | Comparison: Chameleon vs GPT-4o vs Gemini, axes: tokenization, image quality, reasoning, complexity. | Styled MDX table | to draft |
| 8 | §6 Modality switch | A — Mermaid | Token stream with `<|start_of_image|>` followed by visual tokens; arrow showing routing to image decoder. | Authored mermaid | to draft |
| 9 | §8 Braid method | A — Mermaid | Alternating `[F1][A1][F2][A2]...` token sequence with cross-attention between video and audio tokens. | Authored mermaid | to draft |
| 10 | §8 Multi-head latent | A — Mermaid | Single transformer trunk → two diffusion heads (video, audio) → global sync clock. | Authored mermaid | to draft |
| 11 | §9 Real-time loop | A — Mermaid | Streaming loop: 200ms chunk in → prefix-as-context → token generation → output streamed. | Authored mermaid `sequenceDiagram` | to draft |
| 12 | §10 Course recap | A — Mermaid | Big-picture diagram: input modality → tokenize → unified transformer (with all the optimisations from Posts 4-6 highlighted) → unified output → modality-specific decoder. | Authored mermaid | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #2 | Meta AI 2024 "Chameleon" Figure 1 — unified-vocabulary architecture (text + image tokens in one stream) | Paper: https://arxiv.org/abs/2405.09818 — HTML: https://arxiv.org/html/2405.09818 |
| #2 alt | Meta blog post on Chameleon | https://ai.meta.com/research/publications/chameleon-mixed-modal-early-fusion-foundation-models/ |
| #3 | van den Oord et al. 2017 "VQ-VAE" Figure 1 — encoder + codebook + decoder | Paper: https://arxiv.org/abs/1711.00937 |
| #3 alt | Esser et al. 2021 "VQGAN" Figure 1 — codebook-based image tokenization (cleaner redraw) | Paper: https://arxiv.org/abs/2012.09841 — HTML: https://arxiv.org/html/2012.09841 |
| Audit #4 | van den Oord 2017 Figure 1 (same as #3) | https://arxiv.org/abs/1711.00937 |
| Audit #8 | Meta 2024 "Chameleon" Figure (same as #2) | https://arxiv.org/abs/2405.09818 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (old vs new stack side-by-side) | **Keep mermaid.** Custom argument-framing for this post; no published equivalent. | — |
| #4 (VQ-VAE: image patch → encoder → codebook → token ID) | **Replace with sourced.** Already covered by #3 in image plan. | van den Oord et al. 2017 "VQ-VAE" Figure 1. https://arxiv.org/abs/1711.00937 — *Mermaid kept as fallback.* |
| #5 (GPT-4o tiling: low-res 1 tile / high-res 4×4 tiles) | **Keep mermaid.** OpenAI hasn't published an architecture figure of the exact tiling; semi-speculative. | — |
| #6 (hybrid latent: transformer → Latent Diffusion Decoder) | **Keep mermaid.** Semi-speculative GPT-4o-style architecture. | — |
| #7 (Chameleon vs GPT-4o vs Gemini comparison) | **Use styled MDX `Table` component.** | — |
| #8 (modality-switch token routing) | **Replace with sourced.** Already covered by #2 in image plan. | Meta 2024 "Chameleon" Figure 2 (unified-vocabulary token stream). https://arxiv.org/abs/2405.09818 — *Mermaid kept as fallback.* |
| #9 (braid method: interleaved frames + audio tokens) | **Keep mermaid.** Custom illustration; no published reference figure. | — |
| #10 (multi-head latent prediction with sync clock) | **Keep mermaid.** Speculative architecture for omni-modal models; no public reference. | — |
| #11 (real-time streaming loop) | **Keep mermaid.** A simple sequence diagram; mermaid `sequenceDiagram` is the natural fit. | — |
| #12 (course-recap big-picture) | **Keep mermaid.** Final synthesis figure unique to this post. | — |

## Further Reading (links to include in the published post)

**Native multimodal models**
- Meta AI 2024, "Chameleon: Mixed-Modal Early-Fusion Foundation Models." https://arxiv.org/abs/2405.09818
- van den Oord et al. 2017, "Neural Discrete Representation Learning" (VQ-VAE). https://arxiv.org/abs/1711.00937
- Esser et al. 2021, "Taming Transformers for High-Resolution Image Synthesis" (VQGAN). https://arxiv.org/abs/2012.09841

**GPT-4o and Gemini**
- OpenAI, "Hello GPT-4o." https://openai.com/index/hello-gpt-4o/
- Google DeepMind, "Gemini: A Family of Highly Capable Multimodal Models." https://arxiv.org/abs/2312.11805
- Google DeepMind, "Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context." https://arxiv.org/abs/2403.05530

**Any-to-any & streaming**
- Wu et al. 2023, "NExT-GPT: Any-to-Any Multimodal LLM." https://arxiv.org/abs/2309.05519
- Tang et al. 2023, "CoDi: Any-to-Any Generation via Composable Diffusion." https://arxiv.org/abs/2305.11846

**Wider series capstone reading**
- Lilian Weng's blog (everything tagged "LLM" or "Multimodal"). https://lilianweng.github.io/
- Sebastian Raschka, "Ahead of AI" newsletter. https://magazine.sebastianraschka.com/
- Hugging Face LLM Course. https://huggingface.co/learn/llm-course
- Stanford CS336 (LLMs from Scratch) lectures. https://stanford-cs336.github.io/spring2024/
- Anthropic Research blog (interpretability + alignment depth). https://www.anthropic.com/research

## Open questions

1. **Capstone tone:** since this closes the series, do you want a more reflective ending in §10–§11 (lessons learned, what's coming next in 2026/27), or stay strictly technical and just point at further reading?
2. **Frontier-model name-dropping:** GPT-4o, Gemini 2.x, Chameleon, Llama 3 multimodal, DeepSeek-VL — how many to mention by name? More = better grounded; risk = dating the post.
3. **Section 11 (further reading):** which specific resources do you want pinned? (Suggestions: Lilian Weng's blog, HuggingFace course, Karpathy lectures, DeepLearning.AI courses, specific papers.)
4. **Streaming-loop math:** is there a meaningful equation here, or stick with diagrams?
5. **Length:** ~2200 words feels right for a closer. OK?
