import { format } from 'date-fns';
import { Calendar, Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetCrew, useMachineDetails } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetCrewPanel() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const { selectedMachineId, setSelectedPanel } = useFleetManagerStore();

  const { data: machineData } = useMachineDetails(selectedMachineId) as any;
  const { data: crewData, isLoading } = useFleetCrew(selectedMachineId, idEnterprise) as any;

  const onClose = () => setSelectedPanel('details');

  if (!selectedMachineId) return null;

  return (
    <ItemGroup className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] z-1001 flex flex-col shadow-2xl border border-primary/10 rounded-xl overflow-hidden bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom-4 pointer-events-auto">
      <Item size="sm" className="p-4 border-b border-primary/10 rounded-none bg-muted/30">
        <ItemHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <ItemTitle className="text-sm font-bold tracking-tight">
                {machineData?.machine?.name} - {t('crew')}
              </ItemTitle>
              <ItemDescription className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{t('total.on.board')}:</span>
                <span className="text-xs font-bold text-primary">{crewData?.totalOnBoard || 0}</span>
              </ItemDescription>
            </div>
          </div>
          <ItemActions>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
      </Item>

      <ScrollArea className="flex-1 no-scrollbar">
        <div className="p-0">
          {isLoading ? (
            <div className="p-8">
              <DefaultLoading />
            </div>
          ) : !crewData?.people || crewData.people.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <Users className="size-8 mb-2 opacity-20" />
              <p className="text-xs font-medium">{t('crew.empty')}</p>
            </div>
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
      </ScrollArea>
    </ItemGroup>
  );
}
