export interface AIContext {
  userId?: string;
  language: 'ku' | 'ar' | 'en';
  role?: string;
  workspaceState?: unknown;
  shipmentData?: unknown;
}

export interface AIMessage {
  role: 'user' | 'model' | 'system' | 'assistant';
  content: string;
}

export interface AIResponseStream {
  text: string;
  done: boolean;
}

export interface AITool {
  name: string;
  description: string;
  execute: (input: unknown) => Promise<unknown>;
}

export interface AIProvider {
  generateStream(messages: AIMessage[], context: AIContext, config?: unknown): AsyncGenerator<AIResponseStream, void, unknown>;
  name: string;
}
