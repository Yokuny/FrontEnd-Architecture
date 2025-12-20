import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type FasPlanner, mapFasPlannersToOptions, useFasPlannersSelect } from '@/hooks/use-fas-planners-api';

export function FasPlannerSelect(props: FasPlannerSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const query = useFasPlannersSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhum planejador disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<FasPlanner>
        label={label || 'Planejador (Múltiplo)'}
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
    );
  }

  return (
    <DataSelect<FasPlanner>
      label={label || 'Planejador (Único)'}
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
