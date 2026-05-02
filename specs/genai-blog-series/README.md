# The LLM Internals Course — Series Index

Source-of-truth tracker for the 15-post blog series adapting `~/Documents/AI Theory/{Inference,Training,Multi-Modal}` into a course-style learning path on the portfolio.

Approved plan: `~/.claude/plans/i-want-to-create-effervescent-snail.md`.

## Status overview

- ✅ **Track 1: Site UX scaffolding** — series landing page, featured card, breadcrumb + prev/next pager all built; `pnpm build` green.
- ⏳ **Track 2: All 15 outlines drafted** — awaiting batch review.
- ⏸ MDX writing has not started for any post and will not start until each post's outline + image plan is signed off.

## Folder structure

Each post lives in its own subfolder:

```
specs/genai-blog-series/
├── README.md                                    ← this file
├── equations/                                   ← shared LaTeX snippet library
│   └── README.md
├── post-01-tokenization-embeddings-sampling/
│   └── outline.md
├── post-02-inside-the-transformer-at-inference-time/
│   └── outline.md
├── ... (post-03 through post-15) ...
└── post-15-native-multimodality-and-any-to-any/
    └── outline.md
```

Once a post moves into drafting, additional files (image candidates, equation TeX sources, draft MDX prior to publishing) can live alongside its `outline.md`.

## Posts

### Part 1 — Inference (6 posts)

| # | Slug | Outline | Status |
|---|---|---|---|
| 1 | `llm-internals-01-tokenization-embeddings-sampling` | [outline](./post-01-tokenization-embeddings-sampling/outline.md) | awaiting review |
| 2 | `llm-internals-02-inside-the-transformer-at-inference-time` | [outline](./post-02-inside-the-transformer-at-inference-time/outline.md) | awaiting review |
| 3 | `llm-internals-03-serving-llms-in-production` | [outline](./post-03-serving-llms-in-production/outline.md) | awaiting review |
| 4 | `llm-internals-04-kv-cache-optimizations` | [outline](./post-04-kv-cache-optimizations/outline.md) | awaiting review |
| 5 | `llm-internals-05-parallelism-speculative-decoding-moe` | [outline](./post-05-parallelism-speculative-decoding-moe/outline.md) | awaiting review |
| 6 | `llm-internals-06-rope-yarn-context-window-extension` | [outline](./post-06-rope-yarn-context-window-extension/outline.md) | awaiting review |

### Part 2 — Training (5 posts)

| # | Slug | Outline | Status |
|---|---|---|---|
| 7 | `llm-internals-07-how-llms-are-trained` | [outline](./post-07-how-llms-are-trained/outline.md) | awaiting review |
| 8 | `llm-internals-08-distributed-training` | [outline](./post-08-distributed-training/outline.md) | awaiting review |
| 9 | `llm-internals-09-pretraining-to-instruction-tuned` | [outline](./post-09-pretraining-to-instruction-tuned/outline.md) | awaiting review |
| 10 | `llm-internals-10-alignment-and-peft` | [outline](./post-10-alignment-and-peft/outline.md) | awaiting review |
| 11 | `llm-internals-11-reasoning-and-distillation` | [outline](./post-11-reasoning-and-distillation/outline.md) | awaiting review |

### Part 3 — Multi-Modal (4 posts)

| # | Slug | Outline | Status |
|---|---|---|---|
| 12 | `llm-internals-12-coding-and-multilingual-llms` | [outline](./post-12-coding-and-multilingual-llms/outline.md) | awaiting review |
| 13 | `llm-internals-13-vision-transformers-and-diffusion` | [outline](./post-13-vision-transformers-and-diffusion/outline.md) | awaiting review |
| 14 | `llm-internals-14-audio-video-and-temporal-dimension` | [outline](./post-14-audio-video-and-temporal-dimension/outline.md) | awaiting review |
| 15 | `llm-internals-15-native-multimodality-and-any-to-any` | [outline](./post-15-native-multimodality-and-any-to-any/outline.md) | awaiting review |

## Open questions across all outlines

Each outline has its own "Open questions" section. A few cross-cutting decisions you may want to lock once and propagate:

