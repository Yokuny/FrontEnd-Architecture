import { Layers } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type ConsumptionGroup, mapConsumptionGroupsToOptions, useConsumptionGroupsSelect } from '@/hooks/use-consumption-groups-api';

export function ConsumptionGroupSelect(props: ConsumptionGroupSelectProps) {
  const { mode, idEnterprise, oneBlocked = false, disabled = false, className, label } = props;
  const id = useId();
  const query = useConsumptionGroupsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhum grupo de consumo disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Grupo de Consumo';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Layers className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<ConsumptionGroup>
          id={id}
          placeholder="Selecione os grupos..."
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapConsumptionGroupsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar grupo..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum grupo encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Grupo de Consumo';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Layers className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<ConsumptionGroup>
        id={id}
        placeholder="Selecione um grupo..."
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapConsumptionGroupsToOptions}
        oneBlocked={oneBlocked}
        disabled={disabled}
        clearable={false}
        searchPlaceholder="Buscar grupo..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum grupo encontrado."
        className={className}
      />
    </div>
  );
}

interface ConsumptionGroupSelectBaseProps {
  idEnterprise?: string;
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

interface ConsumptionGroupSelectSingleProps extends ConsumptionGroupSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ConsumptionGroupSelectMultiProps extends ConsumptionGroupSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ConsumptionGroupSelectProps = ConsumptionGroupSelectSingleProps | ConsumptionGroupSelectMultiProps;
