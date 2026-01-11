import { createFileRoute } from '@tanstack/react-router';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { DataContainer } from '../@components/data-container';
import { FleetWindMap } from '../@components/fleet-wind-map';

export const Route = createFileRoute('/_private/fleet-manager/wind/')({
  component: WindMapPage,
  beforeLoad: () => ({
    title: 'fleet.wind',
  }),
});

function WindMapPage() {
  const { idEnterprise } = useEnterpriseFilter();
  const isMobile = useIsMobile();

  return (
    <div className={cn('h-full flex flex-col', isMobile ? '' : 'relative')}>
      <div className={cn('text-foreground', isMobile ? 'h-[70%] relative shrink-0' : 'fixed inset-0 z-0')}>
        <FleetWindMap idEnterprise={idEnterprise} />
      </div>

      <div className={cn(isMobile ? 'flex-1 relative' : 'fixed ml-14 inset-0 z-1000 pointer-events-none')}>
        <DataContainer idEnterprise={idEnterprise} />
      </div>
    </div>
  );
}
