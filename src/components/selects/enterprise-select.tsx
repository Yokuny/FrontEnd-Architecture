import { Building2 } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Enterprise, mapEnterprisesToOptions, useEnterprisesSelect } from '@/hooks/use-enterprises-api';

export function EnterpriseSelect(props: EnterpriseSelectProps) {
  const { t } = useTranslation();
  const { mode, oneBlocked = false, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useEnterprisesSelect();

  if (mode === 'multi') {
    const displayLabel = label || t('machine.idEnterprise.placeholder');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Building2 className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Enterprise>
          id={id}
          placeholder={placeholder || t('machine.idEnterprise.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapEnterprisesToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('machine.idEnterprise.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Building2 className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Enterprise>
        id={id}
        placeholder={placeholder || t('machine.idEnterprise.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapEnterprisesToOptions}
        oneBlocked={oneBlocked}
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

interface EnterpriseSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EnterpriseSelectSingleProps extends EnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface EnterpriseSelectMultiProps extends EnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EnterpriseSelectProps = EnterpriseSelectSingleProps | EnterpriseSelectMultiProps;
