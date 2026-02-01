export const OS_STATES = {
  NOT_APPROVED: 'not.approved',
  AWAITING_CREATE_CONFIRM: 'awaiting.create.confirm',
  AWAITING_REQUEST: 'awaiting.request',
  SUPPLIER_CANCELED: 'supplier.canceled',
  AWAITING_COLLABORATORS: 'awaiting.collaborators',
  AWAITING_RATING: 'awaiting.rating',
  AWAITING_BMS: 'awaiting.bms',
  AWAITING_BMS_CONFIRM: 'awaiting.bms.confirm',
  BMS_REFUSED: 'bms.refused',
  AWAITING_CONTRACT_VALIDATION: 'awaiting.contract.validation',
  AWAITING_SAP: 'awaiting.sap',
  AWAITING_BUY_REQUEST: 'awaiting.buy.request',
  AWAITING_INVOICE: 'awaiting.invoice',
  AWAITING_PAYMENT: 'awaiting.payment',
  FAS_CLOSED: 'fas.closed',
  CANCELLED: 'cancelled',
  NOT_REALIZED: 'not.realized',
} as const;

export const OS_PERMISSION_PATHS = {
  QSMS: '/fas-add-qsms',
  ADD_SUPPLIER: '/fas-add-supplier',
  PURCHASE_ORDER: '/fas-add-purchase-order',
  CONFIRM_PAYMENT: '/fas-confirm-payment',
  VALIDATE_CONTRACT: '/fas-validate-contract',
  CONFIRM_SAP: '/fas-confirm-sap',
  RATE: '/fas-rate',
  REMOVE: '/fas-remove',
  NEW: '/fas-new',
} as const;

// States that allow editing the OS
export const EDITABLE_OS_STATES = ['not.approved', 'awaiting.create.confirm', 'awaiting.request', 'not.realized'] as const;

// States that allow "not realized" action
export const NOT_REALIZED_ALLOWED_STATES = ['awaiting.collaborators', 'awaiting.rating', 'awaiting.bms', 'bms.refused'] as const;

// States that allow rating
export const RATING_ALLOWED_STATES = [
  'awaiting.rating',
  'awaiting.bms',
  'bms.refused',
  'awaiting.bms.confirm',
  'awaiting.buy.request',
  'awaiting.payment',
  'awaiting.invoice',
  'fas.closed',
] as const;

// States that allow transferring an order
export const TRANSFER_ALLOWED_STATES = [
  'not.realized',
  'not.approved',
  'awaiting.create.confirm',
  'awaiting.request',
  'supplier.canceled',
  'awaiting.collaborators',
  'awaiting.rating',
] as const;

// States that allow deleting attachments
export const DELETE_ATTACHMENT_ALLOWED_STATES = [
  'not.approved',
  'awaiting.create.confirm',
  'awaiting.request',
  'not.realized',
  'awaiting.collaborators',
  'awaiting.rating',
  'awaiting.bms',
  'awaiting.bms.confirm',
  'awaiting.contract.validation',
  'awaiting.sap',
  'awaiting.buy.request',
  'awaiting.invoice',
] as const;

// Closed states (no more actions allowed)
export const CLOSED_STATES = ['fas.closed', 'awaiting.payment', 'cancelled'] as const;
