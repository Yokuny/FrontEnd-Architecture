import { isAfter, parseISO, startOfDay } from 'date-fns';
import { isRegularizationHeader } from '../../@utils/fas.utils';
import {
  DELETE_ATTACHMENT_ALLOWED_STATES,
  EDITABLE_OS_STATES,
  NOT_REALIZED_ALLOWED_STATES,
  OS_PERMISSION_PATHS,
  RATING_ALLOWED_STATES,
  TRANSFER_ALLOWED_STATES,
} from '../@consts/os.consts';
import type { FasOrderDetails, OsState } from '../@interface/os.schema';

type PermissionItems = string[];

/**
 * Check if OS can be edited
 */
export const canEditOS = (headerData: { type?: string; serviceDate?: string } | undefined, order: { state?: OsState } | undefined, items: PermissionItems): boolean => {
  if (!order?.state || !items?.length) return false;

  const hasPath = items.includes(OS_PERMISSION_PATHS.NEW);
  if (isRegularizationHeader(headerData?.type)) {
    return hasPath && order.state === 'awaiting.bms';
  }

  const isEditableState = (EDITABLE_OS_STATES as readonly string[]).includes(order.state);
  const isFutureDate = headerData?.serviceDate ? isAfter(parseISO(headerData.serviceDate), new Date()) : false;

  return hasPath && isEditableState && isFutureDate;
};

/**
 * Check if user can confirm OS
 */
export const canConfirmOs = (data: FasOrderDetails | undefined, items: PermissionItems): boolean => {
  if (!data?.fasHeader?.serviceDate || !items?.length) return false;

  const today = startOfDay(new Date());
  const serviceDate = startOfDay(parseISO(data.fasHeader.serviceDate));
  const isTodayAfterServiceDate = isAfter(today, serviceDate);

  return data.state === 'awaiting.create.confirm' && items.includes(OS_PERMISSION_PATHS.QSMS) && !isTodayAfterServiceDate;
};

/**
 * Check if user can add recommended supplier info
 */
export const canAddRecommendedSupplier = (items: PermissionItems, state: OsState | undefined, showRefusalReasonField: boolean, editRecommendedSupplier = false): boolean => {
  if (!state) return false;

  return (state === 'awaiting.create.confirm' && items.includes(OS_PERMISSION_PATHS.QSMS) && !showRefusalReasonField) || (state === 'supplier.canceled' && editRecommendedSupplier);
};

/**
 * Check if user can edit recommended supplier
 */
export const canEditRecommendedSupplier = (items: PermissionItems, data: FasOrderDetails | undefined): boolean => {
  if (!data) return false;
  return items.includes(OS_PERMISSION_PATHS.QSMS) && data.state === 'supplier.canceled';
};

/**
 * Check if user can edit recommended supplier count
 */
export const canEditRecommendedSupplierCount = (items: PermissionItems, data: FasOrderDetails | undefined): boolean => {
  if (!data) return false;
  return items.includes(OS_PERMISSION_PATHS.QSMS) && data.state === 'awaiting.collaborators';
};

/**
 * Check if user can rate the OS
 */
export const canRate = (data: FasOrderDetails | undefined, items: PermissionItems): boolean => {
  if (!data) return false;
  const isStatusAllowed = (RATING_ALLOWED_STATES as readonly string[]).includes(data.state);
  return isStatusAllowed && items.includes(OS_PERMISSION_PATHS.RATE) && !data.rating;
};

/**
 * Check if OS can be marked as not realized
 */
export const canBeNotRealized = (data: FasOrderDetails | undefined): boolean => {
  if (!data) return false;
  return (NOT_REALIZED_ALLOWED_STATES as readonly string[]).includes(data.state);
};

/**
 * Check if user can edit OS request order
 */
export const canEditOsRequestOrder = (state: OsState | undefined): boolean => {
  if (!state) return false;
  return ['supplier.canceled', 'awaiting.request'].includes(state);
};

/**
 * Check if user can transfer order
 */
export const canTransferOrder = (items: PermissionItems, data: FasOrderDetails | undefined): boolean => {
  if (!data?.fasHeader?.type) return false;
  const isStateAllowed = (TRANSFER_ALLOWED_STATES as readonly string[]).includes(data.state);
  return items.includes(OS_PERMISSION_PATHS.REMOVE) && isStateAllowed && !isRegularizationHeader(data.fasHeader.type);
};

/**
 * Check if user can delete attachment
 */
export const canDeleteAttachment = (state: OsState | undefined): boolean => {
  if (!state) return false;
  return (DELETE_ATTACHMENT_ALLOWED_STATES as readonly string[]).includes(state);
};

/**
 * Check if user can add supplier
 */
export const canAddSupplier = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.ADD_SUPPLIER) && ['awaiting.request', 'supplier.canceled'].includes(state);
};

/**
 * Check if user can cancel supplier
 */
export const canCancelSupplier = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.ADD_SUPPLIER) && state === 'awaiting.collaborators';
};

/**
 * Check if user can confirm BMS
 */
export const canConfirmBMS = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.QSMS) && state === 'awaiting.bms.confirm';
};

/**
 * Check if user can validate contract
 */
export const canValidateContract = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.VALIDATE_CONTRACT) && state === 'awaiting.contract.validation';
};

/**
 * Check if user can confirm SAP
 */
export const canConfirmSAP = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.CONFIRM_SAP) && state === 'awaiting.sap';
};

/**
 * Check if user can add buy request
 */
export const canAddBuyRequest = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.PURCHASE_ORDER) && state === 'awaiting.buy.request';
};

/**
 * Check if user can edit buy request
 */
export const canEditBuyRequest = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.PURCHASE_ORDER) && ['awaiting.invoice', 'awaiting.payment'].includes(state);
};

/**
 * Check if user can confirm payment
 */
export const canConfirmPayment = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.CONFIRM_PAYMENT) && state === 'awaiting.payment';
};

/**
 * Check if user can download invoice
 */
export const canDownloadInvoice = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.CONFIRM_PAYMENT) && ['awaiting.payment', 'fas.closed'].includes(state);
};

/**
 * Check if user can delete OS
 */
export const canDeleteOS = (items: PermissionItems, state: OsState | undefined): boolean => {
  if (!state) return false;
  return items.includes(OS_PERMISSION_PATHS.REMOVE) && state !== 'cancelled';
};

/**
 * Check if attachments can be added (not in closed states)
 */
export const canAddAttachment = (state: OsState | undefined): boolean => {
  if (!state) return false;
  return !['fas.closed', 'awaiting.payment', 'cancelled'].includes(state);
};
