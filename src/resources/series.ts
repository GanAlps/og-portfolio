export type SeriesPart = {
  label: string;
  description: string;
  partRange: [number, number];
};

export type Series = {
  slug: string;
  title: string;
  tagline: string;
  intro: string[];
  totalPosts: number;
  parts: SeriesPart[];
};

export const llmInternalsCourse: Series = {
  slug: "llm-internals-course",
  title: "The LLM Internals Course",
  tagline: "A visual, theoretical course on how modern LLMs are served, trained, and made multi-modal.",
  intro: [
    "This is a 15-post course adapted from my own learning notes on Generative AI. The goal is straightforward: by the end of it, you understand how LLMs actually work end-to-end — inference, training, and multi-modal — the same way I came to understand them.",
    "It's written for engineers who already have a passing acquaintance with neural networks and transformers. No prior production-LLM experience required, but you should be comfortable with the words \"gradient,\" \"softmax,\" and \"attention\" before Post 1.",
    "Posts are heavy on diagrams and source images, with all the relevant equations rendered inline. Read in order: each part assumes the one before it.",
  ],
  totalPosts: 15,
  parts: [
    {
      label: "Part 1 — Inference",
      description:
        "How a trained LLM produces tokens at runtime: tokenization, the forward pass, KV cache, and every optimization that makes serving practical at scale.",
      partRange: [1, 6],
    },
    {
      label: "Part 2 — Training",
      description:
        "How LLMs are trained from scratch and refined: backprop, optimizers, distributed training, the full fine-tuning spectrum, alignment, and reasoning models.",
      partRange: [7, 11],
    },
    {
      label: "Part 3 — Multi-Modal",
      description:
        "How LLMs grow beyond text: code, languages, vision, diffusion, audio, video, and unified any-to-any generation.",
      partRange: [12, 15],
    },
  ],
};

export const seriesBySlug: Record<string, Series> = {
  [llmInternalsCourse.slug]: llmInternalsCourse,
};

export function getSeries(slug: string): Series | undefined {
  return seriesBySlug[slug];
}
