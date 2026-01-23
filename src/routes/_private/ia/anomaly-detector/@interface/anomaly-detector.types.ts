export interface AIAsset {
  asset: {
    id: string;
    name: string;
    image?: {
      url: string;
    };
    modelMachine?: {
      description: string;
    };
  };
  operation?: string;
  is_anomaly?: boolean;
  important_features?: Record<string, number>;
  anomaly_score?: number;
  status: 'ok' | 'warning' | 'anomaly' | 'off';
  order: number;
}

export interface AILastState {
  idMachine: string;
  idSensor: string;
  value: any;
  date: string;
}
