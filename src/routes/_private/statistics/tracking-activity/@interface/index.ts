export interface TrackingFilters {
  lastPeriodHours: number;
  idEnterprise?: string;
  'idUsers[]'?: string[];
  'idUsersNotIncluded[]'?: string[];
}

export interface AccessDayData {
  acessDay: { date: string; total: number }[];
  acessDayWhatsapp: { date: string; total: number }[];
}

export interface UserAccessDayData {
  usersDay: { date: string; total: number }[];
  usersDayWhatsapp: { date: string; total: number }[];
}

export interface UserRMDayData {
  accessRMDay: { date: string; total: number }[];
  usersRMDay: { date: string; total: number }[];
}

export interface BrowserInfo {
  osName?: string;
  os?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
}

export interface DeviceData {
  device?: string;
  info?: BrowserInfo;
  total: number;
}

export interface LocationData {
  location?: {
    city?: string;
    state?: string;
    country_code?: string;
  };
  total: number;
}

export interface TrackingPathData {
  pathname?: string;
  path?: string;
  total: number;
}

export interface TrackingUserData {
  user?: string;
  total: number;
}

export interface ActionsFleetData {
  action?: string;
  description?: string;
  total: number;
}
