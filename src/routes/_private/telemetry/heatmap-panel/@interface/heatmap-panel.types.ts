export interface HeatmapMachine {
  id: string;
  name: string;
  image?: {
    url?: string;
  };
}

export interface HeatmapEquipment {
  name: string;
  status: string;
  assetId: string;
  insightId: string;
}

export interface HeatmapSubgroup {
  option?: string;
  name?: string;
  status?: string;
  equipments?: HeatmapEquipment[];
}

export interface HeatmapGroup {
  code: string;
  subgroups?: HeatmapSubgroup[];
}

export interface HeatmapColumn {
  name: string;
  code: string;
  subgroups?: { option?: string }[];
}

export interface HeatmapRow {
  machine: HeatmapMachine;
  groups?: HeatmapGroup[];
}

export interface HeatmapTotals {
  working: number;
  inalert: number;
  warning: number;
  stopped: number;
  off: number;
}

export interface HeatmapData {
  columns: HeatmapColumn[];
  data: HeatmapRow[];
  total?: HeatmapTotals;
  lastUpdate?: string;
}

export interface TrackerItem {
  isEmpty?: boolean;
  status?: string;
  tooltip?: string;
  data?: HeatmapSubgroup;
  machine?: HeatmapMachine;
}
