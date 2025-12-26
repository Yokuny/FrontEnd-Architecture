import { Monitor } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPlatformsToOptions, type Platform, usePlatformsSelect } from '@/hooks/use-platforms-api';

/**
 * PlatformEnterpriseSelect Component
 *
 * Fetches and displays platforms filtered by enterprise ID.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function PlatformEnterpriseSelect(props: PlatformEnterpriseSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = usePlatformsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhuma plataforma encontrada.';

  if (mode === 'multi') {
    const displayLabel = label || 'Plataformas';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Monitor className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Platform, Platform>
          id={id}
          placeholder={placeholder || 'Selecione as plataformas...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapPlatformsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar plataforma..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhuma plataforma encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Plataforma';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Monitor className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Platform, Platform>
        id={id}
        placeholder={placeholder || 'Selecione uma plataforma...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapPlatformsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar plataforma..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma plataforma encontrada."
        className={className}
      />
    </div>
  );
}

interface PlatformEnterpriseSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface PlatformEnterpriseSelectSingleProps extends PlatformEnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface PlatformEnterpriseSelectMultiProps extends PlatformEnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type PlatformEnterpriseSelectProps = PlatformEnterpriseSelectSingleProps | PlatformEnterpriseSelectMultiProps;
