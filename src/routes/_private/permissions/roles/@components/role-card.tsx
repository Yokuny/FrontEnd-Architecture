import { Link } from '@tanstack/react-router';
import { Edit, MoreVertical, Shield, Users } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { RoleListItem } from '../@interface/role';

interface RoleCardProps {
  role: RoleListItem;
  hasPermissionEdit?: boolean;
  hasPermissionViewUsers?: boolean;
}

export function RoleCard({ role, hasPermissionEdit, hasPermissionViewUsers }: RoleCardProps) {
  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      public: { variant: 'default' as const, icon: '👁️', labelKey: 'visibility.public' },
      private: { variant: 'secondary' as const, icon: '🔒', labelKey: 'visibility.private' },
      limited: { variant: 'outline' as const, icon: '👥', labelKey: 'visibility.limited' },
    };

    const config = variants[visibility as keyof typeof variants] || variants.public;

    return (
      <Badge variant={config.variant} className="gap-1">
        <span>{config.icon}</span>
        <FormattedMessage id={config.labelKey} />
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10">
              <Shield className="size-6 text-warning" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{role.description}</h3>
              {role.enterprise && <p className="text-sm text-muted-foreground truncate">{role.enterprise.name}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getVisibilityBadge(role.visibility)}

            {(hasPermissionEdit || hasPermissionViewUsers) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                    <span className="sr-only">
                      <FormattedMessage id="actions" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {hasPermissionEdit && (
                    <DropdownMenuItem asChild>
                      <Link to="/permissions/roles/edit/$id" params={{ id: role.id }}>
                        <Edit className="mr-2 size-4" />
                        <FormattedMessage id="edit" />
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {hasPermissionViewUsers && (
                    <DropdownMenuItem asChild>
                      <Link to="/permissions/roles/users/$id" params={{ id: role.id }}>
                        <Users className="mr-2 size-4" />
                        <FormattedMessage id="users" />
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
