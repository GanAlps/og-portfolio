"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Button, Column, Heading, IconButton, Row, Text } from "@once-ui-system/core";

import styles from "./Chatbot.module.scss";
import { newMessage } from "./chatbot/messages";
import { useChatStream } from "./chatbot/useChatStream";
import type { Message } from "./chatbot/types";

const MAX_INPUT_CHARS = 2000;
const EMPTY_HINT = "Ask about Osho's experience, projects, or writing.";

export const Chatbot = () => {
  const url = process.env.NEXT_PUBLIC_CHAT_URL;
  const token = process.env.NEXT_PUBLIC_CHAT_TOKEN;

  if (!url) return null;
  return <ChatbotInner url={url} token={token} />;
};

interface ChatbotInnerProps {
  url: string;
  token: string | undefined;
}

const ChatbotInner = ({ url, token }: ChatbotInnerProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fabRef = useRef<HTMLButtonElement | null>(null);

  const { send, abort, isStreaming, error, cooldownUntil, clearError } = useChatStream({
    url,
    token,
  });

  const inCooldown = now < cooldownUntil;

  useEffect(() => {
    if (!inCooldown) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [inCooldown]);

  const close = useCallback(() => {
    setOpen(false);
    abort();
    setTimeout(() => fabRef.current?.focus(), 0);
  }, [abort]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const el = messageListRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming || inCooldown) return;
    clearError();

    const user = newMessage("user", text);
    const assistant = newMessage("assistant", "", true);
    const nextMessages = [...messages, user, assistant];
    setMessages(nextMessages);
    setInput("");

    await send(
      [...messages, user],
      (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.id === assistant.id) {
            next[next.length - 1] = { ...last, content: last.content + delta };
          }
          return next;
        });
      },
      (finish) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.id === assistant.id) {
            next[next.length - 1] = {
              ...last,
              streaming: false,
              content:
                last.content.trim().length > 0
                  ? last.content
                  : finish === "error"
                    ? "(no response from the chat service)"
                    : last.content,
            };
          }
          return next;
        });
      },
    );
  }, [clearError, inCooldown, input, isStreaming, messages, send]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend],
  );

  const handleClear = useCallback(() => {
    if (isStreaming) return;
    setMessages([]);
    clearError();
  }, [clearError, isStreaming]);

  const cooldownSeconds = useMemo(
    () => (inCooldown ? Math.ceil((cooldownUntil - now) / 1000) : 0),
    [cooldownUntil, inCooldown, now],
  );

  if (!open) {
    return (
      <div className={styles.fab}>
        <IconButton
          ref={fabRef as never}
          icon="chat"
          variant="primary"
          size="l"
          tooltip="Open chat assistant"
          aria-label="Open chat assistant"
          onClick={() => setOpen(true)}
        />
      </div>
    );
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      className={styles.panel}
    >
      <Row
        className={styles.header}
        paddingX="16"
        paddingY="12"
        vertical="center"
        horizontal="between"
        gap="8"
      >
        <Heading as="h2" id="chat-title" variant="heading-strong-s">
          Ask the portfolio
        </Heading>
        <Row gap="4">
          <IconButton
            icon="refresh"
            variant="tertiary"
            size="s"
            tooltip="Clear conversation"
            aria-label="Clear conversation"
            onClick={handleClear}
            disabled={isStreaming || messages.length === 0}
          />
          <IconButton
            icon="close"
            variant="tertiary"
            size="s"
            tooltip="Close chat"
            aria-label="Close chat"
            onClick={close}
          />
        </Row>
      </Row>
      <div
        ref={messageListRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className={styles.messages}
      >
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {EMPTY_HINT}
            </Text>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user"
                  ? `${styles.message} ${styles.userMessage}`
                  : `${styles.message} ${styles.assistantMessage}`
              }
            >
              <Text as="p" variant="body-default-s">
                {m.content || (m.streaming ? "…" : "")}
              </Text>
            </div>
          ))
        )}
      </div>
      {error && (
        <div role="status" className={styles.banner}>
          <Text variant="body-default-s">
            {error}
            {inCooldown ? ` Retry in ${cooldownSeconds}s.` : ""}
          </Text>
        </div>
      )}
      <Column className={styles.composer} gap="8">
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder={EMPTY_HINT}
          maxLength={MAX_INPUT_CHARS}
          rows={2}
          disabled={isStreaming}
          aria-label="Message input"
        />
        <Row gap="8" vertical="center" horizontal="end">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            {input.length}/{MAX_INPUT_CHARS}
          </Text>
          <Button
            variant="primary"
            size="s"
            onClick={() => void handleSend()}
            disabled={!input.trim() || isStreaming || inCooldown}
          >
            {isStreaming ? "Sending…" : "Send"}
          </Button>
        </Row>
      </Column>
    </section>
  );
};
