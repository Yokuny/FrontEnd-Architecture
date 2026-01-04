import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useFleetMachines, useFleetVoyages } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

interface FleetSidebarProps {
  idEnterprise?: string;
}

export function FleetSidebar({ idEnterprise }: FleetSidebarProps) {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, searchText, setSearchText, selectedMachineId, setSelectedMachineId, selectedVoyageId, setSelectedVoyageId } = useFleetManagerStore();

  const { data: machines, isLoading: isLoadingMachines } = useFleetMachines({
    idEnterprise,
    search: searchText,
  });

  const { data: voyagesData, isLoading: isLoadingVoyages } = useFleetVoyages({
    idEnterprise,
    search: searchText,
    page: 0,
    size: 50, // Simplified for now
  });

  const voyages = voyagesData?.data || [];

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full shadow-sm z-10">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold tabular-nums tracking-tight">{t('fleet.manager')}</h2>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            className="pl-9 h-9 border-muted-foreground/20 focus-visible:ring-primary/30"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <button type="button" className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSearchText('')}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'assets' | 'voyages')}>
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="assets" className="text-xs">
              {t('active.owner')}
            </TabsTrigger>
            <TabsTrigger value="voyages" className="text-xs">
              {t('travel')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <ItemGroup className="p-2 gap-1 border-none shadow-none bg-transparent">
          {activeTab === 'assets' && (
            <div>
              {isLoadingMachines ? (
                <DefaultLoading />
              ) : machines?.length === 0 ? (
                <EmptyData />
              ) : (
                machines?.map((item) => (
                  <Item
                    key={item.machine.id}
                    asChild
                    variant="default"
                    size="sm"
                    className={cn(
                      'w-full text-left p-3 rounded-md border-l-2 transition-all cursor-pointer list-none',
                      selectedMachineId === item.machine.id ? 'bg-accent border-l-primary shadow-sm' : 'border-l-transparent hover:bg-accent/50',
                    )}
                    onClick={() => setSelectedMachineId(item.machine.id)}
                  >
                    <button type="button">
                      <ItemContent className="flex flex-col items-start gap-1 text-left">
                        <ItemTitle className="font-medium text-sm truncate">{item.machine.name}</ItemTitle>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className={`size-2 rounded-full ${item.status === 'OPERATING' ? 'bg-green-500' : 'bg-slate-400'}`} />
                          {item.machine.code || item.machine.id}
                        </div>
                      </ItemContent>
                    </button>
                  </Item>
                ))
              )}
            </div>
          )}

          {activeTab === 'voyages' && (
            <div>
              {isLoadingVoyages ? (
                <DefaultLoading />
              ) : voyages.length === 0 ? (
                <EmptyData />
              ) : (
                voyages.map((item) => (
                  <Item
                    key={item.id}
                    asChild
                    variant="default"
                    size="sm"
                    className={cn(
                      'w-full text-left p-3 rounded-md border-l-2 transition-all cursor-pointer list-none',
                      selectedVoyageId === item.id ? 'bg-accent border-l-primary shadow-sm' : 'border-l-transparent hover:bg-accent/50',
                    )}
                    onClick={() => setSelectedVoyageId(item.id)}
                  >
                    <button type="button">
                      <ItemContent className="flex flex-col items-start gap-1 text-left">
                        <ItemTitle className="font-medium text-sm truncate">{item.code}</ItemTitle>
                        <div className="text-xs text-muted-foreground truncate">{item.machine?.name}</div>
                        <div className="text-[10px] text-muted-foreground/70 flex justify-between w-full">
                          <span>{item.portPointStart?.code}</span>
                          <span>→</span>
                          <span>{item.portPointEnd?.code || '...'}</span>
                        </div>
                      </ItemContent>
                    </button>
                  </Item>
                ))
              )}
            </div>
          )}
        </ItemGroup>
      </ScrollArea>
    </div>
  );
}
