export const TYPE_MAINTENANCE = {
  DATE: 'DATE',
  WEAR: 'WEAR',
  DATE_OR_WEAR: 'DATE_OR_WEAR',
} as const;

export const MONITORING_STATUS = {
  LATE: 'late',
  NEXT: 'next',
} as const;

export type TypeMaintenance = (typeof TYPE_MAINTENANCE)[keyof typeof TYPE_MAINTENANCE];
export type MonitoringStatus = (typeof MONITORING_STATUS)[keyof typeof MONITORING_STATUS];
