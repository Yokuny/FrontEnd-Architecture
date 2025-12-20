import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type Fence, mapFencesToOptions, useFencesSelect } from '@/hooks/use-fences-api';

export function FenceSelect(props: FenceSelectProps) {
  const { mode, idEnterprise, notId, typeFence, disabled = false, className, label, placeholder } = props;

  const query = useFencesSelect({
    idEnterprise,
    notId,
    typeFence,
  });

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhuma cerca disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Fence>
        label={label || 'Cerca (Múltiplo)'}
        placeholder={placeholder || 'Selecione as cercas...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapFencesToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar cerca..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma cerca encontrada."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Fence>
      label={label || 'Cerca (Único)'}
      placeholder={placeholder || 'Selecione uma cerca...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapFencesToOptions}
      disabled={disabled}
      clearable
      searchPlaceholder="Buscar cerca..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhuma cerca encontrada."
      className={className}
    />
  );
}

interface FenceSelectBaseProps {
  idEnterprise?: string;
  notId?: string[];
  typeFence?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FenceSelectSingleProps extends FenceSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FenceSelectMultiProps extends FenceSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FenceSelectProps = FenceSelectSingleProps | FenceSelectMultiProps;
