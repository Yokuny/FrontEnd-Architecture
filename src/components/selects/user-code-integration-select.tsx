import { UserRound } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapUserCodeIntegrationToOptions, type UserCodeIntegration, useUserCodeIntegrationSelect } from '@/hooks/use-user-code-integration-api';

/**
 * UserCodeIntegrationSelect Component
 *
 * Fetches and displays users with their integration codes.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function UserCodeIntegrationSelect(props: UserCodeIntegrationSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useUserCodeIntegrationSelect();

  if (mode === 'multi') {
    const displayLabel = label || t('user');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <UserRound className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<UserCodeIntegration, UserCodeIntegration>
          id={id}
          placeholder={placeholder || t('user')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapUserCodeIntegrationToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('user');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <UserRound className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<UserCodeIntegration, UserCodeIntegration>
        id={id}
        placeholder={placeholder || t('user')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapUserCodeIntegrationToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface UserCodeIntegrationSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserCodeIntegrationSelectSingleProps extends UserCodeIntegrationSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserCodeIntegrationSelectMultiProps extends UserCodeIntegrationSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserCodeIntegrationSelectProps = UserCodeIntegrationSelectSingleProps | UserCodeIntegrationSelectMultiProps;
