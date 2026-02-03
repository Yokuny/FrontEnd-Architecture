import { ClipboardCheck } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type MaintenancePlan, mapMaintenancePlansToOptions, useMaintenancePlansSelect } from '@/hooks/use-maintenance-plans-api';

export function MaintenancePlanSelect(props: MaintenancePlanSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const { t } = useTranslation();
  const query = useMaintenancePlansSelect(idEnterprise);
  const displayLabel = label || t('maintenance.plan');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    query,
    mapToOptions: mapMaintenancePlansToOptions,
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
          <ClipboardCheck className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<MaintenancePlan, MaintenancePlan>
          {...sharedProps}
          placeholder={placeholder || t('maintenance.plans.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
        />
      ) : (
        <DataSelect<MaintenancePlan, MaintenancePlan>
          {...sharedProps}
          placeholder={placeholder || t('maintenance.plan.placeholder')}
          value={props.value}
          onChange={(val) => props.onChange(val as string)}
          clearable={clearable}
        />
      )}
    </div>
  );
}

interface MaintenancePlanSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MaintenancePlanSelectSingleProps extends MaintenancePlanSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MaintenancePlanSelectMultiProps extends MaintenancePlanSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MaintenancePlanSelectProps = MaintenancePlanSelectSingleProps | MaintenancePlanSelectMultiProps;
