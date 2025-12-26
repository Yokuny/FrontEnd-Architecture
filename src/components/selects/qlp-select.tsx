import { ClipboardList } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapQlpToOptions, type Qlp, useQlpSelect } from '@/hooks/use-qlp-api';

/**
 * QlpSelect Component
 *
 * Fetches and displays QLP (Quadro de Lotação de Pessoal) filtered by enterprise ID.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function QlpSelect(props: QlpSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useQlpSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum registro encontrado.';

  if (mode === 'multi') {
    const displayLabel = label || 'QLP';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <ClipboardList className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Qlp, Qlp>
          id={id}
          placeholder={placeholder || 'Selecione...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapQlpToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar QLP..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum registro encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'QLP';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ClipboardList className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Qlp, Qlp>
        id={id}
        placeholder={placeholder || 'Selecione...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapQlpToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar QLP..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum registro encontrado."
        className={className}
      />
    </div>
  );
}

interface QlpSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface QlpSelectSingleProps extends QlpSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface QlpSelectMultiProps extends QlpSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type QlpSelectProps = QlpSelectSingleProps | QlpSelectMultiProps;
