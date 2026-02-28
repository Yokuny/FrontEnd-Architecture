export type ToothStatus = 'normal' | 'restored' | 'caries' | 'missing' | 'implant' | 'periodontitis' | 'prosthesis' | 'extracted' | 'other';

export type OdontogramTooth = {
  number: number;
  faces: ToothFace;
  status?: ToothStatus;
};

export type DbOdontogram = {
  _id: string;
  Clinic: string;
  Patient: string;
  Professional: string;
  Financial?: string;
  teeth: OdontogramTooth[];
  finished: boolean;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PartialOdontogram = {
  _id: string;
  patient: string;
  patientID: string;
  professionalID: string;
  Financial: string;
  finished: boolean;
  createdAt: Date;
  procedureCount?: number;
};

export type OdontogramList = {
  _id: string;
  Patient: string;
  createdAt: string;
};

export type Procedure = {
  procedure: string;
  price: number;
  status: 'pending' | 'partial' | 'paid' | 'refund' | 'canceled';
  periodicity?: number;
};

export type ToothFaces = {
  facial?: Procedure; // -> face voltada para a bochecha
  lingual?: Procedure; // -> face voltada para a língua
  palatal?: Procedure; // -> face voltada para língua na parte de cima da boca
  mesial?: Procedure; // -> face apontando para a divisão, ao dividir o corpo ao meio
  distal?: Procedure; // -> face apontando para longe da divisão, ao dividir o corpo ao meio
  occlusal?: Procedure; // -> face de mastigação
  incisal?: Procedure; // -> face de corte
};

export type ToothFace = {
  facial?: string;
  incisal?: string;
  lingual?: string;
  mesial?: string;
  distal?: string;
  occlusal?: string;
  palatal?: string;
};

export type ToothFaceSelect = {
  center: boolean;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};
