import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { SENSOR_TYPE_OPTIONS } from '../@consts/sensor-types.consts';
import type { SensorData, SensorMinMaxConfig, SensorMinMaxState } from '../@interface/sensor-minmax.types';
import { formatSensorValue, sortSensorsByPriority } from '../@utils/sensor-minmax.utils';
import { SensorRowCells } from './sensor-row';

interface SensorTableProps {
  data: SensorData[];
  sensorsMinMax: SensorMinMaxState;
  onChangeMinMax: (idSensor: string, field: keyof SensorMinMaxConfig, value: number | boolean | null | undefined) => void;
  isLoading?: boolean;
}

export function SensorTable({ data, sensorsMinMax, onChangeMinMax, isLoading }: SensorTableProps) {
  const { t } = useTranslation();

  if (!data.length) return null;

  const sortedData = sortSensorsByPriority(data);

  const getTypeLabel = (type?: string) => {
    if (!type) return '';
    return SENSOR_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('description')}</TableHead>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">{t('type')}</TableHead>
            <TableHead className="text-center">{t('unit')}</TableHead>
            <TableHead className="text-center">{t('sensor.min')}</TableHead>
            <TableHead className="text-center">{t('maximum')}</TableHead>
            <TableHead className="text-center">{t('copy')}</TableHead>
            <TableHead className="text-center">{t('sensor.minInput')}</TableHead>
            <TableHead className="text-center">{t('sensor.maxInput')}</TableHead>
            <TableHead className="text-center">{t('alert')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((sensor) => (
            <TableRow key={sensor.idSensor}>
              <TableCell className="max-w-[250px]">{sensor.label}</TableCell>
              <TableCell className="max-w-[150px] break-all text-center">{sensor.idSensor}</TableCell>
              <TableCell className="text-center">{getTypeLabel(sensor.type)}</TableCell>
              <TableCell className="text-center">{sensor.unit || '-'}</TableCell>
              <TableCell className="text-center">{formatSensorValue(sensor.min, sensor.type)}</TableCell>
              <TableCell className="text-center">{formatSensorValue(sensor.max, sensor.type)}</TableCell>
              <SensorRowCells sensor={sensor} currentValues={sensorsMinMax[sensor.idSensor]} onChangeMinMax={onChangeMinMax} isLoading={isLoading} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
