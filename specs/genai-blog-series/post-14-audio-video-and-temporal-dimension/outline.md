# Post 14 — Hearing & Watching: Audio, Video, and the Temporal Dimension

**Status:** outline / awaiting review

**Slug:** `llm-internals-14-audio-video-and-temporal-dimension`
**File path:** `src/app/blog/posts/llm-internals-14-audio-video-and-temporal-dimension.mdx`
**Image folder:** `public/images/blog/llm-internals-14-audio-video-and-temporal-dimension/`

## Source notes mapped

- `~/Documents/AI Theory/Multi-Modal/Audio-Video & Temporal Dimension` — full file (the largest source file, 11KB; covers video understanding, video generation, temporal attention mechanisms, audio approaches, audio-video sync).

## Frontmatter draft

```yaml
---
title: "Hearing & Watching: Audio, Video, and the Temporal Dimension"
subtitle: "What changes when modalities have time built in — and how models stay coherent across thousands of frames"
publishedAt: "2026-08-07"
summary: "Part 14 of The LLM Internals Course. Audio and video share one fundamental difference from text and images: they have a time axis. We unpack how models tokenize sound (spectrograms vs neural codecs vs native), how they compress 100-frame videos into manageable token counts (factorized attention, perceiver resamplers, 3D-RoPE), and how audio-video sync is enforced — from token interleaving (GPT-4o style) to joint latent diffusion (Sora style)."
tag: "AI"
series: "llm-internals-course"
part: 14
partTitle: "Audio, Video & Temporal"
images: []
team: []
---
```

## Section outline (target ~2400–2800 words; this is the longest multi-modal post)

