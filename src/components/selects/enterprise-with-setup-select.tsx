import { Building } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Enterprise, mapEnterprisesToOptions, useEnterprisesWithSetupSelect } from '@/hooks/use-enterprises-api';

export function EnterpriseWithSetupSelect(props: EnterpriseWithSetupSelectProps) {
  const { t } = useTranslation();
  const { mode, oneBlocked = false, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useEnterprisesWithSetupSelect();

  const displayLabel = label || t('enterprise');

  const sharedProps = {
    id,
    placeholder: placeholder || t('enterprise'),
    query,
    mapToOptions: mapEnterprisesToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: t('nooptions.message'),
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Building className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<Enterprise> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<Enterprise>
          {...sharedProps}
          value={props.value}
          onChange={(val, data) => props.onChange(val as string, data?.data)}
          oneBlocked={oneBlocked}
          clearable={false}
        />
      )}
    </div>
  );
}

interface EnterpriseWithSetupSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EnterpriseWithSetupSelectSingleProps extends EnterpriseWithSetupSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined, data?: Enterprise) => void;
}

interface EnterpriseWithSetupSelectMultiProps extends EnterpriseWithSetupSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EnterpriseWithSetupSelectProps = EnterpriseWithSetupSelectSingleProps | EnterpriseWithSetupSelectMultiProps;
