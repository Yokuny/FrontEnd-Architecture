type FinancialStatus = 'pending' | 'partial' | 'paid' | 'refund' | 'canceled';

export type DbFinancial = {
  _id: string;
  Clinic: string;
  Patient: string;
  Professional: string;
  procedures: {
    _id?: string;
    procedure: string;
    price: number;
    status: FinancialStatus;
  }[];
  price: number;
  paid?: number;
  paymentMethod?: 'cash' | 'card' | 'pix' | 'transfer' | 'none';
  installments?: number;
  status: FinancialStatus;
  origin?: 'odontogram' | 'schedule';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FinancialList = {
  _id: string;
  Patient: string;
  createdAt: string;
};

export type PartialFinancial = {
  _id: string;
  patient: string;
  patientID: string;
  professionalID: string;
  status: FinancialStatus;
  price: number;
  procedures: string[];
  updatedAt: Date;
};

export type FullFinancial = DbFinancial & {
  patient: {
    _id: string;
    name: string;
    image: string;
    email: string;
    phone: string;
    cpf: string;
    rg: string;
    sex: string;
    birthdate: Date;
  };
};
