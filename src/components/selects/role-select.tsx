import { Shield } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const query = useRolesSelect(isAll, params);
  const displayLabel = label || t('role');
  const sharedProps = {
    id,
    placeholder: placeholder || t('roles.placeholder'),
    query,
    mapToOptions: mapRolesToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: t('nooptions.message'),
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Shield className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<RoleListItem, RoleListItem> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as (string | number)[])} />
      ) : (
        <DataSelect<RoleListItem, RoleListItem> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string | number | undefined)} clearable={clearable} />
      )}
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
