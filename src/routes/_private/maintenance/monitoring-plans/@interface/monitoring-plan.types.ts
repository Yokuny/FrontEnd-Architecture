import type { TypeMaintenance } from '../@consts/maintenance.consts';

export interface MonitoringPlanItem {
  idMaintenancePlan: string;
  description: string;
  typeMaintenance: TypeMaintenance;
  dateWindowInit: string;
  dateWindowEnd: string;
  datePlanInit: string | null;
  datePlanEnd: string | null;
  dateDoneInit: string | null;
  dateDoneEnd: string | null;
  observation: string | null;
  wearCurrent: number | null;
  wearLimit: number | null;
}

export interface MonitoringMachine {
  idMachine: string;
  name: string;
  image: {
    url: string;
  } | null;
  enterprise: {
    id: string;
    name: string;
  };
  monitoringPlan: MonitoringPlanItem[];
}

export interface MonitoringPlansResponse {
  data: MonitoringMachine[];
  pageInfo: Array<{ count: number }>;
}

export interface MonitoringFilterParams {
  page: number;
  size: number;
  search?: string;
  idEnterprise?: string;
  idMachine?: string[];
  idMaintenancePlan?: string[];
  managers?: string[];
  status?: 'late' | 'next';
}

export interface EventScheduleEvent {
  id: string;
  title: string;
  machine: {
    id: string;
    name: string;
  };
  maintenancePlan?: {
    id: string;
    description: string;
  };
  dateWindowInit: string | null;
  dateWindowEnd: string | null;
  datePlanInit: string | null;
  datePlanEnd: string | null;
  dateDoneInit: string | null;
  dateDoneEnd: string | null;
  observation: string | null;
  idMachine: string;
  idMaintenancePlan: string;
  idEnterprise: string;
  eventType: string;
}
