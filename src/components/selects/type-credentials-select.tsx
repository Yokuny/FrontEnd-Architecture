import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { CREDENTIALS_OPTIONS, type CredentialsOption } from '@/lib/constants/select-options';

export function TypeCredentialsSelect(props: TypeCredentialsSelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const { t } = useTranslation();

  // Simulated query for static options
  const query = {
    data: CREDENTIALS_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: CredentialsOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.labelKey === 'SSO' ? 'SSO' : t(opt.labelKey),
      data: opt,
    }));
  };

  if (mode === 'multi') {
    return (
      <DataMultiSelect<CredentialsOption, CredentialsOption>
        label={label || t('credentials.by')}
        placeholder={placeholder || t('credentials.by')}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        className={className}
      />
    );
  }

  return (
    <DataSelect<CredentialsOption, CredentialsOption>
      label={label || t('credentials.by')}
      placeholder={placeholder || t('credentials.by')}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled}
      className={className}
    />
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
