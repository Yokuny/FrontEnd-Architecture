import { Users } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import type { UserTeamMember } from '@/hooks/use-user-team-api';
import { mapUserTeamToOptions, useUserTeamSelect } from '@/hooks/use-user-team-api';

export function UserTeamSelect(props: UserTeamSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useUserTeamSelect(idEnterprise);

  const displayLabel = label || t('group');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('group'),
    query,
    mapToOptions: mapUserTeamToOptions,
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
          <Users className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<UserTeamMember, UserTeamMember> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<UserTeamMember, UserTeamMember> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
    </div>
  );
}

interface UserTeamSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserTeamSelectSingleProps extends UserTeamSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserTeamSelectMultiProps extends UserTeamSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserTeamSelectProps = UserTeamSelectSingleProps | UserTeamSelectMultiProps;
