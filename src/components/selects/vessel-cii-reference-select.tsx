import { Ship } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { VESSEL_CII_TYPES, type VesselCiiTypeOption } from '@/lib/constants/select-options';

/**
 * VesselCIIReferenceSelect Component
 *
 * This component provides options for vessel types used in CII calculations.
 * It follows the single/multi mode pattern and uses static data centered in constants.
 */
export function VesselCIIReferenceSelect(props: VesselCIIReferenceSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Mapping options to translated ones
  const translatedOptions = VESSEL_CII_TYPES.map((opt) => ({
    ...opt,
    label: t(`vessel.type.${opt.value.toLowerCase()}`),
  }));

  // Simulated query object
  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: VesselCiiTypeOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('type.vessel');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Ship className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<VesselCiiTypeOption, VesselCiiTypeOption>
          id={id}
          placeholder={placeholder || t('select.vessel.type')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('type.vessel');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Ship className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<VesselCiiTypeOption, VesselCiiTypeOption>
        id={id}
        placeholder={placeholder || t('select.vessel.type')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface VesselCIIReferenceSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface VesselCIIReferenceSelectSingleProps extends VesselCIIReferenceSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface VesselCIIReferenceSelectMultiProps extends VesselCIIReferenceSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type VesselCIIReferenceSelectProps = VesselCIIReferenceSelectSingleProps | VesselCIIReferenceSelectMultiProps;
