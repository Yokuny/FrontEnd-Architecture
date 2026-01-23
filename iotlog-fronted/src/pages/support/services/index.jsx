import { STATUS_ORDER_SUPPORT, PRIORITY } from "../../../constants";

export const getStatus = (status) => {
  switch (status) {
    case STATUS_ORDER_SUPPORT.OPEN:
      return {
        textId: "order.support.open",
        badge: "Warning",
      };
    case STATUS_ORDER_SUPPORT.ATTENDANCE:
      return {
        textId: "order.support.attendance",
        badge: "Primary",
      };
    case STATUS_ORDER_SUPPORT.WAITING_MAINTENANCE:
      return {
        textId: "order.support.waiting.maintenance",
        badge: "Danger",
      };
    case STATUS_ORDER_SUPPORT.MAINTENANCE:
      return {
        textId: "order.support.maintenance",
        badge: "Info",
      };
    case STATUS_ORDER_SUPPORT.CLOSED:
      return {
        textId: "order.support.closed",
        badge: "Success",
      };
    case STATUS_ORDER_SUPPORT.WAITING_SCHEDULE:
      return {
        textId: "order.support.waiting.schedule",
        badge: "Info",
      };
    case STATUS_ORDER_SUPPORT.SCHEDULE:
      return {
        textId: "order.support.schedule",
        badge: "Danger",
      };
    case STATUS_ORDER_SUPPORT.ANALYSIS_MAINTENANCE:
      return {
        textId: "analysis.maintenance",
        badge: "Warning",
      };
    case STATUS_ORDER_SUPPORT.FINISHED_MAINTENANCE:
      return {
        textId: "finished.maintenance",
        badge: "Success",
      };
    default:
      return undefined;
  }
};

export const getPriorities = (priorityFind) => {
  return Object.keys(PRIORITY)
    .map((x) => PRIORITY[x])
    .find((x) => x.value == priorityFind);
};

export const isEmpty = (obj) => {
  return (typeof obj === "undefined"
    || obj === null
    || Object.keys(obj).length === 0);
}
