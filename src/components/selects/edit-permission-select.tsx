import type { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
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
    return (
      <DataSelect<EditPermissionOption>
        label={`${t('edit.who.placeholder')} *`}
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
    );
  }

  return null;
}
