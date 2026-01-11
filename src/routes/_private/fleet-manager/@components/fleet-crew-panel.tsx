import { format } from 'date-fns';
import { Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Item, ItemDescription, ItemMedia } from '@/components/ui/item';
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

  return (
    <div className="p-0">
      {isLoading ? (
        <div className="p-8">
          <DefaultLoading />
        </div>
      ) : !crewData?.people || crewData.people.length === 0 ? (
        <Item className="py-12 flex flex-col text-center">
          <ItemMedia>
            <Users className="size-8 opacity-20" />
          </ItemMedia>
          <ItemDescription className="font-medium">{t('crew.empty')}</ItemDescription>
        </Item>
      ) : (
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
              <TableRow key={idx} className="hover:bg-accent/50 transition-colors">
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
      )}
    </div>
  );
}
