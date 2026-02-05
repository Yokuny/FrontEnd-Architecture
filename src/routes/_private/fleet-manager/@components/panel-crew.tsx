import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ItemGroup } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetCrew } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetCrewPanel() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const { selectedMachineId } = useFleetManagerStore();

  const { data: crewData, isLoading } = useFleetCrew(selectedMachineId, idEnterprise) as any;
  if (!selectedMachineId) return null;

  if (isLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!crewData?.people || crewData.people.length === 0) {
    return (
      <ItemGroup className="flex-1 p-4">
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  return (
    <ItemGroup className="flex h-full flex-col gap-4 px-0 py-4">
      <div className="flex-1 overflow-auto">
        {crewData.totalOnBoard !== undefined && (
          <div className="mb-2 flex items-center gap-2 border-b bg-muted/10 px-4 py-2">
            <Users className="size-3 text-primary" />
            <span className="font-bold text-[10px] text-muted-foreground uppercase">{t('total.on.board')}:</span>
            <span className="font-bold text-xs">{crewData.totalOnBoard}</span>
          </div>
        )}

        <div className="px-4">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted/20">
              <TableRow>
                <TableHead className="h-10 font-bold text-[10px] uppercase">{t('name')}</TableHead>
                <TableHead className="h-10 font-bold text-[10px] uppercase">{t('boarding')}</TableHead>
                <TableHead className="h-10 font-bold text-[10px] uppercase">{t('landing')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewData.people.map((person: any, idx: number) => (
                <TableRow key={`${person.id}${idx}`} className="transition-colors hover:bg-accent/50">
                  <TableCell className="py-3 font-medium text-xs">{person.name}</TableCell>
                  <TableCell className="py-3 text-muted-foreground text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3 opacity-50" />
                      {person.boarding ? format(new Date(person.boarding), 'dd MMM yyyy') : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3 opacity-50" />
                      {person.landing ? format(new Date(person.landing), 'dd MMM yyyy') : '-'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ItemGroup>
  );
}
