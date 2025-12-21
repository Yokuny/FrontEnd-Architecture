import { Link } from '@tanstack/react-router';
import { Edit, Lock, MoreVertical, Shield, User } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { UserListItem } from '../@interface/user';

interface UserCardProps {
  user: UserListItem;
  hasPermissionEdit?: boolean;
  hasPermissionPermissions?: boolean;
  hasPermissionPassword?: boolean;
}

export function UserCard({ user, hasPermissionEdit, hasPermissionPermissions, hasPermissionPassword }: UserCardProps) {
  const isDisabled = !!user.disabledAt;
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className={isDisabled ? 'opacity-60' : ''}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image?.url} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{user.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {user.types?.map((type) => (
                <Badge key={type.description} variant={isDisabled ? 'outline' : 'default'} style={{ backgroundColor: type.color }}>
                  {type.description}
                </Badge>
              ))}
            </div>

            <Badge variant={isDisabled ? 'destructive' : user.isOnlyContact ? 'secondary' : 'default'}>
              <User className="mr-1 h-3 w-3" />
              <FormattedMessage id={isDisabled ? 'user.disabled' : user.isOnlyContact ? 'just.contact' : 'user.system'} />
            </Badge>

            {(hasPermissionEdit || hasPermissionPermissions || hasPermissionPassword) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {hasPermissionPermissions && user.userEnterprise && (
                    <DropdownMenuItem asChild>
                      <Link to="/permissions/users/permissions/add" search={user.userEnterprise.length === 1 ? { id: user.userEnterprise[0].id } : { idRef: user.id }}>
                        <Shield className="mr-2 h-4 w-4" />
                        <FormattedMessage id="permissions" />
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {hasPermissionEdit && (
                    <DropdownMenuItem asChild>
                      <Link to="/permissions/users/edit/$id" params={{ id: user.id }}>
                        <Edit className="mr-2 h-4 w-4" />
                        <FormattedMessage id="edit" />
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {hasPermissionPassword && !user.isOnlyContact && (
                    <DropdownMenuItem asChild>
                      <Link to="/permissions/users/password/$id" params={{ id: user.id }}>
                        <Lock className="mr-2 h-4 w-4" />
                        <FormattedMessage id="new.password" />
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
