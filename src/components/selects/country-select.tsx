import { Globe } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { COUNTRIES, type Country } from '@/lib/constants/countries';

/**
 * CountrySelect Component
 *
 * Provides selection for countries from a static list.
 * Follows the single/multi mode pattern.
 */
export function CountrySelect(props: CountrySelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Simulated query object for static data
  const query = {
    data: COUNTRIES,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: Country[]) => {
    return options.map((opt) => ({
      value: opt.code,
      label: opt.name,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Países';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Country, Country>
          id={id}
          placeholder={placeholder || 'Selecione os países...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar país..."
          noOptionsMessage="Nenhum país disponível."
          noResultsMessage="Nenhum país encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'País';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Country, Country>
        id={id}
        placeholder={placeholder || 'Selecione um país...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar país..."
        noOptionsMessage="Nenhum país disponível."
        noResultsMessage="Nenhum país encontrado."
        className={className}
      />
    </div>
  );
}

interface CountrySelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface CountrySelectSingleProps extends CountrySelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface CountrySelectMultiProps extends CountrySelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type CountrySelectProps = CountrySelectSingleProps | CountrySelectMultiProps;
