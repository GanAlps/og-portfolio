# Post 13 — Seeing: Vision Transformers & Diffusion Models

**Status:** outline / awaiting review

**Slug:** `llm-internals-13-vision-transformers-and-diffusion`
**File path:** `src/app/blog/posts/llm-internals-13-vision-transformers-and-diffusion.mdx`
**Image folder:** `public/images/blog/llm-internals-13-vision-transformers-and-diffusion/`

## Source notes mapped

- `~/Documents/AI Theory/Multi-Modal/Image-to-text` — full file (ViT pipeline, CLS token, projector/bridge, CLIP training, fine-tuning).
- `~/Documents/AI Theory/Multi-Modal/Image Generation Models` — full file (diffusion iterative denoising, DiT, LDM, Stable Diffusion).

## Frontmatter draft

```yaml
---
title: "Seeing: Vision Transformers & Diffusion Models"
subtitle: "Two pipelines for two jobs — understanding images and creating them"
publishedAt: "2026-07-31"
summary: "Part 13 of The LLM Internals Course. Image input and image output use entirely different machinery. We trace the Vision Transformer (ViT) pipeline that lets an LLM read an image — patch embedding, CLS token, CLIP-trained projector — then switch to diffusion models, where text becomes pixels through 20–50 rounds of noise prediction. Latent Diffusion, DiT, Stable Diffusion."
tag: "AI"
series: "llm-internals-course"
part: 13
partTitle: "Vision & Diffusion"
images: []
team: []
---
```

## Section outline (target ~2200–2600 words)

