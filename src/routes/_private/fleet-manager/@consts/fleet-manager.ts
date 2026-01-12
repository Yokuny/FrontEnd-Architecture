export const MAP_THEMES = {
  DEFAULT: 'default',
  SMOOTH_DARK: 'smoothdark',
  EARTH: 'earth',
  RIVERS: 'rivers',
  SIMPLE: 'simple',
  PREMIUM: 'premium',
} as const;

export const FLEET_TABS = {
  ASSETS: 'assets',
  VOYAGES: 'voyages',
} as const;

export const PANEL_TYPES = {
  DETAILS: 'details',
  CREW: 'crew',
  CONSUME: 'consume',
  INFO: 'info',
} as const;

export const TYPE_VESSEL = {
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
} as const;

export const DEFAULT_MAP_CENTER: [number, number] = [-18.171396, -38.537897];
export const DEFAULT_MAP_ZOOM = 5;

export const DEFAULT_MEASURE_SPEED = 10;
export const METERS_IN_NAUTICAL_MILE = 1852;
export const METERS_IN_KILOMETER = 1000;

export const PLAYBACK_TYPES = {
  REGION: 'region',
  ROUTE: 'route',
} as const;
