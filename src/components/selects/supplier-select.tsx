import type { UseQueryResult } from '@tanstack/react-query';
import { Filter, Truck } from 'lucide-react';
import { useId, useState } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Supplier, useSuppliersSelect } from '@/hooks/use-suppliers-api';

/**
 * SupplierSelect Component
 *
 * This component provides selection for suppliers, with an optional activity filter.
 * Adheres to the new architecture and mode: single/multi pattern.
 * Original logic for 'oneBlocked' and activity filtering is preserved.
 */
export function SupplierSelect(props: SupplierSelectProps) {
  const { mode, oneBlocked = false, disabled = false, className, showActivityFilter = true, label, placeholder } = props;
  const id = useId();
  const activityId = useId();

  const query = useSuppliersSelect();
  const [activityFilter, setActivityFilter] = useState<string>();

  // Filter query data by activity if selected
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

  const activityFilterLabel = 'Filtrar pela atividade (Opcional)';

  if (mode === 'multi') {
    const displayLabel = label || 'Fornecedor';
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
              placeholder="Selecione uma atividade..."
              value={activityFilter}
              onChange={(val) => setActivityFilter(val as string)}
              query={activitiesQuery}
              mapToOptions={(acts) => acts.map((a) => ({ value: a, label: a, data: a }))}
              clearable
              searchPlaceholder="Buscar atividade..."
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
          <DataMultiSelect<Supplier, Supplier>
            id={id}
            placeholder={placeholder || 'Selecione os fornecedores...'}
            value={props.value}
            onChange={(vals) => props.onChange(vals as string[])}
            query={filteredQuery}
            mapToOptions={mapSupplierToOptions}
            disabled={disabled}
            searchPlaceholder="Buscar fornecedor..."
            noOptionsMessage="Nenhum fornecedor disponível."
            noResultsMessage="Nenhum fornecedor encontrado."
          />
        </div>
      </div>
    );
  }

  const displayLabel = label || 'Fornecedor';
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
            placeholder="Selecione uma atividade..."
            value={activityFilter}
            onChange={(val) => setActivityFilter(val as string)}
            query={activitiesQuery}
            mapToOptions={(acts) => acts.map((a) => ({ value: a, label: a, data: a }))}
            clearable
            searchPlaceholder="Buscar atividade..."
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
        <DataSelect<Supplier, Supplier>
          id={id}
          placeholder={placeholder || 'Selecione um fornecedor...'}
          value={props.value}
          onChange={(val) => props.onChange(val as string)}
          query={filteredQuery}
          mapToOptions={mapSupplierToOptions}
          oneBlocked={oneBlocked}
          disabled={disabled}
          clearable={true}
          searchPlaceholder="Buscar fornecedor..."
          noOptionsMessage="Nenhum fornecedor disponível."
          noResultsMessage="Nenhum fornecedor encontrado."
        />
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
