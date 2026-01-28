/**
 * Fleet Panel Types
 * Tipos para os dados do painel de frota
 */

export interface VesselEngineLoad {
  value: number;
  unit: string;
}

export interface VesselEngineConsumption {
  value: number;
  unit: string;
}

export interface VesselEngine {
  title: string;
  isRunning: boolean;
  rpm?: number;
  load?: VesselEngineLoad;
  consumption?: VesselEngineConsumption;
  hoursOperation?: number;
}

export interface VesselGenerator {
  title: string;
  isRunning: boolean;
}

export interface VesselOilTank {
  type: string;
  volume: number;
  unit: string;
}

export interface VesselTree {
  lastUpdated: string;
  engineMain?: VesselEngine[];
  generator?: VesselGenerator[];
  oilTank?: VesselOilTank;
  location?: [number, number]; // [latitude, longitude]
}

export interface VesselImage {
  url: string;
}

export interface VesselPanelItem {
  id: string;
  name: string;
  image?: VesselImage;
  tree?: VesselTree;
}
