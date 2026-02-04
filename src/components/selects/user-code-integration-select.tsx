import { UserRound } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapUserCodeIntegrationToOptions, type UserCodeIntegration, useUserCodeIntegrationSelect } from '@/hooks/use-user-code-integration-api';

export function UserCodeIntegrationSelect(props: UserCodeIntegrationSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useUserCodeIntegrationSelect();
  const displayLabel = label || t('user');

  const sharedProps = {
    id,
    placeholder: placeholder || t('user'),
    query,
    mapToOptions: mapUserCodeIntegrationToOptions,
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
          <UserRound className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<UserCodeIntegration, UserCodeIntegration> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<UserCodeIntegration, UserCodeIntegration> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
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
