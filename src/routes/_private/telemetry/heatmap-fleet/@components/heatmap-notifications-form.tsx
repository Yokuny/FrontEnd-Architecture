import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import type { HeatmapAlert } from '../@interface/heatmap.types';

interface HeatmapNotificationsFormProps {
  sensor: {
    key: string;
    onOff: boolean; // From config (is this sensor enabled in heatmap?)
  };
  sensorData: {
    id: string; // Sensor ID
    sensor: string; // Sensor Name
    type: string;
  };
  currentAlert?: HeatmapAlert;
  onUpdate: (alert: HeatmapAlert) => void;
}

export function HeatmapNotificationsForm({ sensor, sensorData, currentAlert, onUpdate }: HeatmapNotificationsFormProps) {
  const { t } = useTranslation();

  // Local state for immediate feedback
  const [alert, setAlert] = useState<HeatmapAlert>(
    currentAlert ||
      ({
        idSensor: sensorData.id,
        idAlert: crypto.randomUUID(), // Generate new ID if not exists
        minValue: undefined,
        maxValue: undefined,
        onOffValue: 'off',
        alertMin: false,
        alertMax: false,
        alertOnOff: false,
        alertDangerMin: false, // Internal UI state for validation
        alertDangerMax: false, // Internal UI state for validation
      } as any), // Cast to avoid TS issues with extra UI props if we stored them in alert object, but better to keep separate
  );

  const [validationErrors, setValidationErrors] = useState({
    min: false,
    max: false,
  });

  useEffect(() => {
    if (currentAlert) {
      setAlert(currentAlert);
    }
  }, [currentAlert]);

  const handleChange = (field: keyof HeatmapAlert, value: any) => {
    const newAlert = { ...alert, [field]: value };

    // Validation logic from legacy
    const newErrors = { ...validationErrors };

    if (field === 'minValue') {
      newErrors.min = false;
    }
    if (field === 'maxValue') {
      newErrors.max = false;
    }

    // Toggle/Checkbox logic for enabling alerts checks if value exists
    if (field === 'alertMin' && value === true && !newAlert.minValue) {
      newErrors.min = true;
      // Don't update alertMin if invalid? Legacy just showed danger status.
      // We'll update but show error.
    }
    if (field === 'alertMax' && value === true && !newAlert.maxValue) {
      newErrors.max = true;
    }

    setValidationErrors(newErrors);
    setAlert(newAlert);
    onUpdate(newAlert);
  };

  const handleToggle = (checked: boolean) => {
    handleChange('onOffValue', checked ? 'on' : 'off');
  };

  return (
    <div className="flex w-full flex-col gap-4 py-2 sm:flex-row sm:items-center">
      <div className="w-full sm:w-1/4">
        <ItemTitle>{sensorData.sensor}</ItemTitle>
      </div>

      {sensor.onOff ? (
        // Switch Logic (if sensor is boolean/on-off type)
        <>
          <div className="flex w-full items-center gap-2 sm:w-1/4">
            <Switch checked={alert.onOffValue === 'on'} onCheckedChange={handleToggle} />
            <ItemDescription>{t('off.on')}</ItemDescription>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-1/4">
            <Checkbox checked={alert.alertOnOff} onCheckedChange={(c) => handleChange('alertOnOff', !!c)} />
            <ItemDescription>{t('enable')}</ItemDescription>
          </div>
        </>
      ) : (
        // Min/Max Logic (if sensor is analog/value type)
        <div className="flex w-full flex-col gap-4 sm:flex-1 sm:flex-row">
          {/* Min Value */}
          <div className="flex flex-1 items-center gap-2">
            <Input
              type="number"
              placeholder={t('sensor.signal.value.min')}
              value={alert.minValue ?? ''}
              onChange={(e) => handleChange('minValue', e.target.value ? Number(e.target.value) : undefined)}
              className={validationErrors.min ? 'border-destructive' : ''}
            />
            <div className="flex items-center gap-2">
              <Checkbox checked={alert.alertMin} onCheckedChange={(c) => handleChange('alertMin', !!c)} />
              <ItemDescription>{t('enable')}</ItemDescription>
            </div>
          </div>

          {/* Max Value */}
          <div className="flex flex-1 items-center gap-2">
            <Input
              type="number"
              placeholder={t('sensor.signal.value.max')}
              value={alert.maxValue ?? ''}
              onChange={(e) => handleChange('maxValue', e.target.value ? Number(e.target.value) : undefined)}
              className={validationErrors.max ? 'border-destructive' : ''}
            />
            <div className="flex items-center gap-2">
              <Checkbox checked={alert.alertMax} onCheckedChange={(c) => handleChange('alertMax', !!c)} />
              <ItemDescription>{t('enable')}</ItemDescription>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
