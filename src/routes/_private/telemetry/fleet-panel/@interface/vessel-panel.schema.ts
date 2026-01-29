import { z } from 'zod';

/**
 * Schema para search params da rota fleet-panel
 */
export const fleetPanelSearchSchema = z.object({
  idMachines: z.array(z.string()).optional(),
  idModels: z.array(z.string()).optional(),
  idMachine: z.string().optional(),
  name: z.string().optional(),
});

export type FleetPanelSearchParams = z.infer<typeof fleetPanelSearchSchema>;
