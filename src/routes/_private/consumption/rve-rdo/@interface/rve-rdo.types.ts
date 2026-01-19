export interface RVERDOData {
  assets: Asset[];
  operations: Operation[];
  rdo: RDOData[];
}

export interface Asset {
  id: string;
  name: string;
  image: {
    url: string;
  };
}

export interface Operation {
  code: string;
  idAsset: string;
  dateStart: Date;
  dateEnd: Date;
  consumptionDailyContract: number;
}

export interface RDOData {
  idAsset: string;
  date: Date;
  consumptionEstimated: number;
}

export interface NormalizedOperation extends Operation {
  diffInHours: number;
  consumption: number;
}

export interface NormalizedRVERDO {
  idAsset: string;
  date: Date;
  consumptionEstimated?: number;
  operations: NormalizedOperation[];
}
