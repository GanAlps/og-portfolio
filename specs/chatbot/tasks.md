# Portfolio Chatbot UI — Tasks

- [ ] T-01 Add `NEXT_PUBLIC_CHAT_URL` and `NEXT_PUBLIC_CHAT_TOKEN` to `.env.example`
- [ ] T-02 Add `chat` icon to `src/resources/icons.ts`
- [ ] T-03 Create `src/components/chatbot/types.ts`
- [ ] T-04 Create `src/components/chatbot/messages.ts`
- [ ] T-05 Create `src/components/chatbot/useChatStream.ts` (fetch + SSE reader + abort)
- [ ] T-06 Create `src/components/Chatbot.module.scss` (FAB + panel + mobile fullscreen)
- [ ] T-07 Create `src/components/Chatbot.tsx` (env-gated render + state + a11y)
- [ ] T-08 Export `Chatbot` from `src/components/index.ts`
- [ ] T-09 Mount `<Chatbot />` in `src/app/layout.tsx`
- [ ] T-10 Update root `README.md` with chatbot section
- [ ] T-11 Update `CLAUDE.md` with chatbot docs
- [ ] T-12 Manual verification: portfolio question, off-topic refusal, offline banner, mobile, Esc to close
