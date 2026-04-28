# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm biome-write  # Auto-format with Biome (spaces, 2-indent, 100-char line width, double quotes)
```

There is no test suite in this project.

## Architecture

This is a **Next.js 16 + Once UI** personal portfolio, statically generated from MDX content files and a central config. It uses the App Router with TypeScript and Sass.

### Content system

All site content lives in two files:

- `src/resources/content.tsx` — all user-facing text: `person`, `social`, `home`, `about`, `blog`, `work`, `gallery`, `newsletter` objects exported via `src/resources/index.ts`
- `src/resources/once-ui.config.ts` — theme, fonts, routes, SEO base URL, password-protected routes, display toggles

Blog posts and work projects are MDX files read at build time:
- `src/app/blog/posts/*.mdx`
- `src/app/work/projects/*.mdx`

`src/utils/utils.ts:getPosts()` reads these with `gray-matter` for frontmatter parsing. The slug is derived from the filename.

### MDX frontmatter shape

Blog posts and work projects share this metadata structure (from `src/utils/utils.ts`):
```
title, subtitle?, publishedAt, summary, image?, images[], tag?, team[], link?
```

### Routing

Routes are enabled/disabled in `once-ui.config.ts` under `routes`. The `RouteGuard` component enforces password protection on specific paths; the password is set in `.env`.

### Styling

- Once UI design tokens drive all theming via `data-*` attributes on `<html>`
- Custom overrides go in `src/resources/custom.css`
- Component-level styles use CSS Modules (`.module.scss`)
- Theme is initialized client-side from `localStorage` in a blocking inline script in `src/app/layout.tsx`

### Key abstractions

- `src/components/mdx.tsx` — `CustomMDX` component wraps `next-mdx-remote` for rendering MDX content
- `src/components/RouteGuard.tsx` — handles password protection redirect logic
- `src/components/Providers.tsx` — wraps Once UI providers
- `src/utils/formatDate.ts` — date formatting utility used across blog and work pages
- OG images are generated dynamically via `/api/og/generate`

### Adding content

- New blog post: add `.mdx` file to `src/app/blog/posts/`
- New work project: add `.mdx` file to `src/app/work/projects/`
- New social icon: add to `src/resources/icons.ts`, then reference in `content.tsx`
- Enable/disable pages: toggle routes in `once-ui.config.ts`

### Chatbot (optional)

Visitors can ask questions about the portfolio via a floating chat button. The UI lives in `src/components/Chatbot.tsx` + `src/components/chatbot/`. It is env-gated by `NEXT_PUBLIC_CHAT_URL`; when unset, the component renders `null` and ships no behaviour. Backend is the sibling [portfolio-chat-proxy](../portfolio-chat-proxy) FastAPI project which owns the system prompt and all guardrails. Streaming uses `fetch` + `ReadableStream` (SSE over POST because we need a request body + optional `X-Chat-Token` header).
