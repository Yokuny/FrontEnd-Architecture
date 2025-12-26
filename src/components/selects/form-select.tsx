import { ClipboardList } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Form, mapFormsToOptions, useFormsSelect } from '@/hooks/use-forms-api';

export function FormSelect(props: FormSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useFormsSelect(idEnterprise);

  if (mode === 'multi') {
    const displayLabel = label || 'Formulário';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Form, Form>
          id={id}
          placeholder={placeholder || 'Selecione os formulários...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapFormsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar formulário..."
          noOptionsMessage="Nenhum formulário disponível."
          noResultsMessage="Nenhum formulário encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Formulário';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Form, Form>
        id={id}
        placeholder={placeholder || 'Selecione um formulário...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapFormsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar formulário..."
        noOptionsMessage="Nenhum formulário disponível."
        noResultsMessage="Nenhum formulário encontrado."
        className={className}
      />
    </div>
  );
}

interface FormSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface FormSelectSingleProps extends FormSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FormSelectMultiProps extends FormSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FormSelectProps = FormSelectSingleProps | FormSelectMultiProps;
