import { AITool } from '../../../src/services/ai/types';

export class ToolRegistry {
  private tools: Map<string, AITool> = new Map();

  registerTool(tool: AITool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): AITool | undefined {
    return this.tools.get(name);
  }

  getToolDeclarations() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      // Default to string for simplicity, can be expanded to full JSON schema
      parameters: {
        type: 'OBJECT',
        properties: {
          input: {
            type: 'STRING',
            description: 'JSON encoded string containing parameters'
          }
        },
        required: ['input']
      }
    }));
  }

  async executeTool(name: string, input: unknown): Promise<unknown> {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    // Wrap execution with context evaluation if needed
    try {
      return await tool.execute(input);
    } catch (e) {
      const err = e as Error;
      return { error: err.message };
    }
  }
}
