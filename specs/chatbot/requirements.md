# Portfolio Chatbot UI — Requirements

## Overview

A floating chatbot button on the portfolio site that lets visitors ask questions about Osho's portfolio. The button is gated on the `NEXT_PUBLIC_CHAT_URL` env var so the site stays clean and functional when the local wrapper (portfolio-chat-proxy) is offline or unshipped.

## User-facing requirements

- A visitor sees a floating chat button at the bottom-right corner of every page.
- Clicking the button opens a chat panel overlay with a message list, a text input, and a send button.
- The visitor can send a question and see the assistant reply stream in word-by-word.
- The visitor can ask multiple follow-up questions in the same session; history is cleared on page reload.
- The visitor can close the panel via a close button or the Esc key.
- On a mobile device, the panel goes full-screen for readability.
- When the chat service is unavailable, the visitor sees an inline banner and the send button is disabled for 30 seconds before the next retry is allowed.
- When `NEXT_PUBLIC_CHAT_URL` is unset at build time, the button is completely absent and no JS is shipped for it.

## Operator-facing requirements

- The operator can enable the chatbot by setting two env vars in their deployment:
  - `NEXT_PUBLIC_CHAT_URL` — public URL of the portfolio-chat-proxy (e.g. `https://<host>.ts.net:8443`)
  - `NEXT_PUBLIC_CHAT_TOKEN` — optional obfuscation token that matches the wrapper's `SHARED_TOKEN`. Documented as non-authoritative (ships to browsers).
- The operator can hide the chatbot at any time by unsetting `NEXT_PUBLIC_CHAT_URL` and redeploying.

## Accessibility requirements

- The panel uses `role="dialog"` and `aria-modal="true"`.
- Focus moves to the input when opened and returns to the FAB on close.
- Esc closes the panel.
- Messages list has `aria-live="polite"` so screen readers announce new assistant content.
- The FAB has a descriptive `aria-label`.

## Constraints

- Next.js 16 + Once UI; CSS Modules + Once UI tokens only (no hex colors).
- No new top-level dependencies.
- Must not mutate existing components beyond:
  - `src/app/layout.tsx` (mount the Chatbot)
  - `src/components/index.ts` (export)
  - `src/resources/icons.ts` (add a chat icon)
  - `.env.example`
- No localStorage or cookies — privacy-by-default.

## Edge cases

- `NEXT_PUBLIC_CHAT_URL` unset → render nothing, no network calls.
- Wrapper returns 503 → inline "offline" banner; send disabled 30s.
- Wrapper returns 401 (wrong `NEXT_PUBLIC_CHAT_TOKEN`) → banner "Chat is not available right now."
- Network error / CORS failure → same banner as 503.
- Streaming response ends unexpectedly → show what arrived; message is marked complete.
- Esc while streaming → close panel and abort the fetch.
- User submits empty or whitespace-only message → no-op.
- User submits > 2000 chars → client-side truncate or disable send; match wrapper's cap.

## Summary

A single React client component (`Chatbot.tsx`) that wraps the existing Once UI design system, streams responses from a local FastAPI proxy via SSE over POST+fetch, degrades gracefully when the backend is unavailable, and requires no changes to the rest of the site except a 1-line mount in `layout.tsx`.
