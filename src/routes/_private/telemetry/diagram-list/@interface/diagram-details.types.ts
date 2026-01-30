export interface DiagramMarker {
  id: string;
  left: number;
  top: number;
  type: 'label' | 'on-off' | 'maintenance';
  description?: string;
  machine?: string;
  sensor?: string;
  equipment?: string;
  unit?: string;
  state?: string | number | boolean | null;
}

export interface DiagramData {
  id?: string;
  description?: string;
  image?: {
    url: string;
    data?: File;
    new?: boolean;
  } | null;
  data: DiagramMarker[];
  form?: {
    id: string;
    description: string;
    typeForm?: string;
  } | null;
  enterprises?: string[];
}

export interface SensorStateData {
  idMachine: string;
  idSensor: string;
  value: string | number | boolean | null;
  date?: string;
}

export interface EquipmentStatusData {
  machineId: string;
  equipment: string;
  status: 'success' | 'warning' | 'danger';
  dataConclusao?: string | null;
  manutencaoVencida?: string;
  tipoManutencao?: string;
}
