import { useTranslation } from 'react-i18next';
import { CartesianGrid, ScatterChart as RechartsScatterChart, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from 'recharts';
import { getChartColor } from '@/components/ui/chart';
import { Item, ItemHeader, ItemTitle } from '@/components/ui/item';
import type { ScatterDataPoint, SensorOption } from '../@interface/performance.types';

interface ScatterChartProps {
  sensorX: SensorOption;
  sensorY: SensorOption;
  data: ScatterDataPoint[];
  index: number;
}

export function ScatterChart({ sensorX, sensorY, data, index }: ScatterChartProps) {
  const { t } = useTranslation();

  if (!data.length) {
    return (
      <Item variant="outline" className="flex h-80 items-center justify-center">
        <p className="text-muted-foreground">{t('no.data')}</p>
      </Item>
    );
  }

  return (
    <Item variant="outline" className="h-80 p-4">
      <ItemHeader className="mb-2 p-0">
        <ItemTitle className="font-normal text-sm">
          {sensorX.title || sensorX.label} x {sensorY.title || sensorY.label}
        </ItemTitle>
      </ItemHeader>

      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            type="number"
            dataKey="x"
            name={sensorX.title || sensorX.label}
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            label={{
              value: sensorX.title || sensorX.label,
              position: 'bottom',
              offset: 10,
              style: { fontSize: 11, fill: 'var(--muted-foreground)' },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={sensorY.title || sensorY.label}
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            label={{
              value: sensorY.title || sensorY.label,
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 11, fill: 'var(--muted-foreground)' },
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
            }}
            formatter={(value: number) => [value.toFixed(2), '']}
            labelFormatter={() => sensorY.label}
          />
          <Scatter name={sensorY.label} data={data} fill={getChartColor(index)} />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </Item>
  );
}
