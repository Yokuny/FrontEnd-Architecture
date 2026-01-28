import type { IntervalOption } from '../@interface/datalogger.types';

export const DEFAULT_INTERVAL_OPTIONS: IntervalOption[] = [
  { value: 1, label: '1 min' },
  { value: 2, label: '2 min' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '60 min' },
];

// Sensors that are not allowed for datalogger (text/navigation sensors)
export const SENSORS_NOT_ALLOWED = ['eta', 'destination', 'statusnavigation', 'currentport', 'nextport'];
