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

  const noOptionsMessage = !idEnterprise ? t('select.first.enterprise') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('maintenance.plan');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <ClipboardCheck className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<MaintenancePlan, MaintenancePlan>
          id={id}
          placeholder={placeholder || t('maintenance.plans.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMaintenancePlansToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('maintenance.plan');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ClipboardCheck className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<MaintenancePlan, MaintenancePlan>
        id={id}
        placeholder={placeholder || t('maintenance.plan.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMaintenancePlansToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
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
