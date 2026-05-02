# Equation Sources

LaTeX snippets that render to images checked into `public/images/blog/llm-internals-NN-<slug>/eq-<n>.svg`.

## Convention

- One `.tex` file per equation, named `<post-NN>-<topic>.tex` (e.g. `02-attention-score.tex`).
- Each file is a standalone snippet wrapped in a minimal preamble — no `\documentclass`, just the math.
- Render via `mathjax-node-cli` or `tex2svg`. Path TBD when first equation is rendered.
- The rendered SVG goes to `public/images/blog/llm-internals-NN-<slug>/eq-<short-name>.svg`.

## Index

(Populated as posts are drafted.)
