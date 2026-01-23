import { LEVEL_NOTIFICATION } from "../../constants";

export const getColorLevel = (level) => {
  switch (level) {
    case LEVEL_NOTIFICATION.CRITICAL:
      return "colorDanger500";
    case LEVEL_NOTIFICATION.WARNING:
      return "colorWarning500";
    case LEVEL_NOTIFICATION.INFO:
      return "colorSuccess500";
    default:
      return "colorBasic500";
  }
};

export const getIconLevel = (level) => {
  switch (level) {
    case LEVEL_NOTIFICATION.CRITICAL:
      return "alert-triangle";
    case LEVEL_NOTIFICATION.WARNING:
      return "info";
    case LEVEL_NOTIFICATION.INFO:
      return "checkmark-circle-2";
    default:
      return "bell";
  }
};

export const getColorStatus = (level) => {
  switch (level) {
    case LEVEL_NOTIFICATION.CRITICAL:
      return "Danger";
    case LEVEL_NOTIFICATION.WARNING:
      return "Warning";
    case LEVEL_NOTIFICATION.INFO:
      return "Success";
    default:
      return "Basic";
  }
};
