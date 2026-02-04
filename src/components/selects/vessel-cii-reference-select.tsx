import { Ship } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type SelectOption, VESSEL_CII_TYPES } from '@/lib/constants/select-options';

export function VesselCIIReferenceSelect(props: VesselCIIReferenceSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const translatedOptions = VESSEL_CII_TYPES.map((opt) => ({
    ...opt,
    label: t(`vessel.type.${opt.value.toLowerCase()}`),
  }));

  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: SelectOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  const displayLabel = label || t('type.vessel');
  const sharedProps = {
    id,
    placeholder: placeholder || t('select.vessel.type'),
    query: query as any,
    mapToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: t('nooptions.message'),
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Ship className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<SelectOption, SelectOption> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<SelectOption, SelectOption> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
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
