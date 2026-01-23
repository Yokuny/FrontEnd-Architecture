import moment from "moment";
import { isDockingHeader, isRegularizationHeader } from "./Types";

export const canEditOS = (headerData, order, items) => {
  const hasPath = items.includes("/fas-new");
  if (isRegularizationHeader(headerData?.type)) {
    return hasPath && order?.state === "awaiting.bms"
  }
  else {
    return hasPath &&
      ["not.approved", "awaiting.create.confirm", "awaiting.request", "not.realized"].includes(order.state) &&
      new Date(headerData?.serviceDate) > new Date();
  }
}

export const canEditRating = (data) => {
  return ["awaiting.rating", "not.realized", "awaiting.bms", "awaiting.bms.confirm"].includes(data.state) && data.supplierData
}

export const canEditRecomendedSupplier = (items, data) => {
  return items?.includes("/fas-add-qsms") && ["supplier.canceled"].includes(data.state)
}

export const canEditRecommendedSupplierCount = (items, data) => {
  return items?.includes("/fas-add-qsms") && data.state === "awaiting.collaborators"
}

export const canEditFAS = (headerData, items, editFields) => {
  let canEdit = items?.includes("/fas-new") && !editFields
  return canEdit;
}

export const canTransferOrder = (items, data) => {
  return items.includes("/fas-remove") &&
    [
      "not.realized",
      "not.approved",
      "awaiting.create.confirm",
      "awaiting.request",
      "supplier.canceled",
      "awaiting.collaborators",
      "awaiting.rating"
    ].includes(data.state) && !isRegularizationHeader(data.fasHeader.type);
}

export const canBeNotRealizied = (data) => {
  // Check for the permission to rate
  const isStatusAllowed = [
    "awaiting.collaborators",
    "awaiting.rating",
    "awaiting.bms",
    "bms.refused"
  ].includes(data.state);
  return isStatusAllowed
}

export const canRate = (data, items) => {
  // Check for the permission to rate
  const isStatusAllowed = [
    "awaiting.rating",
    "awaiting.bms",
    "bms.refused",
    "awaiting.bms.confirm",
    "awaiting.buy.request",
    "awaiting.payment",
    "awaiting.invoice",
    "fas.closed",
  ].includes(data.state);
  return isStatusAllowed && items.includes("/fas-rate") && !data.rating
}

export const canEditOsRequestOrder = ({ state }) => {
  return ["supplier.canceled", "awaiting.request"].includes(state);
}

export const disableAddService = ({ type, serviceDate }) => {
  if (type && serviceDate) {
    return !(isRegularizationHeader(type) || isDockingHeader(type)) && moment(serviceDate).isBefore(moment(), 'day')
  }
  return true;
}

export const canAddRecommendedSupplier = (items, state, showRefusalReasonField, editRecommendedSupplier = false) => {

  return (
    state === "awaiting.create.confirm" &&
    items?.includes("/fas-add-qsms") &&
    !showRefusalReasonField
  ) ||
    (
      state === "supplier.canceled" &&
      editRecommendedSupplier
    )
}

export const canDeleteAttachment = ({ state }) => {
  return [
    "not.approved",
    "awaiting.create.confirm",
    "awaiting.request",
    "not.realized",
    "awaiting.collaborators",
    "awaiting.rating",
    "awaiting.bms",
    "awaiting.bms.confirm",
    "awaiting.contract.validation",
    "awaiting.sap",
    "awaiting.buy.request",
    "awaiting.invoice",
  ].includes(state);
}

export const canConfirmOs = (data, items) => {
  if (!data?.fasHeader?.serviceDate || !items?.length) return false;
  const isTodayAfterServiceDate = new Date(moment().format("YYYY-MM-DD")).getTime() > new Date(moment(data?.fasHeader?.serviceDate).format("YYYY-MM-DD")).getTime();
  return data?.state === "awaiting.create.confirm" &&
    items.includes("/fas-add-qsms") &&
    !isTodayAfterServiceDate;
}
