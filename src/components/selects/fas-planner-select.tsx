import { Calendar } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type FasPlanner, mapFasPlannersToOptions, useFasPlannersSelect } from '@/hooks/use-fas-planners-api';

export function FasPlannerSelect(props: FasPlannerSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useFasPlannersSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhum planejador disponível.';

  if (mode === 'multi') {
    const displayLabel = label || 'Planejador';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Calendar className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<FasPlanner>
          id={id}
          placeholder={placeholder || 'Selecione os planejadores...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapFasPlannersToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar planejador..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum planejador encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Planejador';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Calendar className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<FasPlanner>
        id={id}
        placeholder={placeholder || 'Selecione um planejador...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapFasPlannersToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder="Buscar planejador..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum planejador encontrado."
        className={className}
      />
    </div>
  );
}

interface FasPlannerSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FasPlannerSelectSingleProps extends FasPlannerSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FasPlannerSelectMultiProps extends FasPlannerSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FasPlannerSelectProps = FasPlannerSelectSingleProps | FasPlannerSelectMultiProps;
