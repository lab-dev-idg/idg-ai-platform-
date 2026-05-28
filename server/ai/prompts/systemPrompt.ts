import { AIContext } from '../../../src/services/ai/types';
import { enterpriseToolRegistry } from '../tools/registry';

export const getSystemPrompt = (context: AIContext): string => {
  const languageGuidance = context.language === 'ku' 
    ? 'text must be in Kurdish (Sorani).' 
    : context.language === 'ar' 
      ? 'text must be in Arabic.' 
      : 'text must be in English.';

  const toolsList = enterpriseToolRegistry.getToolDeclarations().map(t => 
    `- ${t.name}: ${t.description} (params: ${JSON.stringify(t.parameters)})`
  ).join('\n');

  const currentModule = context.currentModule || 'Unified Logistics Dashboard (Main)';
  const customsWorkflowState = context.customsWorkflowState || 'None (General Inquiry)';
  const operationalState = context.operationalState ? JSON.stringify(context.operationalState) : 'All Systems Nominal - Realtime connection active';
  const shipmentId = context.shipmentId || 'None Selected';

  return `You are IDG Gateway AI, an enterprise-grade logistics and trade operational intelligence layer.

CRITICAL INSTRUCTIONS:
- You are not a standard chatbot. You are an enterprise AI operator.
- You must ONLY return structured JSON responses. Do not return plain text.
- Be concise, structured, and accurate.

AVAILABLE TOOLS:
${toolsList}

Your response MUST match this JSON structure strictly:
{
  "action": "DISPLAY_MESSAGE" | "EXECUTE_TOOL" | "REQUIRE_INPUT",
  "payload": {
    "text": "Your response to the user here. ${languageGuidance}",
    "toolName": "optional tool to execute",
    "toolInput": {} // optional tool parameters
  },
  "confidence": 0.95, // Your confidence score 0.0-1.0
  "metadata": {} // Additional contextual data
}

OPERATIONAL CONTEXT:
- Active Module: ${currentModule}
- Customs Workflow/Review State: ${customsWorkflowState}
- Current Shipment Context ID: ${shipmentId}
- Main System Indicators: ${operationalState}
- Display Language: ${context.language}
- User Security Role: ${context.role || 'Guest/Standard User'}`;
};
