import { UserPlus } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { useUsersNotInRole } from '@/hooks/use-users-not-in-role';
import type { UserListItem } from '@/routes/_private/permissions/users/@interface/user';

/**
 * UserRoleSelect Component
 *
 * This component filters users in an enterprise that are NOT assigned to a specific role.
 * It follows the single/multi mode pattern.
 */
export function UserRoleSelect(props: UserRoleSelectProps) {
  const { mode, idRole, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useUsersNotInRole(idRole, idEnterprise);

  const noOptionsMessage = !idRole ? 'Selecione um perfil primeiro.' : !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum usuário encontrado.';

  const mapToOptions = (users: UserListItem[]) => {
    return users
      .map((user) => ({
        value: user.id,
        label: user.name,
        data: user,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Usuários para o Perfil';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<UserListItem, UserListItem>
          id={id}
          placeholder={placeholder || 'Selecione os usuários...'}
          value={props.value}
          onChange={(vals) => {
            props.onChange(vals as string[]);
            if (props.setSelectUser) props.setSelectUser(vals);
          }}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar usuário..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum usuário encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Usuário para o Perfil';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<UserListItem, UserListItem>
        id={id}
        placeholder={placeholder || 'Selecione um usuário...'}
        value={props.value}
        onChange={(val) => {
          props.onChange(val as string);
          if (props.setSelectUser) props.setSelectUser(val as string);
        }}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar usuário..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum usuário encontrado."
        className={className}
      />
    </div>
  );
}

interface UserRoleSelectBaseProps {
  idRole?: string;
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  setSelectUser?: (value: any) => void;
}

interface UserRoleSelectSingleProps extends UserRoleSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserRoleSelectMultiProps extends UserRoleSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserRoleSelectProps = UserRoleSelectSingleProps | UserRoleSelectMultiProps;
