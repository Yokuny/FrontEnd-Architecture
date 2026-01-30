import { KeySquare } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { CREDENTIALS_OPTIONS, type SelectOptionWithKey } from '@/lib/constants/select-options';

export function TypeCredentialsSelect(props: TypeCredentialsSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: CREDENTIALS_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: SelectOptionWithKey[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('credentials.by');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <KeySquare className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<SelectOptionWithKey, SelectOptionWithKey>
          id={id}
          placeholder={placeholder || t('credentials.by')}
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

  const displayLabel = label || t('credentials.by');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <KeySquare className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SelectOptionWithKey, SelectOptionWithKey>
        id={id}
        placeholder={placeholder || t('login.password')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface TypeCredentialsSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface TypeCredentialsSelectSingleProps extends TypeCredentialsSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface TypeCredentialsSelectMultiProps extends TypeCredentialsSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type TypeCredentialsSelectProps = TypeCredentialsSelectSingleProps | TypeCredentialsSelectMultiProps;
