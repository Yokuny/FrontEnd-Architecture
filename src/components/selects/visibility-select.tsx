import type { UseQueryResult } from '@tanstack/react-query';
import { useIntl } from 'react-intl';
import { DataSelect } from '@/components/ui/data-select';
import { VISIBILITY_OPTIONS, type VisibilityOption } from '@/lib/constants/select-options';

interface VisibilitySelectProps {
  /** Mode of selection (only single supported for now based on legacy) */
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
 * VisibilitySelect Component
 *
 * Specialized select for role visibility settings (Public, Private, Limited).
 * Follows the system select pattern with static options and i18n support.
 */
export function VisibilitySelect({ mode, value, onChange, disabled, className, clearable = true }: VisibilitySelectProps) {
  const intl = useIntl();

  // Simulation of query for static data as per SELECT_PATTERN.md
  const query = {
    data: VISIBILITY_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success',
  } as UseQueryResult<VisibilityOption[], Error>;

  if (mode === 'single') {
    return (
      <DataSelect<VisibilityOption>
        label={`${intl.formatMessage({ id: 'visible.placeholder' })} *`}
        placeholder={intl.formatMessage({ id: 'visible.placeholder' })}
        value={value}
        onChange={(val) => onChange(val as string)}
        query={query}
        mapToOptions={(data) =>
          data.map((opt) => ({
            value: opt.value,
            label: intl.formatMessage({ id: opt.labelKey }),
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
