export type ProcedurePrices = {
  costPrice: number;
  suggestedPrice: number;
  savedPrice: number;
  periodicity?: number;
};

export type ProcedureData = ProcedurePrices & {
  procedure: string;
  group: string;
};

export type DbProcedure = {
  _id?: string;
  Clinic: string;
  procedures: ProcedureData[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProcedureSheet = {
  groupName: string;
  procedures: ProcedureData[];
};
