import { Map as MapIcon } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { FENCE_TYPES } from '@/lib/constants/select-options';

export function FenceTypeSelect(props: FenceTypeSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Mapping options to translated ones
  const translatedOptions = FENCE_TYPES.map((opt) => ({
    ...opt,
    name: t(opt.id),
  }));

  // Simulated query object
  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: any[]) => {
    return options.map((opt) => ({
      value: opt.id,
      label: opt.name,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('type');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <MapIcon className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder || t('type')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('type');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <MapIcon className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder || t('type')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface FenceTypeSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FenceTypeSelectSingleProps extends FenceTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FenceTypeSelectMultiProps extends FenceTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FenceTypeSelectProps = FenceTypeSelectSingleProps | FenceTypeSelectMultiProps;
