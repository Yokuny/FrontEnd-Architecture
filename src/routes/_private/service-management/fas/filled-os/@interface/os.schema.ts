import { z } from 'zod';

export const osSearchSchema = z.object({
  edit: z.boolean().optional(),
  transfer: z.boolean().optional(),
  editRecSup: z.boolean().optional(),
});

export type OsSearch = z.infer<typeof osSearchSchema>;

// States da OS
export const OS_STATES = [
  'not.approved',
  'awaiting.create.confirm',
  'awaiting.request',
  'supplier.canceled',
  'awaiting.collaborators',
  'awaiting.rating',
  'awaiting.bms',
  'awaiting.bms.confirm',
  'bms.refused',
  'awaiting.contract.validation',
  'awaiting.sap',
  'awaiting.buy.request',
  'awaiting.invoice',
  'awaiting.payment',
  'fas.closed',
  'cancelled',
  'not.realized',
] as const;

export type OsState = (typeof OS_STATES)[number];

// Supplier Data
export interface SupplierData {
  razao?: string;
  codigoFornecedor?: number;
  emails?: string[];
  cancelled?: boolean;
  addedBy?: string;
}

// Collaborator
export interface Collaborator {
  _id?: string;
  code?: string;
  name?: string;
  role?: string;
  AsoExpirationDate?: string;
  valid?: boolean;
  isNew?: boolean;
}

// File
export interface OsFile {
  name: string;
  location?: string;
  supplierCanView?: boolean;
}

// Event
export interface OsEvent {
  id: string;
  type: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

// BMS Expense
export interface BmsExpense {
  _id?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  expense?: string;
  collaborator_name?: string;
  role?: string;
  unit?: string;
  value?: number;
  amount?: number;
  total?: number;
  additional_info?: string;
}

// BMS Data
export interface BmsData {
  main_expenses?: BmsExpense[];
  other_expenses?: BmsExpense[];
  refusalReason?: string;
}

// FAS Header (minimal for OS details)
export interface FasHeaderMinimal {
  id: string;
  type?: string;
  serviceDate?: string;
  local?: string;
  teamChange?: boolean;
  vessel?: {
    name?: string;
    image?: { url?: string };
  };
  enterprise?: {
    id: string;
  };
}

// Main OS Details interface
export interface FasOrderDetails {
  id: string;
  name: string;
  state: OsState;
  description?: string;
  materialFas?: string;
  materialFasCode?: string;
  onboardMaterial?: string;
  rmrb?: string;
  rmrbCode?: string;
  job?: string;
  requestOrder?: string;
  vor?: string;
  recommendedSupplier?: string;
  recommendedSupplierCount?: number;
  confirmObservation?: string;
  osInsurance?: boolean;
  osDowntime?: boolean;
  rating?: string;
  ratingDescription?: string;
  partial?: string;
  questions?: Record<string, { value: string }>;
  buyRequest?: string;
  paymentDate?: string;

  // Relationships
  fasHeader?: FasHeaderMinimal;
  supplierData?: SupplierData;
  collaborators?: Collaborator[];
  files?: OsFile[];
  events?: OsEvent[];
  bms?: BmsData;

  // Reason histories
  cancelReason?: string[];
  notRealizedReason?: string[];
  supplierRejectReason?: string[];
  transferReason?: string[];
  returnReason?: string[];
  osRefusalReason?: string;
  osRefusalHistory?: string[];
  rejectInvoiceReason?: string[];
  rejectContractReason?: string[];
  rejectSapReason?: string[];
  oldBMSRefusalReason?: string[];
}
