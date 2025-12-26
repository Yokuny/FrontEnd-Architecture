import type { UseQueryResult } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
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
  const id = useId();
  const { t } = useTranslation();

  // Simulation of query for static data as per SELECT_PATTERN.md
  const query = {
    data: VISIBILITY_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success',
  } as UseQueryResult<VisibilityOption[], Error>;

  if (mode === 'single') {
    const label = `${t('visible.placeholder')} *`;
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          {label}
        </Label>
        <DataSelect<VisibilityOption>
          id={id}
          placeholder={t('visible.placeholder')}
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
