"use client";

import { useEffect, useMemo, useState } from "react";
import { Column, Row, Text } from "@once-ui-system/core";
import type { Tiktoken } from "js-tiktoken/lite";

const DEFAULT_TEXT =
  "Tokenization is the first thing an LLM does to your text — even before it's a number.";

const PALETTE = [
  "#fde68a",
  "#bbf7d0",
  "#bae6fd",
  "#fbcfe8",
  "#ddd6fe",
  "#fed7aa",
  "#a7f3d0",
  "#fecaca",
];

type TokenView = { id: number; text: string };

export function TokenizerDemo({ defaultText = DEFAULT_TEXT }: { defaultText?: string }) {
  const [text, setText] = useState(defaultText);
  const [encoder, setEncoder] = useState<Tiktoken | null>(null);
  const [encoderError, setEncoderError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ Tiktoken }, ranks] = await Promise.all([
          import("js-tiktoken/lite"),
          import("js-tiktoken/ranks/o200k_base"),
        ]);
        if (cancelled) return;
        const enc = new Tiktoken(ranks.default);
        setEncoder(enc);
      } catch (err) {
        if (cancelled) return;
        setEncoderError((err as Error)?.message ?? "Failed to load tokenizer");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tokens: TokenView[] = useMemo(() => {
    if (!encoder) return [];
    try {
      const ids = encoder.encode(text);
      return ids.map((id) => ({ id, text: encoder.decode([id]) }));
    } catch {
      return [];
    }
  }, [encoder, text]);

  const charCount = text.length;
  const tokenCount = tokens.length;

  return (
    <Column
      fillWidth
      border="neutral-alpha-medium"
      background="neutral-alpha-weak"
      radius="l"
      padding="20"
      gap="16"
      marginTop="12"
      marginBottom="20"
    >
      <Row horizontal="between" vertical="center" wrap gap="8">
        <Text variant="label-strong-s" onBackground="brand-medium">
          Live tokenizer · GPT-4o (o200k_base)
        </Text>
        <Text variant="label-default-xs" onBackground="neutral-weak">
          {tokenCount} tokens · {charCount} characters
        </Text>
      </Row>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        spellCheck={false}
        style={{
          width: "100%",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: "0.95rem",
          lineHeight: 1.5,
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid var(--neutral-alpha-medium)",
          background: "var(--page-background)",
          color: "var(--neutral-on-background-strong)",
          resize: "vertical",
        }}
      />

      <Column gap="4">
        <Text variant="label-default-xs" onBackground="neutral-weak">
          Tokens (each coloured span is one token):
        </Text>
        <div
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: "0.95rem",
            lineHeight: 1.7,
            wordBreak: "break-word",
          }}
        >
          {encoderError && (
            <Text variant="body-default-s" onBackground="danger-medium">
              Tokenizer failed to load: {encoderError}
            </Text>
          )}
          {!encoder && !encoderError && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              Loading tokenizer…
            </Text>
          )}
          {tokens.map((tok, i) => (
            <span
              key={`${i}-${tok.id}`}
              title={`token id ${tok.id}`}
              style={{
                background: PALETTE[i % PALETTE.length],
                color: "#1f2937",
                padding: "1px 2px",
                borderRadius: 3,
                margin: "0 1px",
                whiteSpace: "pre-wrap",
              }}
            >
              {tok.text === "\n" ? "↵\n" : tok.text}
            </span>
          ))}
        </div>
      </Column>
    </Column>
  );
}
