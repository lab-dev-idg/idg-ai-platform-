import { AIContext, AIMessage, AIResponseStream, AIProvider } from '../../../src/services/ai/types';
import { ContextPipeline, ContextMiddleware } from '../../../src/services/ai/context/ContextPipeline';
import { getSystemPrompt } from '../prompts/systemPrompt';

export class ChatOrchestrator {
  private pipeline: ContextPipeline;

  constructor(private provider: AIProvider) {
    this.pipeline = new ContextPipeline();
    // Default middleware to inject system prompt
    this.pipeline.use(async (ctx: AIContext, msgs: AIMessage[]) => {
      const systemMessage: AIMessage = { role: 'system', content: getSystemPrompt(ctx) };
      return { context: ctx, messages: [systemMessage, ...msgs] };
    });
  }

  useMiddleware(middleware: ContextMiddleware) {
    this.pipeline.use(middleware);
  }

  async *streamResponse(messages: AIMessage[], context: AIContext): AsyncGenerator<AIResponseStream, void, unknown> {
    // 1. Run through pipeline
    const { context: enrichedContext, messages: finalMessages } = await this.pipeline.execute(context, messages);

    // 2. Pass to provider
    const stream = this.provider.generateStream(finalMessages, enrichedContext);

    // 3. Yield results
    for await (const chunk of stream) {
      yield chunk;
    }
  }
}
