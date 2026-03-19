import { Link, useMatchRoute } from '@tanstack/react-router';
import IconCalendar from '@/components/icons/Calender.Icon';
import IconDental from '@/components/icons/Dental.Icon';
import IconDollar from '@/components/icons/Dollar.Icon';
import IconGear from '@/components/icons/Gear.Icon';
import IconPatients from '@/components/icons/Patients.Icon';
import { t } from '@/lib/helpers/translate';
import { cn } from '@/lib/utils';

const dockItems = [
  { to: '/schedule', icon: IconCalendar, labelKey: 'schedule' },
  { to: '/patient', icon: IconPatients, labelKey: 'patient' },
  { to: '/odontogram', icon: IconDental, labelKey: 'odontogram' },
  { to: '/financial', icon: IconDollar, labelKey: 'financial' },
  { to: '/settings', icon: IconGear, labelKey: 'settings' },
] as const;

export function MobileDock() {
  const matchRoute = useMatchRoute();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {dockItems.map(({ to, icon: Icon, labelKey }) => {
          const isActive = !!matchRoute({ to, fuzzy: true });

          return (
            <Link key={to} to={to} className={cn('flex flex-1 flex-col items-center gap-1 py-2 text-muted-foreground transition-colors', isActive && 'text-foreground')}>
              <Icon className="size-5" />
              <span className="font-mono text-[10px] leading-none">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
