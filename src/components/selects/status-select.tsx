import { Activity } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { useStatusSelect } from '@/hooks/use-status-api';

export function StatusSelect(props: StatusSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useStatusSelect(idEnterprise);

  const displayLabel = label || t('status.placeholder');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  const mapWithDefaults = (statuses: string[]) => {
    const undefinedLabel = t('undefined');
    const options = [
      { value: 'empty', label: undefinedLabel, data: 'empty' },
      ...statuses.map((status) => ({
        value: status || undefinedLabel,
        label: status || undefinedLabel,
        data: status,
      })),
    ];
    return options.sort((a, b) => a.label.localeCompare(b.label));
  };

  const sharedProps = {
    id,
    placeholder: placeholder || t('status.placeholder'),
    query,
    mapToOptions: mapWithDefaults,
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
          <Activity className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<any, any> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<any, any> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable />
      )}
    </div>
  );
}

interface StatusSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface StatusSelectSingleProps extends StatusSelectBaseProps {
  mode?: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface StatusSelectMultiProps extends StatusSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type StatusSelectProps = StatusSelectSingleProps | StatusSelectMultiProps;
