import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { Activity, KeyRound, LayoutDashboard, Lock, Mail, User } from 'lucide-react';
import { useUserQuery } from '@/query/user';

export const Route = createFileRoute('/_private/settings')({
  component: SettingsLayout,
});

function SettingsLayout() {
  const { data: user } = useUserQuery();

  const isAdmin = user?.role?.includes('admin') || false;

  const navigationLinks = [
    { to: '/settings/profile', label: 'Perfil', icon: User, adminOnly: false },
    { to: '/settings/clinic', label: 'Clínica', icon: Activity, adminOnly: true },
    { to: '/settings/procedures', label: 'Serviços', icon: LayoutDashboard, adminOnly: true },
    { to: '/settings/invite', label: 'Convites', icon: Mail, adminOnly: true },
    { to: '/settings/permissions', label: 'Permissões', icon: Lock, adminOnly: true },
    { to: '/settings/access', label: 'Acesso', icon: KeyRound, adminOnly: false },
  ];

  const visibleLinks = navigationLinks.filter((nav) => !nav.adminOnly || isAdmin);

  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      <aside className="w-full flex-shrink-0 md:w-64">
        <nav className="scrollbar-none flex gap-2 overflow-x-auto pb-4 md:flex-col md:pb-0">
          {visibleLinks.map((nav) => {
            const IconComponent = nav.icon;

            return (
              <Link
                key={nav.to}
                to={nav.to}
                activeProps={{
                  className: 'bg-primary text-primary-foreground',
                }}
                inactiveProps={{
                  className: 'text-muted-foreground hover:bg-muted hover:text-foreground',
                }}
                className="flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 font-medium text-sm transition-colors"
                preload="intent"
              >
                <IconComponent className="size-4 shrink-0" />
                {nav.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="w-full min-w-0 max-w-4xl flex-1">
        <Outlet />
      </div>
    </div>
  );
}
