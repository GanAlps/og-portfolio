"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { toWireHistory } from "./messages";
import type { ChatStreamFrame, Message, SendOptions } from "./types";

interface UseChatStreamArgs {
  url: string;
  token?: string;
}

interface UseChatStreamResult {
  send: (messages: Message[], onDelta: (d: string) => void, onDone: (r: ChatStreamFrame["finish_reason"]) => void) => Promise<void>;
  abort: () => void;
  isStreaming: boolean;
  error: string | null;
  cooldownUntil: number;
  clearError: () => void;
}

const COOLDOWN_MS = 30_000;

export function useChatStream({ url, token }: UseChatStreamArgs): UseChatStreamResult {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  useEffect(() => () => abort(), [abort]);

  const send = useCallback<UseChatStreamResult["send"]>(
    async (messages, onDelta, onDone) => {
      abort();
      setError(null);
      setIsStreaming(true);

      const controller = new AbortController();
      controllerRef.current = controller;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["X-Chat-Token"] = token;

      let response: Response;
      try {
        response = await fetch(`${url.replace(/\/+$/, "")}/chat/stream`, {
          method: "POST",
          credentials: "omit",
          headers,
          body: JSON.stringify({ messages: toWireHistory(messages) }),
          signal: controller.signal,
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setIsStreaming(false);
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        setError("The chat service is offline right now. Try again later.");
        return;
      }

      if (response.status === 401) {
        setIsStreaming(false);
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        setError("Chat is not available right now.");
        return;
      }
      if (!response.ok || !response.body) {
        setIsStreaming(false);
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        setError("The chat service is offline right now. Try again later.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finishReason: ChatStreamFrame["finish_reason"] = "stop";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // Parse complete SSE frames: "data: {...}\n\n" (allow \r\n\r\n too).
          while (true) {
            const boundary = buffer.indexOf("\n\n");
            const boundaryAlt = buffer.indexOf("\r\n\r\n");
            const idx = boundaryAlt !== -1 && (boundary === -1 || boundaryAlt < boundary) ? boundaryAlt : boundary;
            if (idx === -1) break;
            const rawFrame = buffer.slice(0, idx);
            buffer = buffer.slice(idx + (idx === boundaryAlt ? 4 : 2));
            const dataLines = rawFrame
              .split(/\r?\n/)
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim());
            for (const payload of dataLines) {
              if (!payload) continue;
              try {
                const frame = JSON.parse(payload) as ChatStreamFrame;
                if (frame.delta) onDelta(frame.delta);
                if (frame.done) {
                  finishReason = frame.finish_reason ?? "stop";
                }
              } catch {
                // Ignore malformed frames — SSE comments like ": ping" are filtered out.
              }
            }
          }
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setIsStreaming(false);
          setCooldownUntil(Date.now() + COOLDOWN_MS);
          setError("The chat service was interrupted. Try again.");
          return;
        }
      }

      setIsStreaming(false);
      onDone(finishReason);
    },
    [abort, token, url],
  );

  const clearError = useCallback(() => setError(null), []);

  return { send, abort, isStreaming, error, cooldownUntil, clearError };
}
