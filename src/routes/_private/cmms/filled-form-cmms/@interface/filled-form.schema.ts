import { z } from 'zod';

export const filledFormSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
  machines: z.union([z.string(), z.array(z.string())]).optional(),
  initialDate: z.string().optional(),
  finalDate: z.string().optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
  tipoManutencao: z.union([z.string(), z.array(z.string())]).optional(),
  stockType: z.string().optional(),
  codigoOperacional: z.string().optional(),
  osCodeJobId: z.string().optional(),
  finishedAt: z.union([z.string(), z.boolean()]).optional(),
  equipmentCritical: z.string().optional(),
  inconsistenceType: z.string().optional(),
  // For KPI filtering
  firstForm: z.string().optional(),
  idForm: z.string().optional(),
});

export type FilledFormSearch = z.infer<typeof filledFormSearchSchema>;

export interface FilledFormColumn {
  name: string;
  description: string;
  datatype: string;
  properties?: {
    unit?: string;
  };
}

export interface FilledFormItem {
  id: string;
  isAllowEdit?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  data: Record<string, any>;
  user?: {
    name: string;
  };
  status?: string;
  headerContract?: string;
  fillAt?: string;
  userFill?: string;
}

export interface FilledFormResponse {
  data: FilledFormItem[];
  columns: FilledFormColumn[];
  pageInfo: {
    count: number;
  };
  typeForm: string;
  title?: string;
  idForm?: string;
  appliedPermissions?: {
    canFill: boolean;
    canDeleteFormBoard: boolean;
    canBlock: boolean;
    canEditFilling: boolean;
  };
  blocked?: boolean;
}

export interface CmmsActivityItem {
  text: string;
  total: number;
}

export interface CmmsActivitiesResponse {
  status: CmmsActivityItem[];
  typeMaintenance: CmmsActivityItem[];
}
