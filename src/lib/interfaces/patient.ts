import type { DbFinancial } from './financial.js';
import type { DbOdontogram, ToothStatus } from './odontogram.js';
import type { DbSchedule } from './schedule.js';
import type { NewAnamnesis, NewIntraoral } from './schemas/patient.schema.js';

export type PhoneData = {
  number: string;
  tag: string;
};

export type PartialPatient = {
  _id: string;
  name: string;
  image?: string;
  phone1: string;
  phone2: string;
  email?: string;
  sex: 'M' | 'F';
};

export type Anamnesis = NewAnamnesis & {
  createdAt: Date;
  updatedAt: Date;
};

export type Intraoral = NewIntraoral & {
  createdAt: Date;
  updatedAt: Date;
};

export type Tooth = {
  number: number;
  status: ToothStatus;
};

export type DbPatient = {
  _id: string;
  Clinic: string;
  name: string;
  email?: string;
  cpf?: string;
  rg?: string;
  birthdate?: Date | string;
  sex: 'M' | 'F';
  phone?: PhoneData[];
  cep?: string;
  address?: string;
  anamnesis?: Anamnesis;
  intraoral?: Intraoral;
  odontogram: Tooth[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FullPatient = DbPatient & {
  financials: DbFinancial[];
  odontograms: DbOdontogram[];
  schedules: DbSchedule[];
};
