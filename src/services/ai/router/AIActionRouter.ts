import { AIContext, AITool } from '../../types';

export class AIActionRouter {
  private tools: Map<string, AITool> = new Map();

  registerTool(tool: AITool) {
    this.tools.set(tool.name, tool);
  }

  async routeAndExecute(actionName: string, payload: unknown, context: AIContext) {
    // 1. Validate permissions based on context.role
    if (actionName.startsWith('admin_') && context.role !== 'admin') {
      throw new Error('Unauthorized action execution');
    }

    const tool = this.tools.get(actionName);
    if (!tool) {
      throw new Error(`Action ${actionName} is not supported or tool not registered.`);
    }

    try {
      // 2. Execute tool securely
      const result = await tool.execute(payload);
      
      // 3. Return structured workflow output
      return {
        success: true,
        action: actionName,
        result
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        action: actionName,
        error: err.message
      };
    }
  }
}
