import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MachineSensor, SubgroupConfig } from '../@interface/heatmap.types';

export function SensorConfig({ sensors, data, onChangeSensorOnOff, onChangeSensors }: SensorConfigProps) {
  const { t } = useTranslation();

  const options: SensorOption[] = sensors
    .filter((x) => x)
    .map((x) => ({
      value: x.sensorId,
      sensorKey: x.sensorId,
      label: `${x.sensor} (${x.sensorId})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const selectedOnOff = data?.idSensorOnOff;
  const selectedSensors = data?.sensors?.map((x) => x.sensorKey) || [];

  const handleSensorToggle = (sensorId: string) => {
    const newSelection = selectedSensors.includes(sensorId) ? selectedSensors.filter((id) => id !== sensorId) : [...selectedSensors, sensorId];
    onChangeSensors(newSelection);
  };

  return (
    <div className="space-y-4 p-2">
      <div className="space-y-2">
        <ItemDescription className="font-medium text-foreground">{t('machine.equipment.subgroup.onoff')} *</ItemDescription>
        <Select value={selectedOnOff || ''} onValueChange={(value) => onChangeSensorOnOff(value || undefined)}>
          <SelectTrigger>
            <SelectValue placeholder={t('sensor.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <ItemDescription className="font-medium text-foreground">{t('sensors')}</ItemDescription>
        <div className="space-y-2 rounded-md border p-3">
          {options.length === 0 ? (
            <ItemDescription>{t('nooptions.message')}</ItemDescription>
          ) : (
            options.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSensors.includes(option.value)}
                  onChange={() => handleSensorToggle(option.value)}
                  className="size-4 rounded border-gray-300"
                />
                <ItemTitle className="font-normal">{option.label}</ItemTitle>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface SensorOption {
  value: string;
  label: string;
  sensorKey: string;
}

interface SensorConfigProps {
  sensors: MachineSensor[];
  data?: SubgroupConfig;
  onChangeSensorOnOff: (sensorId: string | undefined) => void;
  onChangeSensors: (sensorIds: string[]) => void;
}
