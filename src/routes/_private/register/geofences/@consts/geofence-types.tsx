import { Anchor, Box, Eye, HelpCircle, Map as MapIcon, MapPin, Navigation, Tent, Waves } from 'lucide-react';

export const TYPE_GEOFENCE = {
  ANCHORAGE: 'anchorage',
  BAR: 'bar',
  BASIN: 'basin',
  DANGER_NAVIGATION: 'dangerNavigation',
  FIELD: 'field',
  MONITORING: 'monitoring',
  PIER: 'pier',
  PORT: 'port',
  ROUTE: 'route',
  SHIPYARD: 'shipyard',
  WARN_NAVIGATION: 'warnNavigation',
  OTHER: 'other',
} as const;

export const GEOFENCE_TYPES_CONFIG = {
  [TYPE_GEOFENCE.PIER]: {
    icon: Box,
    color: 'text-info-500',
  },
  [TYPE_GEOFENCE.SHIPYARD]: {
    icon: Box,
    color: 'text-warning-700',
  },
  [TYPE_GEOFENCE.PORT]: {
    icon: Anchor,
    color: 'text-success-500',
  },
  [TYPE_GEOFENCE.ANCHORAGE]: {
    icon: Anchor,
    color: 'text-warning-500',
  },
  [TYPE_GEOFENCE.ROUTE]: {
    icon: Navigation,
    color: 'text-destructive',
  },
  [TYPE_GEOFENCE.BAR]: {
    icon: Waves,
    color: 'text-primary-500',
  },
  [TYPE_GEOFENCE.DANGER_NAVIGATION]: {
    icon: HelpCircle,
    color: 'text-primary-600',
  },
  [TYPE_GEOFENCE.WARN_NAVIGATION]: {
    icon: HelpCircle,
    color: 'text-primary-600',
  },
  [TYPE_GEOFENCE.BASIN]: {
    icon: Tent,
    color: 'text-info-500',
  },
  [TYPE_GEOFENCE.MONITORING]: {
    icon: Eye,
    color: 'text-primary-600',
  },
  [TYPE_GEOFENCE.FIELD]: {
    icon: MapIcon,
    color: 'text-info-500',
  },
  [TYPE_GEOFENCE.OTHER]: {
    icon: MapPin,
    color: 'text-primary-600',
  },
} as const;