1. **Equation rendering toolchain** — confirmed plan: pre-render LaTeX → SVG via `mathjax-node-cli` (dev-dep), checked into `public/images/blog/<slug>/eq-*.svg`. Want me to set up the toolchain before any post moves to MDX?
2. **Series-wide image-source preference** — papers > HuggingFace blog > Lilian Weng / Sebastian Raschka / Jay Alammar > lecture slides. Confirm or override.
3. **Word-count band** — 1500–2500 sweet spot, hard cap at 3000. Confirmed. Some posts (4, 10, 14) flag they may want more space; keep that flexibility.
4. **Series-wide frontmatter preview-image (`image:` field)** — currently all blank. Want a generated OG image per post, or one shared cover for the whole series?
5. **Publishing cadence** — outlines are written assuming weekly publishing starting 2026-05-08. Slip if needed; the dates are placeholders.

## Per-post workflow (after your review)

For each post:

1. You return the outline with answers to its open questions and any image swaps you want.
2. I source/render the assets, drop them into `public/images/blog/llm-internals-NN-<slug>/`. LaTeX snippets live in `specs/genai-blog-series/equations/` and render to SVG in the post's image folder.
3. I write MDX at `src/app/blog/posts/llm-internals-NN-<slug>.mdx` with frontmatter (`series: "llm-internals-course"`, `part: NN`, `partTitle: "..."`).
4. You review the MDX in `pnpm dev`, request changes, we iterate.
5. Mark the post "published" in the table above.

## Style notes (shared across posts)

- Length: 1500–2500 words sweet spot; up to 3000 for genuinely dense topics.
- Voice: practitioner, declarative, engineer-to-engineer. Match existing posts in `src/app/blog/posts/`.
- Visual ratio target: at least one image (any category) per major H2 section.
- **Per-post review gate:** review and approve each post individually before any work begins on the next post. "continue"-style replies mean "iterate on current", not "start the next post".
- **Mermaid orientation:** default to `flowchart TB` (vertical). The text column is ~700px wide; horizontal flowcharts cram each box into illegibility. Use LR only for very short chains.
- **Equation sizing:** every equation `<Media>` must be wrapped with an explicit width cap (~400–540px depending on length). Mathjax SVGs are intrinsically small — without a cap they render at full text-column width and look enormous.
- **Sources & Further Reading section:** render with smaller, muted typography (e.g., `body-default-s` + `label-default-s` for headings). It's reference material, not a competing reading path.
- **Image compression:** every sourced image passes through `scripts/compress-images.mjs` before MDX references it. Targets: max 1500px wide, PNG/JPEG re-encoded with sharp, ideally ≤300KB. Saves bytes for readers and keeps the repo small.
- **Visual priority:** sourced images > authored mermaid > nothing. Real figures from papers, HuggingFace / Lilian Weng / Sebastian Raschka / Jay Alammar / EleutherAI blogs and lecture slides are preferred for intuition. Mermaid is fallback only when no good published figure exists, or when the diagram is genuinely unique to the post's argument. Each outline has a "Visual Sources Audit" section listing where mermaid was replaced and where it survives.
- **Image source attribution (IMPORTANT):** every sourced image in a published post MUST be followed by a small "Source: <Author> (<Year>), <Title>" attribution line linking back to the original — even though we host images locally for performance. We never strip credit. Suggested MDX pattern:
  ```mdx
  <Media src="/images/blog/<slug>/figure.png" alt="..." />
  <Text variant="label-default-xs" onBackground="neutral-weak" align="center">
    Source: <SmartLink href="<original URL>">Author Name (Year), Title</SmartLink>
  </Text>
  ```
  This applies only to category-B sourced images; mermaid and equations do not need attribution.
- **Specific image URLs in outlines:** every B-category row in each outline's Images & Equations Plan should include a specific URL — either a direct image URL or a paper/blog page URL with a figure-number reference. "Vaswani Figure 2" alone is not specific enough; pair with `https://arxiv.org/abs/1706.03762` (paper page) or the HTML/blog hosting the figure.
- Equations always rendered as static images (pre-rendered SVGs) with a one-line caption explaining symbols.
- Sources cited at point of use (see attribution rule above); full "Further Reading" section at the bottom of each post.
- No code blocks unless they teach something the prose can't (this is a theory series, not a tutorial).