1. **The new dimension: time** — what changes when input is a sequence of frames or a continuous waveform.
2. **Video understanding: spatiotemporal patches** — instead of 2D patches, 3D (e.g., 16×16 pixels × 2 frames). Each video token carries a hint of motion.
3. **Video understanding: temporal attention** — interleaved with spatial attention. Spatial answers "what is in this frame", temporal answers "where did it go in the next frame".
4. **The token-count problem** — a 1-minute video has thousands of frames. Compression strategies: uniform sampling, temporal pooling, SlowFast.
5. **Video generation: 3D denoising** — diffusion (Post 13) extended into a 3D block (frames × H × W) of latent noise. Same denoising loop, plus temporal-consistency attention so the cat doesn't morph between frames.
6. **The "physics" of video models** — Sora-style models learn visual physics from data. No hardcoded laws — but the next-token of a falling ball is a "bouncing" ball.
7. **Temporal attention optimisations** — three big ones: (a) Factorised attention (spatial then temporal); (b) Perceiver Resampler (fixed-size learned latents that compress 100 frames into 64 vectors); (c) 3D-RoPE ((x, y, t) coordinates with rotary embedding extended to 3 dimensions).
8. **Sliding window + summary cache** — for very long videos: process windowed frames, keep a summary KV-cache that gets passed forward.
9. **Audio approach 1: spectrograms** — Fourier transform → Mel-spectrogram → ViT. Whisper. Pros: simple. Cons: loses temporal resolution, hard to generate expressive speech.
10. **Audio approach 2: neural codecs** — EnCodec / SoundStream. CNN compressor + vector quantization → multi-scale discrete audio tokens. AudioLM, Gemini.
11. **Audio approach 3: native (GPT-4o)** — neural-codec tokens processed in the *same* transformer as text, with vocoder decoder back to waveform. Why this preserves emotion and rhythm.
12. **Audio + video sync, three ways** — (a) Fused sequence (early fusion): timestamp-interleaved tokens, attention aligns them. (b) Cross-modal attention (late fusion): separate encoders, video queries audio. (c) Contrastive alignment (CLAP): pre-train so audio and visual vectors land in shared space.
13. **The Sora way: joint latent diffusion** — pixels and audio waveforms predicted from a shared latent diffusion process.
14. **The two hard problems** — alignment drift (lips don't match voice) and redundancy (video tokens dwarf audio tokens).
15. **Coming up next** — Post 15 (Native multimodality and any-to-any generation).

## Images & Equations Plan

| # | Section | Category | What it shows | Source / LaTeX | Status |
|---|---|---|---|---|---|
| 1 | §2 Spatiotemporal patches | B — Sourced image | The ViViT or Sora 3D-patch figure. | ViViT paper (Arnab et al. 2021) Figure 2 OR Sora technical report figure. Caption + link. | needs sourcing |
| 2 | §3 Temporal attention | B — Sourced image | Spatial vs temporal attention diagram. | ViViT Figure 3 (factorised models). Caption + link. | needs sourcing |
| 3 | §4 Compression | A — Mermaid | Three pathways: uniform sampling / temporal pooling / SlowFast. | Authored mermaid | to draft |
| 4 | §5 3D denoising | A — Mermaid | A 3D block of latent noise denoising over diffusion steps to produce a coherent video clip. | Authored mermaid | to draft |
| 5 | §7 Factorised attention | A — Mermaid | Token grid: spatial attention within each frame, then temporal attention along the time axis. | Authored mermaid | to draft |
| 6 | §7 Perceiver Resampler | B — Sourced image | The DeepMind Flamingo Perceiver Resampler diagram. | Alayrac et al. 2022 "Flamingo" Figure 5. Caption + link. | needs sourcing |
| 7 | §7 3D-RoPE | C — Equation | 3D-RoPE: independent rotations on x-pair, y-pair, t-pair dimensions of each token vector. | LaTeX → SVG. File: `eq-3d-rope.svg`. | to render |
| 8 | §9 Spectrograms | B — Sourced image | Mel-spectrogram of speech with a corresponding waveform. | Whisper paper Figure 1 OR a speech-processing tutorial. Caption + link. | needs sourcing |
| 9 | §9 Spectrograms | A — Mermaid | Pipeline: waveform → Fourier → Mel-spectrogram → ViT-like encoder → projector → LLM. | Authored mermaid | to draft |
| 10 | §10 Neural codecs | B — Sourced image | EnCodec / SoundStream architecture figure showing CNN + RVQ multi-scale. | Défossez et al. 2022 "EnCodec" Figure 1 OR SoundStream paper Figure 1. Caption + link. | needs sourcing |
| 11 | §10 Multi-scale tokens | A — Mermaid | High-level (semantic) vs low-level (acoustic) audio tokens, stacked. | Authored mermaid | to draft |
| 12 | §11 Native audio | A — Mermaid | Audio in → codec tokens → unified transformer (with text) → predicted audio tokens → vocoder → audio out. | Authored mermaid | to draft |
| 13 | §12 Sync three ways | A — Mermaid | Three side-by-side panels: fused sequence / cross-modal attention / contrastive alignment. | Authored mermaid | to draft |
| 14 | §12 CLAP | B — Sourced image | The CLAP figure (analogue of CLIP for audio). | Wu et al. 2022 "CLAP" Figure 1 OR LAION CLAP. Caption + link. | needs sourcing |
| 15 | §13 Sora joint diffusion | B — Sourced image | The Sora architecture diagram from the OpenAI technical report. | OpenAI Sora technical report. Caption + link. | needs sourcing |
| 16 | §14 Comparison table | A — Mermaid (or table) | Audio approaches comparison from your notes: spectrogram / discrete tokens / neural codec, with examples (Whisper / Chameleon / GPT-4o). | Styled MDX table | to draft |

### Specific image URL candidates (for B-category rows)

| Row | Source | URL |
|---|---|---|
| #1 | Arnab et al. 2021 "ViViT" Figure 2 — 3D spatiotemporal patches | Paper: https://arxiv.org/abs/2103.15691 — HTML: https://arxiv.org/html/2103.15691 |
| #1 alt | OpenAI Sora technical report — 3D-patch figure | https://openai.com/index/video-generation-models-as-world-simulators/ |
| #2 | Arnab et al. 2021 "ViViT" Figure 3 — factorised spatial-then-temporal models | https://arxiv.org/abs/2103.15691 |
| #6 | Alayrac et al. 2022 "Flamingo" Figure 5 — Perceiver Resampler | Paper: https://arxiv.org/abs/2204.14198 — HTML: https://arxiv.org/html/2204.14198 |
| #8 | Radford et al. 2022 "Whisper" Figure 1 — Mel-spectrogram + encoder/decoder pipeline | Paper: https://arxiv.org/abs/2212.04356 — HTML: https://arxiv.org/html/2212.04356 |
| #10 | Défossez et al. 2022 "EnCodec" Figure 1 — CNN encoder + RVQ + decoder | Paper: https://arxiv.org/abs/2210.13438 — HTML: https://arxiv.org/html/2210.13438 |
| #10 alt | Zeghidour et al. 2021 "SoundStream" Figure 1 — neural audio codec | Paper: https://arxiv.org/abs/2107.03312 |
| #14 | Wu et al. 2022 "LAION-CLAP" Figure 1 — contrastive language-audio alignment | Paper: https://arxiv.org/abs/2211.06687 — HTML: https://arxiv.org/html/2211.06687 |
| #15 | OpenAI Sora technical report — joint latent diffusion architecture diagram | https://openai.com/index/video-generation-models-as-world-simulators/ |
| Audit #3 | Feichtenhofer et al. 2018 "SlowFast" Figure 1 — SlowFast pathways | Paper: https://arxiv.org/abs/1812.03982 — HTML: https://arxiv.org/html/1812.03982 |
| Audit #5 | ViViT Figure 3 (same as #2) | https://arxiv.org/abs/2103.15691 |
| Audit #9 | Whisper Figure 1 (same as #8) | https://arxiv.org/abs/2212.04356 |
| Audit #11 | Borsos et al. 2022 "AudioLM" Figure 1 — semantic + acoustic token hierarchy | Paper: https://arxiv.org/abs/2209.03143 — HTML: https://arxiv.org/html/2209.03143 |

## Visual Sources Audit (mermaid → sourced candidates)

| Row | Decision | Sourced candidate |
|---|---|---|
| #3 (compression pathways: uniform sampling / temporal pooling / SlowFast) | **Replace with sourced (partial).** | SlowFast paper Figure 1 (Feichtenhofer et al. 2018) for the SlowFast pathway. https://arxiv.org/abs/1812.03982 — covers one of three pathways; mermaid still useful to combine all three side-by-side. *Hybrid: sourced for SlowFast inset + mermaid wrapper.* |
| #4 (3D denoising of video latents) | **Replace with sourced.** | OpenAI Sora technical report figures (3D latent denoising). https://openai.com/index/video-generation-models-as-world-simulators/ — *Mermaid kept as fallback.* |
| #5 (factorised attention: spatial then temporal) | **Replace with sourced.** Already covered by #2 in image plan. | Arnab et al. 2021 "ViViT" Figure 3 (factorised models). https://arxiv.org/abs/2103.15691 — *Mermaid kept as fallback.* |
| #9 (spectrogram pipeline: waveform → Fourier → Mel → ViT) | **Replace with sourced.** | Radford et al. 2022 "Whisper" Figure 1 (full pipeline). https://arxiv.org/abs/2212.04356 — *Mermaid kept as fallback.* |
| #11 (multi-scale audio tokens: semantic + acoustic) | **Replace with sourced.** | Borsos et al. 2022 "AudioLM" Figure 1 (semantic + acoustic token hierarchy) OR Défossez et al. 2022 "EnCodec" Figure 1 (RVQ multi-scale). https://arxiv.org/abs/2209.03143 https://arxiv.org/abs/2210.13438 — *Mermaid kept as fallback.* |
| #12 (native audio: codec tokens → unified transformer → vocoder) | **Keep mermaid.** GPT-4o is opaque; no published reference figure of the exact architecture. | — |
| #13 (sync three ways: fused / cross-modal / contrastive) | **Keep mermaid.** Custom three-panel comparison; no single published figure covers all three. | — |
| #16 (audio approaches comparison table) | **Use styled MDX `Table` component.** | — |

## Further Reading (links to include in the published post)

**Video understanding**
- Arnab et al. 2021, "ViViT: A Video Vision Transformer." https://arxiv.org/abs/2103.15691
- Bertasius et al. 2021, "Is Space-Time Attention All You Need for Video Understanding?" (TimeSformer). https://arxiv.org/abs/2102.05095
- Lin et al. 2023, "Video-LLaVA: Learning United Visual Representation by Alignment Before Projection." https://arxiv.org/abs/2311.10122
- Alayrac et al. 2022, "Flamingo: a Visual Language Model for Few-Shot Learning" (Perceiver Resampler). https://arxiv.org/abs/2204.14198

**Video generation**
- OpenAI, "Video generation models as world simulators" (Sora technical report). https://openai.com/index/video-generation-models-as-world-simulators/
- Blattmann et al. 2023, "Stable Video Diffusion." https://arxiv.org/abs/2311.15127

**Audio understanding & generation**
- Radford et al. 2022, "Robust Speech Recognition via Large-Scale Weak Supervision" (Whisper). https://arxiv.org/abs/2212.04356
- Défossez et al. 2022, "High Fidelity Neural Audio Compression" (EnCodec). https://arxiv.org/abs/2210.13438
- Zeghidour et al. 2021, "SoundStream: An End-to-End Neural Audio Codec." https://arxiv.org/abs/2107.03312
- Borsos et al. 2022, "AudioLM: a Language Modeling Approach to Audio Generation." https://arxiv.org/abs/2209.03143

**Audio-video alignment**
- Wu et al. 2022, "Large-scale Contrastive Language-Audio Pretraining (CLAP)." https://arxiv.org/abs/2211.06687
- Girdhar et al. 2023, "ImageBind: One Embedding Space To Bind Them All." https://arxiv.org/abs/2305.05665

**Visual explainers**
- Lilian Weng, "The Multi-Modal LLM Landscape." https://lilianweng.github.io/
- HuggingFace blog, "Speech-to-Text with Whisper." https://huggingface.co/blog/asr-chunking

## Open questions

1. **Length:** this post covers a *lot* — at minimum 2600 words, possibly more. OK to let it run, or should I split into Post 14a (video) + Post 14b (audio) and push the rest of Part 3 to 16 posts?
2. **Sora architecture diagram availability:** OpenAI's technical report is short on detail. Is there a community-redrawn figure you trust, or should we use the official one?
3. **Video understanding vs generation:** your notes have this as a clean split (the table at the end). Should I keep that table as a recap visual?
4. **3D-RoPE:** your notes don't go deep on this. OK to extrapolate from Post 6's RoPE math, or is this scope creep?
5. **Section 9 (Spectrograms): include a small primer on Fourier transform** (one paragraph) or assume it's known?
