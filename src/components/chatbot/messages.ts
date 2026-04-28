import type { Message, MessageRole } from "./types";

let _counter = 0;

export function newMessage(role: MessageRole, content: string, streaming = false): Message {
  _counter += 1;
  return {
    id: `${Date.now()}-${_counter}`,
    role,
    content,
    streaming,
  };
}

export function toWireHistory(
  messages: Message[],
): { role: MessageRole; content: string }[] {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }));
}
