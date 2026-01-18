import { z } from 'zod';

export const searchSchema = z.object({
  idEnterprise: z.string().optional(),
  initialDate: z.string().optional(),
  finalDate: z.string().optional(),
  machines: z.string().optional(),
  status: z.string().optional(),
  tipoManutencao: z.string().optional(),
  equipmentCritical: z.string().optional(),
});

export type KPISCMMSFilters = z.infer<typeof searchSchema>;

export interface CMMSKPIItem {
  id: string;
  dataAbertura: string;
  dataConclusao?: string;
  tipoManutencao: string;
  manutencaoVencida: string;
  embarcacao: string;
  assetName?: string;
  grupoFuncional: string;
  [key: string]: any;
}
