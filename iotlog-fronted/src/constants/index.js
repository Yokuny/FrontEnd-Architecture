export const STATUS_DISPOSITIVE = {
  ACTIVE: "active",
  PROBLEM: "problem",
  LOST_CONNECTION: "lostconnection",
};

export const LANGUAGES = [
  {
    value: "pt",
    label: "Português Brasil",
    locale: 'pt-br'
  },
  {
    value: "en",
    label: "English",
    locale: 'en'
  },
  {
    value: "es",
    label: "Español",
    locale: 'es'
  },
];

export const UNITY_LIFECYCLE = [
  {
    value: "hour",
    label: "hour.unity",
  },
  {
    value: "actions",
    label: "actions.unity",
  },
  {
    value: "meter",
    label: "meters.unity",
  },
]

export const STATUS_ORDER_SUPPORT = {
  OPEN: 'open',
  ATTENDANCE: 'attendance',
  MAINTENANCE: 'maintenance',
  WAITING_MAINTENANCE: "waiting_maintenance",
  ANALYSIS_MAINTENANCE: "analysis_maintenance",
  CLOSED: 'closed',
  SCHEDULE: 'schedule',
  WAITING_SCHEDULE: 'waiting_schedule',
  FINISHED_MAINTENANCE: 'finished_maintenance',
  CANCELED: 'canceled'
}

export const ACTIONS_SUPPORT = {
  TRANSFER: 'transfer'
}

export const PRIORITY = {
  LOW: {
    value: 0,
    description: 'low',
    color: '#6DD332'
  },
  MEDIUM: {
    value: 1,
    description: 'medium',
    color: '#FFB649'
  },
  HIGH: {
    value: 2,
    description: 'high',
    color: '#c4183c'
  },
}

export const PERMISSIONS_SUPPORT = {
  to_do_attendance: "to_do_attendance",
  manage_maintenance: "manage_maintenance",
  to_do_maintenance: "to_do_maintenance",
  view_closed: "view_closed",
  to_do_close: "to_do_close",
  transfer_user: "transfer_user",
  schedule_maintenance: "schedule_maintenance",
  confirm_schedule_maintenance: "confirm_schedule_maintenance",
  view_feedback: "view_feedback",
  all_type_problems: "all_type_problems",
  manager_support: "manager_support",
  cancel: "cancel"
}

export const LEVEL_NOTIFICATION = {
  CRITICAL: "critical",
  WARNING: "warning",
  INFO: "info",
};

export const CONDITIONS = {
  LESS_THAN: "lessThan",
  LESS_THAN_OR_EQUAL: "lessThanOrEqual",
  DIFFERENT: "different",
  GREAT_THAN: "greatThan",
  GREAT_THAN_OR_EQUAL: "greatThanOrEqual",
  EQUAL: 'equal',
  BETWEEN: 'between'
};

export const AREA_SAFETY = {
  WARN_1: 'warn_1',
  WARN_2: 'warn_2',
  INVADED: 'invaded'
};

export const TYPE_SENSOR_WEAR = {
  HORIMETER: 'horimeter',
  TRIGGER: 'trigger',
  ODOMETER: 'odometer'
};

export const TYPE_MAINTENANCE = {
  DATE: 'date',
  WEAR: 'wear',
  DATE_OR_WEAR: 'dateOrWear'
}

export const TYPE_TRAVEL = {
  TRAVEL: "travel",
  MANEUVER: "maneuver",
  MANUAL_VOYAGE: "manualVoyage"
}

export const TYPE_MACHINE = {
  SHIP: "ship",
  TRUCK: "truck",
  INDUSTRIAL: "industrial"
}

export const TYPE_TRAVEL_STATUS = {
  INIT_TRAVEL: "init_travel",
  FINISH_TRAVEL: "finish_travel"
}

export const TYPE_VESSSEL = {
  BULK_CARRIER: 'BULK_CARRIER',
  GAS_CARRIER: 'GAS_CARRIER',
  TANKER: 'TANKER',
  CONTAINER_SHIP: 'CONTAINER_SHIP',
  GENERAL_CARGO_SHIP: 'GENERAL_CARGO_SHIP',
  REFRIGERATED_CARGO_CARRIER: 'REFRIGERATED_CARGO_CARRIER',
  COMBINATION_CARRIER: 'COMBINATION_CARRIER',
  LNG_CARRIER: 'LNG_CARRIER',
  RO_RO_CARGO_SHIP: 'RO_RO_CARGO_SHIP',
  RO_RO_CARGO_SHIP_VC: 'RO_RO_CARGO_SHIP_VC',
  RO_RO_PASSENGER_SHIP: 'RO_RO_PASSENGER_SHIP',
  CRUISE_PASSENGER_SHIP: 'CRUISE_PASSENGER_SHIP',
}

export const TYPE_DIAGRAM = {
  UNIFILAR: 'UNIFILAR',
  UNIFILAR_4DG: 'UNIFILAR_4DG',
  PMS: 'PMS',
  ENGINEV16: 'ENGINEV16',
  AZIMUTAL: 'AZIMUTAL',
  CONSUMO: 'CONSUMO',
  BOW_THRUSTER: 'BOW THRUSTER'
}

export const IHM_SENSOR_TYPE = {
  TEMPERATURE: 'TEMPERATURE',
  STATUS: 'STATUS',
  LOAD: 'LOAD',
  INFO: 'INFO',
  AZIMUTH_INFO: 'AZIMUTH_INFO',
  GAUGE: 'GAUGE',
  BOW_THRUSTER_INFO: 'BOW_THRUSTER_INFO',
  SPEED: 'SPEED',
  TURBO_CHARGER_SPEED: 'TURBO_CHARGER_SPEED',
}

export const VARIABLE_TYPE_DESCRIPTION = {
  INT: "INT",
  DECIMAL: "DECIMAL",
  DOUBLE: "DOUBLE",
  GEO: "GEO (LAT, LON)",
  BOOL: "BOOLEAN",
  BOOL_NUMBER: "BOOLEAN NUMBER (0, 1)",
  STRING: "STRING",
  OBJECT: "OBJECT",
  ARRAY: "ARRAY"
};

export const VARIABLE_TYPE = {
  INT: "int",
  DECIMAL: "decimal",
  DOUBLE: "double",
  GEO: "geo",
  BOOL: "bool",
  BOOL_NUMBER: "bool_number",
  STRING: "string",
  OBJECT: "object",
  ARRAY: "array"
};
