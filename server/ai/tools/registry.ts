import { customsCalculatorTool } from './implementations/customsCalculator';
import { shipmentEstimatorTool } from './implementations/shipmentEstimator';
import { tariffLookupTool } from './implementations/tariffLookup';
import { notificationDispatcherTool } from './implementations/notificationDispatcher';
import { ToolRegistry } from './ToolRegistry';

export const enterpriseToolRegistry = new ToolRegistry();

enterpriseToolRegistry.registerTool(customsCalculatorTool);
enterpriseToolRegistry.registerTool(shipmentEstimatorTool);
enterpriseToolRegistry.registerTool(tariffLookupTool);
enterpriseToolRegistry.registerTool(notificationDispatcherTool);
