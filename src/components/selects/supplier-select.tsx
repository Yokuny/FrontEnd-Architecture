import type { UseQueryResult } from '@tanstack/react-query';
import { Filter, Truck } from 'lucide-react';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Supplier, useSuppliersSelect } from '@/hooks/use-suppliers-api';

export function SupplierSelect(props: SupplierSelectProps) {
  const { t } = useTranslation();
  const { mode, oneBlocked = false, disabled = false, className, showActivityFilter = true, label, placeholder } = props;
  const id = useId();
  const activityId = useId();

  const query = useSuppliersSelect();
  const [activityFilter, setActivityFilter] = useState<string>();

  const filteredQuery = {
    ...query,
    data: activityFilter && query.data ? query.data.filter((s) => s.atividades?.includes(activityFilter)) : query.data,
  } as typeof query;

  // Extract unique activities from suppliers
  const activities = query.data ? [...new Set(query.data.flatMap((s) => s.atividades || []))].sort((a, b) => a.localeCompare(b)) : [];

  // Simulated query for activities select
  const activitiesQuery = {
    data: activities,
    isLoading: query.isLoading,
    isError: query.isError,
    status: query.status,
  } as UseQueryResult<string[], Error>;

  const mapSupplierToOptions = (suppliers: Supplier[]) => {
    return suppliers.map((s) => ({
      value: s.razao,
      label: s.razao,
      disabled: s.status !== 'Aprovado',
      data: s,
    }));
  };

  const activityFilterLabel = t('activity.filter');

  const displayLabel = label || t('supplier');
  const sharedProps = {
    id,
    placeholder: placeholder || t('supplier'),
    query: filteredQuery,
    mapToOptions: mapSupplierToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: t('nooptions.message'),
    noResultsMessage: t('not.found'),
  };

  return (
    <div className={className}>
      {showActivityFilter && (
        <div className="mb-4 space-y-2">
          <Label htmlFor={activityId} className="flex items-center gap-2">
            <Filter className="size-4" />
            {activityFilterLabel}
          </Label>
          <DataSelect<string, string>
            id={activityId}
            placeholder={t('select.activity')}
            value={activityFilter}
            onChange={(val) => setActivityFilter(val as string)}
            query={activitiesQuery}
            mapToOptions={(acts) => acts.map((a) => ({ value: a, label: a, data: a }))}
            clearable
            searchPlaceholder={t('search.placeholder')}
          />
        </div>
      )}

      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Truck className="size-4" />
            {displayLabel}
          </Label>
        )}
        {mode === 'multi' ? (
          <DataMultiSelect<Supplier, Supplier> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
        ) : (
          <DataSelect<Supplier, Supplier> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} oneBlocked={oneBlocked} clearable={true} />
        )}
      </div>
    </div>
  );
}

interface SupplierSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  showActivityFilter?: boolean;
  label?: string;
  placeholder?: string;
}

interface SupplierSelectSingleProps extends SupplierSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface SupplierSelectMultiProps extends SupplierSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type SupplierSelectProps = SupplierSelectSingleProps | SupplierSelectMultiProps;
