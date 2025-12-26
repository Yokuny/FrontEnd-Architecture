import { Shield } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapRolesToOptions, type RoleListItem, useRolesSelect } from '@/hooks/use-roles-api';

/**
 * RoleSelect Component
 *
 * This component fetches and displays a list of user roles.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function RoleSelect(props: RoleSelectProps) {
  const { mode, isAll = false, params, disabled = false, className, label, placeholder, clearable = false } = props;
  const id = useId();

  const query = useRolesSelect(isAll, params);

  if (mode === 'multi') {
    const displayLabel = label || 'Perfis';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Shield className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<RoleListItem, RoleListItem>
          id={id}
          placeholder={placeholder || 'Selecione os perfis...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as (string | number)[])}
          query={query}
          mapToOptions={mapRolesToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar perfil..."
          noOptionsMessage="Nenhum perfil disponível."
          noResultsMessage="Nenhum perfil encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Perfil';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Shield className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<RoleListItem, RoleListItem>
        id={id}
        placeholder={placeholder || 'Selecione um perfil...'}
        value={props.value}
        onChange={props.onChange}
        query={query}
        mapToOptions={mapRolesToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar perfil..."
        noOptionsMessage="Nenhum perfil disponível."
        noResultsMessage="Nenhum perfil encontrado."
        className={className}
      />
    </div>
  );
}

interface RoleSelectBaseProps {
  /** If true, fetches from /role/list/all instead of /role/list */
  isAll?: boolean;
  params?: Record<string, unknown>;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface RoleSelectSingleProps extends RoleSelectBaseProps {
  mode: 'single';
  value?: string | number;
  onChange: (value: string | number | undefined) => void;
}

interface RoleSelectMultiProps extends RoleSelectBaseProps {
  mode: 'multi';
  value?: (string | number)[];
  onChange: (value: (string | number)[]) => void;
}

export type RoleSelectProps = RoleSelectSingleProps | RoleSelectMultiProps;
