import { Anchor } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type FleetMachines, type FleetVesselItem, mapFleetVesselsToOptionsFlat, useFleetVesselsSelect } from '@/hooks/use-fleet-vessels-api';

export function FleetVesselsSelect(props: FleetVesselsSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useFleetVesselsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  const displayLabel = label || t('vessels.select.placeholder');
  const sharedProps = {
    id,
    placeholder: placeholder || t('vessels.select.placeholder'),
    query,
    mapToOptions: mapFleetVesselsToOptionsFlat,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Anchor className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<FleetMachines, FleetVesselItem> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<FleetMachines, FleetVesselItem> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable />
      )}
    </div>
  );
}

interface FleetVesselsSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FleetVesselsSelectSingleProps extends FleetVesselsSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FleetVesselsSelectMultiProps extends FleetVesselsSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FleetVesselsSelectProps = FleetVesselsSelectSingleProps | FleetVesselsSelectMultiProps;
