import { Link } from '@tanstack/react-router';
import { DoorOpen, Edit, MoreVertical, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Status, StatusIndicator, StatusLabel } from '@/components/kibo-ui/status';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { RoleListItem } from '../@interface/role';

interface RoleCardProps {
  role: RoleListItem;
  hasPermissionEdit?: boolean;
  hasPermissionViewUsers?: boolean;
}

export function RoleCard({ role, hasPermissionEdit, hasPermissionViewUsers }: RoleCardProps) {
  const { t } = useTranslation();
  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      public: { status: 'online' as const, labelKey: 'visibility.public' },
      private: { status: 'offline' as const, labelKey: 'visibility.private' },
      limited: { status: 'maintenance' as const, labelKey: 'visibility.limited' },
    };

    const config = variants[visibility as keyof typeof variants] || variants.public;

    return (
      <Status status={config.status} className="h-7">
        <StatusIndicator />
        <StatusLabel className="text-foreground">{t(config.labelKey)}</StatusLabel>
      </Status>
    );
  };

  return (
    <Item variant="outline" className="bg-card">
      <ItemMedia className="size-12 rounded-full border bg-secondary">
        <DoorOpen className="size-6 text-warning" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-lg truncate block">{role.description}</ItemTitle>
        {role.enterprise && <ItemDescription className="truncate block">{role.enterprise.name}</ItemDescription>}
      </ItemContent>

      <ItemActions className="gap-3">
        {getVisibilityBadge(role.visibility)}

        {(hasPermissionEdit || hasPermissionViewUsers) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="size-4" />
                <span className="sr-only">{t('actions')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasPermissionEdit && (
                <DropdownMenuItem asChild>
                  <Link to="/permissions/roles/edit" search={{ id: role.id }}>
                    <Edit className="mr-2 size-4" />
                    {t('edit')}
                  </Link>
                </DropdownMenuItem>
              )}
              {hasPermissionViewUsers && (
                <DropdownMenuItem asChild>
                  <Link to="/permissions/roles/users" search={{ id: role.id }}>
                    <Users className="mr-2 size-4" />
                    {t('users')}
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </ItemActions>
    </Item>
  );
}
