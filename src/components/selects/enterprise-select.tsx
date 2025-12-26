import { Building2 } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Enterprise, mapEnterprisesToOptions, useEnterprisesSelect } from '@/hooks/use-enterprises-api';

export function EnterpriseSelect(props: EnterpriseSelectProps) {
  const { mode, oneBlocked = false, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useEnterprisesSelect();

  if (mode === 'multi') {
    const displayLabel = label || 'Empresa';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Enterprise>
          id={id}
          placeholder={placeholder || 'Selecione as empresas...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapEnterprisesToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar empresa..."
          noOptionsMessage="Nenhuma empresa disponível."
          noResultsMessage="Nenhuma empresa encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Empresa';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Enterprise>
        id={id}
        placeholder={placeholder || 'Selecione uma empresa...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapEnterprisesToOptions}
        oneBlocked={oneBlocked}
        disabled={disabled}
        clearable={false}
        searchPlaceholder="Buscar empresa..."
        noOptionsMessage="Nenhuma empresa disponível."
        noResultsMessage="Nenhuma empresa encontrada."
        className={className}
      />
    </div>
  );
}

interface EnterpriseSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EnterpriseSelectSingleProps extends EnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface EnterpriseSelectMultiProps extends EnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EnterpriseSelectProps = EnterpriseSelectSingleProps | EnterpriseSelectMultiProps;
