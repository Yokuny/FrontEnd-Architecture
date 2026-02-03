import { Settings } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPartsToOptions, usePartsSelect } from '@/hooks/use-parts-api';

export function PartSelect({
  label,
  placeholder,
  value,
  values,
  onChange,
  onChangeMulti,
  idEnterprise,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: PartSelectProps) {
  const { t } = useTranslation();
  const id = useId();
  const query = usePartsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('part.placeholder'),
    query,
    mapToOptions: mapPartsToOptions,
    disabled,
    className,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings className="size-4" />
          {label}
        </Label>
      )}
      {multi ? (
        <DataMultiSelect {...sharedProps} value={values} onChange={(newValues) => onChangeMulti?.(newValues as string[])} />
      ) : (
        <DataSelect {...sharedProps} value={value} onChange={(newValue) => onChange?.(newValue as string | undefined)} clearable={clearable} />
      )}
    </div>
  );
}

interface PartSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idEnterprise?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}
