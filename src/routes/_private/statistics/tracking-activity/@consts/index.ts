import { getChartColor } from '@/components/ui/chart';

export const RM_ENTERPRISE_ID = 'ce21881c-6c0d-41b4-ace2-b0d846398b84';

export const DEFAULT_PERIOD_FILTER = 12;

export const PERIOD_OPTIONS = [
  { value: 12, label: '12 hours' },
  { value: 24, label: '24 hours' },
  { value: 168, label: '7 days' },
  { value: 360, label: '15 days' },
  { value: 720, label: '1 month' },
  { value: 4320, label: '2 months' },
  { value: 2160, label: '3 months' },
  { value: 12960, label: '6 months' },
  { value: 25920, label: '12 months' },
];

export const CHART_COLORS = {
  primary: getChartColor(1), // Blue
  chart1: getChartColor(1), // Blue
  chart2: getChartColor(14), // Emerald
  chart3: getChartColor(3), // Violet
  chart4: getChartColor(10), // Amber
  chart5: getChartColor(7), // Rose
};

export const DEVICE_COLORS = [getChartColor(1), getChartColor(14), getChartColor(3), getChartColor(10), getChartColor(7)];

export const CHART_HEIGHT = 'h-[350px]';
export const CHART_HEIGHT_LARGE = 'h-[400px]';

export const TOP_BAR_LIMIT = 10;
export const TOP_USER_LIMIT = 15;
