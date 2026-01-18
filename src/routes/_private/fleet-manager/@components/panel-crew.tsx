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
      <ItemGroup className="p-4 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center min-h-96">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  return (
    <ItemGroup className="px-0 py-4 gap-4 h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        {crewData.totalOnBoard !== undefined && (
          <div className="px-4 py-2 border-b bg-muted/10 flex items-center gap-2 mb-2">
            <Users className="size-3 text-primary" />
            <span className="text-[10px] uppercase font-bold text-muted-foreground">{t('total.on.board')}:</span>
            <span className="text-xs font-bold">{crewData.totalOnBoard}</span>
          </div>
        )}

        <div className="px-4">
          <Table>
            <TableHeader className="bg-muted/20 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-[10px] uppercase font-bold h-10">{t('name')}</TableHead>
                <TableHead className="text-[10px] uppercase font-bold h-10">{t('boarding')}</TableHead>
                <TableHead className="text-[10px] uppercase font-bold h-10">{t('landing')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewData.people.map((person: any, idx: number) => (
                <TableRow key={`${person.id}-${idx}`} className="hover:bg-accent/50 transition-colors">
                  <TableCell className="py-3 text-xs font-medium">{person.name}</TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3 opacity-50" />
                      {person.boarding ? format(new Date(person.boarding), 'dd MMM yyyy') : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-muted-foreground">
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
