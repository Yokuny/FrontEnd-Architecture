import { Package } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptionsSimple, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

export function ProductServiceSelect(props: ProductServiceSelectProps) {
  const { t } = useTranslation();
  const { idEnterprise, disabled = false, className, label, placeholder, value, onChange } = props;
  const id = useId();
  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  const displayLabel = label || t('support.product.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Package className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Machine, Machine>
        id={id}
        placeholder={placeholder || t('support.product.placeholder')}
        value={value}
        onChange={(val) => onChange?.(val as string)}
        query={query}
        mapToOptions={mapMachinesToOptionsSimple}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface ProductServiceSelectProps {
  idEnterprise?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
