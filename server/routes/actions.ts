import express, { Request, Response } from 'express';
import { AIActionRouter } from '../../src/services/ai/router/AIActionRouter';
import { customsCalculatorTool } from '../ai/tools/implementations/customsCalculator';
import { shipmentEstimatorTool } from '../ai/tools/implementations/shipmentEstimator';
import { tariffLookupTool } from '../ai/tools/implementations/tariffLookup';
import { notificationDispatcherTool } from '../ai/tools/implementations/notificationDispatcher';

export const actionRouter = express.Router();

const aiRouter = new AIActionRouter();
aiRouter.registerTool(customsCalculatorTool);
aiRouter.registerTool(shipmentEstimatorTool);
aiRouter.registerTool(tariffLookupTool);
aiRouter.registerTool(notificationDispatcherTool);

actionRouter.post('/execute', async (req: Request, res: Response) => {
  try {
    const { action, payload, context } = req.body;
    
    // Simulate real auth context logic
    const executionContext = {
      language: context?.language || 'ku',
      userId: context?.userId,
      role: context?.role || 'Guest',
    };

    const result = await aiRouter.routeAndExecute(action, payload, executionContext);
    res.json(result);
  } catch (error) {
    const err = error as Error;
    console.error("Action Execution Error:", err.message || err);
    res.status(500).json({ success: false, error: err.message || "Execution failed" });
  }
});
