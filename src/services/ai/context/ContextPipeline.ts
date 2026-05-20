import { AIContext, AIMessage } from '../types';

export type ContextMiddleware = (context: AIContext, messages: AIMessage[]) => Promise<{ context: AIContext; messages: AIMessage[] }>;

export class ContextPipeline {
  private middlewares: ContextMiddleware[] = [];

  use(middleware: ContextMiddleware) {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(initialContext: AIContext, initialMessages: AIMessage[]): Promise<{ context: AIContext; messages: AIMessage[] }> {
    let currentContext = { ...initialContext };
    let currentMessages = [...initialMessages];

    for (const middleware of this.middlewares) {
      const result = await middleware(currentContext, currentMessages);
      currentContext = result.context;
      currentMessages = result.messages;
    }

    return { context: currentContext, messages: currentMessages };
  }
}
