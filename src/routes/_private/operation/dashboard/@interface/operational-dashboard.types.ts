export interface AssetOperationalRanking {
  machine: {
    id: string;
    name: string;
    image?: {
      url: string;
    };
  };
  status: string;
  startedAt: string;
  percentualOperating: number;
}
