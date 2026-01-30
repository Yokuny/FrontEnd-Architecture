import { Bell, BellOff, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell } from '@/components/ui/table';
import { BOOLEAN_TYPES, EDITABLE_TYPES } from '../@consts/sensor-types.consts';
import type { SensorData, SensorMinMaxConfig } from '../@interface/sensor-minmax.types';

interface SensorRowCellsProps {
  sensor: SensorData;
  currentValues?: SensorMinMaxConfig;
  onChangeMinMax: (idSensor: string, field: keyof SensorMinMaxConfig, value: number | boolean | null | undefined) => void;
  isLoading?: boolean;
}

export function SensorRowCells({ sensor, currentValues, onChangeMinMax, isLoading }: SensorRowCellsProps) {
  const { t } = useTranslation();
  const [min, setMin] = useState<string>(currentValues?.min?.toString() || '');
  const [max, setMax] = useState<string>(currentValues?.max?.toString() || '');

  useEffect(() => {
    setMin(currentValues?.min?.toString() || '');
    setMax(currentValues?.max?.toString() || '');
  }, [currentValues]);

  // Debounced min update
  useEffect(() => {
    const handler = setTimeout(() => {
      const parsed = min === '' ? null : Number(min);
      if (parsed !== currentValues?.min) {
        onChangeMinMax(sensor.idSensor, 'min', parsed);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [min, sensor.idSensor, onChangeMinMax, currentValues?.min]);

  // Debounced max update
  useEffect(() => {
    const handler = setTimeout(() => {
      const parsed = max === '' ? null : Number(max);
      if (parsed !== currentValues?.max) {
        onChangeMinMax(sensor.idSensor, 'max', parsed);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [max, sensor.idSensor, onChangeMinMax, currentValues?.max]);

  const handleCopy = () => {
    setMin(sensor.min?.toString() || '');
    setMax(sensor.max?.toString() || '');
  };

  const toggleAlert = () => {
    onChangeMinMax(sensor.idSensor, 'isAlert', !currentValues?.isAlert);
  };

  const hasValue = (v: number | null | undefined) => v !== null && v !== undefined;
  const isEditable = sensor.type && EDITABLE_TYPES.includes(sensor.type as (typeof EDITABLE_TYPES)[number]);
  const isBooleanType = sensor.type && BOOLEAN_TYPES.includes(sensor.type as (typeof BOOLEAN_TYPES)[number]);

  // Non-editable types: empty cells
  if (sensor.type && !isEditable) {
    return (
      <>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
      </>
    );
  }

  // Boolean types: show select for notify condition
  if (isBooleanType) {
    return (
      <>
        <TableCell />
        <TableCell colSpan={2}>
          <Select
            value={currentValues?.booleanNotify === true ? 'true' : currentValues?.booleanNotify === false ? 'false' : ''}
            onValueChange={(v) => onChangeMinMax(sensor.idSensor, 'booleanNotify', v === '' ? null : v === 'true')}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={t('select.notify.condition')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t('notify.when.true')}</SelectItem>
              <SelectItem value="false">{t('notify.when.false')}</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="text-center">
          {currentValues?.booleanNotify !== null && currentValues?.booleanNotify !== undefined && (
            <Button variant="ghost" size="sm" onClick={toggleAlert} className={currentValues?.isAlert ? 'text-warning' : 'text-muted-foreground'}>
              {currentValues?.isAlert ? <Bell className="size-4" /> : <BellOff className="size-4" />}
              <span className="ml-1">{currentValues?.isAlert ? 'ON' : 'OFF'}</span>
            </Button>
          )}
        </TableCell>
      </>
    );
  }

  // Numeric types: min/max inputs
  return (
    <>
      <TableCell className="text-center">
        <Button variant="ghost" size="icon" className="size-8" onClick={handleCopy} disabled={isLoading}>
          <Copy className="size-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Input type="number" value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min" className="h-8 w-24 text-right" disabled={isLoading} />
      </TableCell>
      <TableCell>
        <Input type="number" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max" className="h-8 w-24 text-right" disabled={isLoading} />
      </TableCell>
      <TableCell className="text-center">
        {(hasValue(currentValues?.min) || hasValue(currentValues?.max)) && (
          <Button variant="ghost" size="sm" onClick={toggleAlert} className={currentValues?.isAlert ? 'text-warning' : 'text-muted-foreground'}>
            {currentValues?.isAlert ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            <span className="ml-1">{currentValues?.isAlert ? 'ON' : 'OFF'}</span>
          </Button>
        )}
      </TableCell>
    </>
  );
}
