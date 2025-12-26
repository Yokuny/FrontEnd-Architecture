import { KeyRound as KeyRoundIcon } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { CREDENTIALS_OPTIONS, type CredentialsOption } from '@/lib/constants/select-options';

export function TypeCredentialsSelect(props: TypeCredentialsSelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();
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
    const displayLabel = label || t('credentials.by');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <KeyRoundIcon className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<CredentialsOption, CredentialsOption>
          id={id}
          placeholder={placeholder || t('credentials.by')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
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
          <KeyRoundIcon className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<CredentialsOption, CredentialsOption>
        id={id}
        placeholder={placeholder || t('credentials.by')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
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
