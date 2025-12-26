import type { UseQueryResult } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { EDIT_PERMISSION_OPTIONS, type EditPermissionOption } from '@/lib/constants/select-options';

interface EditPermissionSelectProps {
  /** Mode of selection (single) */
  mode: 'single';
  /** Currently selected value */
  value?: string;
  /** Callback when selection changes */
  onChange: (value: string | undefined) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the select is clearable */
  clearable?: boolean;
}

/**
 * EditPermissionSelect Component
 *
 * Specialized select for role edit permission settings (Me, Any, etc).
 * Follows the system select pattern with static options and i18n support.
 */
export function EditPermissionSelect({ mode, value, onChange, disabled, className, clearable = true }: EditPermissionSelectProps) {
  const id = useId();
  const { t } = useTranslation();

  // Simulation of query for static data as per SELECT_PATTERN.md
  const query = {
    data: EDIT_PERMISSION_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success',
  } as UseQueryResult<EditPermissionOption[], Error>;

  if (mode === 'single') {
    const label = `${t('edit.who.placeholder')} *`;
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            {label}
          </Label>
        )}
        <DataSelect<EditPermissionOption>
          id={id}
          placeholder={t('edit.who.placeholder')}
          value={value}
          onChange={(val) => onChange(val as string)}
          query={query}
          mapToOptions={(data) =>
            data.map((opt) => ({
              value: opt.value,
              label: t(opt.labelKey),
            }))
          }
          disabled={disabled}
          className={className}
          clearable={clearable}
        />
      </div>
    );
  }

  return null;
}