1. **Two jobs, two pipelines** — understanding images uses ViT + projector + LLM. Generating images uses diffusion. Often combined in modern systems but conceptually distinct.
2. **From pixels to patches** — image (224×224×3) → 16×16 patches → 196 patch vectors of 768 dim. Patch embedding as a Conv2d trick.
3. **The CLS token and position embeddings** — prepend a special learnable [CLS] token; add position embeddings to all 197 vectors.
4. **Through the transformer** — same attention mechanics as text. CLS gathers context from all patches. Each patch also picks up surrounding context.
5. **Output: from CLS to a prediction** — original ViT job: linear head on CLS produces classification logits.
6. **Plugging ViT into an LLM: the projector** — the bridge: small MLP that maps ViT's patch tokens to the LLM's embedding space. Output is treated as a "prefix" of visual tokens followed by text tokens.
7. **CLIP: how the visual encoder learned in the first place** — contrastive pre-training: image encoder + text encoder, trained on (image, caption) pairs to make matching pairs close in vector space, mismatches far.
8. **Three-stage training** — (a) pre-train ViT with CLIP; (b) freeze ViT and LLM, train only the projector; (c) optional LoRA fine-tune of the LLM on image+text QA.
9. **Pivot: now we want to *create* images** — the model must output pixels, not text tokens. Different machinery: diffusion.
10. **The diffusion forward process: just adding noise** — start with a real image, add a tiny amount of Gaussian noise repeatedly until it's pure noise. This is the *training* trajectory.
11. **Reverse process: predict the noise to remove** — model is trained to predict the noise added at each step. Sampling = start with pure noise, repeatedly subtract predicted noise (with re-noise re-injection at each step), arrive at an image.
12. **Why a small re-noise after each step matters** — without it, output is blurry. (Your note flags this and I'll lean on it.)
13. **Diffusion Transformers (DiT)** — replace U-Net backbone with a transformer. Patchify the noisy image into visual tokens, treat text tokens as cross-attention conditioning. The Sora / SD3 lineage.
14. **Latent Diffusion Models (LDM)** — VAE encoder compresses image to a small latent grid; diffusion runs in latent space; VAE decoder upsamples back. Stable Diffusion is open-source LDM.
15. **Coming up next** — Post 14 (audio, video, temporal dimension).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §1 Two pipelines | A — Mermaid | Side-by-side: image-in pipeline (ViT → projector → LLM → text) vs image-out pipeline (text → text encoder → diffusion model → pixels). | Authored mermaid | to draft |
| 2 | §2 Patches | B — Sourced image | The famous ViT patch-grid figure (the "image is worth 16×16 words" image). | Dosovitskiy et al. 2020 "An Image Is Worth 16x16 Words" Figure 1. Caption + link. | needs sourcing |
| 3 | §3-§5 ViT | A — Mermaid | Step-by-step: image → 196 patches → patch embedding → +CLS → +pos → transformer → CLS → MLP → class. | Authored mermaid | to draft |
| 4 | §4 Attention on patches | B — Sourced image | ViT attention heatmap visualization (showing which patches the model attends to). | An ViT attention rollout figure from a blog. Caption + link. | needs sourcing |
| 5 | §6 Projector | A — Mermaid | ViT's 196 patch vectors → projector MLP → LLM-dim vectors → fed as visual prefix to LLM. | Authored mermaid | to draft |
| 6 | §7 CLIP | B — Sourced image | The CLIP contrastive training figure (image batch × text batch → similarity matrix → contrastive loss). | Radford et al. 2021 "CLIP" Figure 1. Caption + link. | needs sourcing |
| 7 | §7 CLIP | C — Equation | Contrastive loss (InfoNCE) at the level of image-text pair: `L = -log(exp(sim(I, T) / τ) / Σ_j exp(sim(I, T_j) / τ))`. | LaTeX → SVG. File: `eq-clip.svg`. | to render |
| 8 | §10 Diffusion forward | B — Sourced image | The classic forward diffusion figure (image becomes pure noise over T steps). | Ho et al. 2020 "Denoising Diffusion Probabilistic Models" Figure 1 OR Lilian Weng's diffusion blog. Caption + link. | needs sourcing |
| 9 | §11 Reverse process | A — Mermaid | The denoising loop: pure noise → predict noise → subtract → re-add small noise → repeat 20–50 times → image. | Authored mermaid | to draft |
| 10 | §11 Loss | C — Equation | Diffusion training objective (simple form): `L = E[\|\| ε - ε_θ(x_t, t, c) \|\|^2]` where `ε` is the actual added noise. Caption: "We're not predicting the image — we're predicting the noise we have to remove." | LaTeX → SVG. File: `eq-diffusion.svg`. | to render |
| 11 | §13 DiT | B — Sourced image | The DiT architecture figure. | Peebles & Xie 2022 "Scalable Diffusion Models with Transformers" Figure 3. Caption + link. | needs sourcing |
| 12 | §14 LDM | B — Sourced image | The Stable Diffusion / LDM figure showing VAE encoder + diffusion + VAE decoder. | Rombach et al. 2022 "High-Resolution Image Synthesis with Latent Diffusion Models" Figure 3. Caption + link. | needs sourcing |
| 13 | §14 LDM | A — Mermaid | Latent vs pixel-space diffusion: same denoising loop but on a smaller latent grid. | Authored mermaid | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #2 | Dosovitskiy et al. 2020 "ViT" Figure 1 — patch-grid + transformer encoder | Paper: https://arxiv.org/abs/2010.11929 — HTML: https://arxiv.org/html/2010.11929 |
| #4 | "ViT attention rollout" — community visualisation of patch attention heatmap | Page: https://outcomeschool.com/blog/decoding-vision-transformer-vit (your notes link) — also Lucas Beyer's ViT slides on Google Research |
| #6 | Radford et al. 2021 "CLIP" Figure 1 — contrastive image-text training | Paper: https://arxiv.org/abs/2103.00020 — OpenAI page: https://openai.com/index/clip/ |
| #8 | Ho et al. 2020 "DDPM" Figure 1 — forward/reverse noising sequence | Paper: https://arxiv.org/abs/2006.11239 — HTML: https://arxiv.org/html/2006.11239 |
| #8 alt | Lilian Weng, "What are Diffusion Models?" — denoising sequence visualization | https://lilianweng.github.io/posts/2021-07-11-diffusion-models/ |
| #11 | Peebles & Xie 2022 "DiT" Figure 3 — DiT block architecture | Paper: https://arxiv.org/abs/2212.09748 — HTML: https://arxiv.org/html/2212.09748 |
| #12 | Rombach et al. 2022 "LDM / Stable Diffusion" Figure 3 — VAE encoder + diffusion + VAE decoder | Paper: https://arxiv.org/abs/2112.10752 — HTML: https://arxiv.org/html/2112.10752 |
| Audit #3 | outcomeschool.com blog — step-by-step ViT walkthrough (from your notes) | https://outcomeschool.com/blog/decoding-vision-transformer-vit |
| Audit #5 | Liu et al. 2023 "LLaVA" Figure 1 — vision encoder → projector → LLM | Paper: https://arxiv.org/abs/2304.08485 — HTML: https://arxiv.org/html/2304.08485 |
| Audit #9 | Lilian Weng diffusion blog — denoising loop animation | https://lilianweng.github.io/posts/2021-07-11-diffusion-models/ |
| Audit #13 | Rombach et al. 2022 Figure 3 (same as #12) | https://arxiv.org/abs/2112.10752 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #1 (two pipelines: image-in vs image-out side-by-side) | **Keep mermaid.** Custom comparison; no published equivalent. | — |
| #3 (ViT step-by-step pipeline) | **Replace with sourced.** | Dosovitskiy et al. 2020 "ViT" Figure 1 (already cited as #2) OR outcomeschool.com blog (from your notes) which has the step-by-step. https://outcomeschool.com/blog/decoding-vision-transformer-vit — *Mermaid kept as fallback.* |
| #5 (projector: ViT patch tokens → LLM-dim vectors → visual prefix) | **Replace with sourced.** | Liu et al. 2023 "LLaVA" Figure 1 (vision encoder → projector → LLM). https://arxiv.org/abs/2304.08485 — *Mermaid kept as fallback.* |
| #9 (denoising loop visualization) | **Replace with sourced.** | Lilian Weng, "What are Diffusion Models?" — the canonical step-by-step denoising visualization. https://lilianweng.github.io/posts/2021-07-11-diffusion-models/ — *Mermaid kept as fallback.* |
| #13 (latent vs pixel-space diffusion) | **Replace with sourced.** Already covered by #12 in image plan. | Rombach et al. 2022 "LDM / Stable Diffusion" Figure 3. https://arxiv.org/abs/2112.10752 — *Mermaid kept as fallback.* |

## Further Reading (links to include in the published post)

**From your study notes**
- Rohan Paul, "Decoding Vision Transformer (ViT)." https://outcomeschool.com/blog/decoding-vision-transformer-vit
- DeepLizard, "Diffusion Models — Course." https://deeplizard.com/course/dicpailzrd

**Vision Transformers**
- Dosovitskiy et al. 2020, "An Image Is Worth 16x16 Words: Transformers for Image Recognition at Scale" (ViT). https://arxiv.org/abs/2010.11929
- Radford et al. 2021, "Learning Transferable Visual Models From Natural Language Supervision" (CLIP). https://arxiv.org/abs/2103.00020
- Liu et al. 2023, "Visual Instruction Tuning" (LLaVA). https://arxiv.org/abs/2304.08485

**Diffusion models**
- Ho et al. 2020, "Denoising Diffusion Probabilistic Models" (DDPM). https://arxiv.org/abs/2006.11239
- Rombach et al. 2022, "High-Resolution Image Synthesis with Latent Diffusion Models" (Stable Diffusion / LDM). https://arxiv.org/abs/2112.10752
- Peebles & Xie 2022, "Scalable Diffusion Models with Transformers" (DiT). https://arxiv.org/abs/2212.09748

**Visual explainers**
- Lilian Weng, "What are Diffusion Models?" https://lilianweng.github.io/posts/2021-07-11-diffusion-models/
- Jay Alammar, "The Illustrated Stable Diffusion." https://jalammar.github.io/illustrated-stable-diffusion/
- Hugging Face, "The Annotated Diffusion Model." https://huggingface.co/blog/annotated-diffusion

**Code and tools**
- Hugging Face Diffusers library. https://huggingface.co/docs/diffusers
- Stable Diffusion repository. https://github.com/CompVis/stable-diffusion

## Open questions

1. **CLIP loss derivation:** I've sketched the InfoNCE form. Want it more explicit (with both image→text and text→image directions averaged)?
2. **U-Net mention:** worth a sentence on classical diffusion U-Net for context, or dive straight into DiT (which is what modern systems use)?
3. **Score-based / SDE framing:** mathematical alternative view. Mention or skip? Probably skip — too theoretical for this post.
4. **VAE inside LDM:** worth a brief explanation of what a VAE is, or assume readers know? (A VAE explainer adds 200 words.)
5. **Length:** this is a wide post — two big subjects. Comfortable up to ~2600 words?
