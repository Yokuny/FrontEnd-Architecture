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

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('customer');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Briefcase className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Customer>
          id={id}
          placeholder={placeholder || t('customer')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapCustomersToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('customer');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Briefcase className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Customer>
        id={id}
        placeholder={placeholder || t('customer')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapCustomersToOptions}
        disabled={disabled}
        clearable={props.clearable ?? false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
        className={className}
      />
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
