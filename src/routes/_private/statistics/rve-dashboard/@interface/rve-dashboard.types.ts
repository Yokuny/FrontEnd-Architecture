export interface OperationalCodeData {
  quantity: number;
  totalHoras: number;
  codigo: {
    value: string;
    label: string;
  };
}

export interface ScaleData {
  quantity: number;
  totalHoras: number;
  escala: {
    label: string;
  };
}

export interface RVEDashboardData {
  codigosOperacionais: OperationalCodeData[];
  escalas: ScaleData[];
}

export interface RVEDashboardFilters {
  machines?: string;
  initialDate?: string;
  finalDate?: string;
}
