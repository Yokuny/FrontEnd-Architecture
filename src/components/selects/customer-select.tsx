import { Briefcase } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Customer, mapCustomersToOptions, useCustomersSelect } from '@/hooks/use-customers-api';

export function CustomerSelect(props: CustomerSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useCustomersSelect(idEnterprise);

  const displayLabel = label || t('customer');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('customer'),
    query,
    mapToOptions: mapCustomersToOptions,
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
          <Briefcase className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<Customer> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<Customer> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={props.clearable ?? false} />
      )}
    </div>
  );
}

interface CustomerSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface CustomerSelectSingleProps extends CustomerSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
  clearable?: boolean;
}

interface CustomerSelectMultiProps extends CustomerSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type CustomerSelectProps = CustomerSelectSingleProps | CustomerSelectMultiProps;
