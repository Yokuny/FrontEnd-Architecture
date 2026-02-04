import { UserPlus } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapUserTypesToOptions, type UserType, useUserTypesSelect } from '@/hooks/use-user-types-api';

export function UserTypeSelect(props: UserTypeSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useUserTypesSelect(idEnterprise);

  const displayLabel = label || t('user.type');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('user.type'),
    query,
    mapToOptions: mapUserTypesToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <UserPlus className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<UserType, UserType> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<UserType, UserType> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
    </div>
  );
}

interface UserTypeSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserTypeSelectSingleProps extends UserTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserTypeSelectMultiProps extends UserTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserTypeSelectProps = UserTypeSelectSingleProps | UserTypeSelectMultiProps;
