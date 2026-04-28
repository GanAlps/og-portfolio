export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  streaming?: boolean;
}

export interface ChatStreamFrame {
  delta?: string;
  done?: boolean;
  finish_reason?: "stop" | "length" | "error" | "refused";
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export interface SendOptions {
  history: Message[];
  signal: AbortSignal;
  onDelta: (delta: string) => void;
  onDone: (finishReason: ChatStreamFrame["finish_reason"]) => void;
  onError: (message: string) => void;
}
