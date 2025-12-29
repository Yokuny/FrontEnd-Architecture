import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { VISIBILITY_OPTIONS, type VisibilityOption } from '@/lib/constants/select-options';

export function VisibilitySelect(props: VisibilitySelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: VISIBILITY_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: VisibilityOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
      data: opt,
    }));
  };

  const displayLabel = label || t('visibility');

  if (mode === 'multi') {
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Eye className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<VisibilityOption, VisibilityOption>
          id={id}
          placeholder={placeholder || t('visibility')}
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

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Eye className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<VisibilityOption, VisibilityOption>
        id={id}
        placeholder={placeholder || t('visibility')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface VisibilitySelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface VisibilitySelectSingleProps extends VisibilitySelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface VisibilitySelectMultiProps extends VisibilitySelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type VisibilitySelectProps = VisibilitySelectSingleProps | VisibilitySelectMultiProps;
