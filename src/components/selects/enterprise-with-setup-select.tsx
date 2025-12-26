import { Settings } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Enterprise, mapEnterprisesToOptions, useEnterprisesWithSetupSelect } from '@/hooks/use-enterprises-api';

export function EnterpriseWithSetupSelect(props: EnterpriseWithSetupSelectProps) {
  const { mode, oneBlocked = false, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useEnterprisesWithSetupSelect();

  if (mode === 'multi') {
    const displayLabel = label || 'Empresa com Setup';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Settings className="size-4" />
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

  const displayLabel = label || 'Empresa com Setup';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Enterprise>
        id={id}
        placeholder={placeholder || 'Selecione uma empresa...'}
        value={props.value}
        onChange={(val, opt) => props.onChange(val as string, opt?.data)}
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

interface EnterpriseWithSetupSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EnterpriseWithSetupSelectSingleProps extends EnterpriseWithSetupSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined, data?: Enterprise) => void;
}

interface EnterpriseWithSetupSelectMultiProps extends EnterpriseWithSetupSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EnterpriseWithSetupSelectProps = EnterpriseWithSetupSelectSingleProps | EnterpriseWithSetupSelectMultiProps;
