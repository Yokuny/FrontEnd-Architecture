import { Link } from '@tanstack/react-router';
import { Edit, Lock, MoreVertical, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Status, StatusIndicator, StatusLabel } from '@/components/kibo-ui/status';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { UserListItem } from '../@interface/user';

interface UserCardProps {
  user: UserListItem;
  hasPermissionEdit?: boolean;
  hasPermissionPermissions?: boolean;
  hasPermissionPassword?: boolean;
}

export function UserCard({ user, hasPermissionEdit, hasPermissionPermissions, hasPermissionPassword }: UserCardProps) {
  const { t } = useTranslation();
  const isDisabled = !!user.disabledAt;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getStatusConfig = () => {
    if (isDisabled) return { status: 'offline' as const, label: 'user.disabled' };
    if (user.isOnlyContact) return { status: 'maintenance' as const, label: 'just.contact' };
    return { status: 'online' as const, label: 'user.system' };
  };

  const statusConfig = getStatusConfig();

  return (
    <Item variant="outline" className={cn('bg-card', isDisabled && 'opacity-60')}>
      <ItemMedia>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image?.url} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="font-semibold block truncate">{user.name}</ItemTitle>
        <ItemDescription className="block truncate">{user.email}</ItemDescription>
      </ItemContent>

      <ItemActions className="gap-3">
        <div className="flex flex-wrap gap-2">
          {user.types?.map((type) => (
            <Badge key={type.description} variant={isDisabled ? 'outline' : 'default'} style={{ backgroundColor: type.color }}>
              {type.description}
            </Badge>
          ))}
        </div>

        <Status status={statusConfig.status} className="h-7">
          <StatusIndicator />
          <StatusLabel className="text-foreground">{t(statusConfig.label)}</StatusLabel>
        </Status>

        {(hasPermissionEdit || hasPermissionPermissions || hasPermissionPassword) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasPermissionPermissions && user.userEnterprise && (
                <DropdownMenuItem asChild>
                  <Link to="/permissions/users/permissions-add" search={user.userEnterprise.length === 1 ? { id: user.userEnterprise[0].id } : { idRef: user.id }}>
                    <Shield className="mr-2 size-4" />
                    {t('permissions')}
                  </Link>
                </DropdownMenuItem>
              )}
              {hasPermissionEdit && (
                <DropdownMenuItem asChild>
                  <Link to="/permissions/users/edit" search={{ id: user.id }}>
                    <Edit className="mr-2 size-4" />
                    {t('edit')}
                  </Link>
                </DropdownMenuItem>
              )}
              {hasPermissionPassword && !user.isOnlyContact && (
                <DropdownMenuItem asChild>
                  <Link to="/permissions/users/password" search={{ id: user.id }}>
                    <Lock className="mr-2 size-4" />
                    {t('new.password')}
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
