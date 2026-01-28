import { ArrowLeft, ArrowRight, Box, Package, Search } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { useIntegrationVoyages } from '../@hooks/use-voyage-integration-api';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';
import type { IntegrationVoyage } from '../@interface/voyage-integration';

interface ItemVoyageProps {
  item: IntegrationVoyage;
  isActive?: boolean;
  onClick?: () => void;
}

function ItemVoyage({ item, isActive, onClick }: ItemVoyageProps) {
  return (
    <Item
      variant={isActive ? 'muted' : 'default'}
      className={cn('cursor-pointer flex-col items-stretch gap-2 transition-colors hover:bg-accent/50', isActive && 'border-primary')}
      onClick={onClick}
    >
      <ItemTitle className="font-bold text-sm">{item.code}</ItemTitle>

      <ItemContent className="gap-2">
        <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
          <div className="flex flex-1 flex-col truncate">
            <span className="font-medium text-foreground">{item.portStart || '-'}</span>
            <span>{item.dateTimeStart ? formatDate(new Date(item.dateTimeStart), 'dd MMM, HH:mm') : '-'}</span>
          </div>
          <ArrowRight className="size-4 shrink-0 opacity-50" />
          <div className="flex flex-1 flex-col truncate text-right">
            <span className="font-medium text-foreground">{item.portEnd || '-'}</span>
            <span>{item.dateTimeLastArrival ? formatDate(new Date(item.dateTimeLastArrival), 'dd MMM, HH:mm') : '-'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dashed pt-2">
          <div className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
            <Package className="size-3.5" />
            <span className="truncate">{item.loadDescription || '-'}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            <Box className="size-3.5" />
            <span>{item.loadWeight?.toFixed(1) || '0.0'} T</span>
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}

export function VoyageSidebar() {
  const { t } = useTranslation();
  const idEnterprise = useEnterpriseFilter((state) => state.idEnterprise);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const selectedAsset = useVoyageIntegrationStore((state) => state.selectedAsset);
  const setSelectedAsset = useVoyageIntegrationStore((state) => state.setSelectedAsset);
  const selectedVoyage = useVoyageIntegrationStore((state) => state.selectedVoyage);
  const setSelectedVoyage = useVoyageIntegrationStore((state) => state.setSelectedVoyage);

  const { data: voyages, isLoading } = useIntegrationVoyages(idEnterprise || '', selectedAsset?.idMachine || null);

  const filteredVoyages = voyages?.filter(
    (v) =>
      v.code.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      v.portStart?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      v.portEnd?.toLowerCase().includes(deferredSearch.toLowerCase()),
  );

  return (
    <div
      className={cn(
        'flex h-full w-72 flex-col border-r bg-background/95 backdrop-blur-sm transition-opacity duration-300',
        selectedVoyage ? 'opacity-50 hover:opacity-100' : 'opacity-100',
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <Button onClick={() => setSelectedAsset(null)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute top-4 left-2 size-3 text-muted-foreground" />
          <Input placeholder={t('search')} className="h-9 pl-6 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="border-b bg-muted/30 px-4 py-2">
        <p className="truncate font-bold text-[10px] text-muted-foreground uppercase tracking-wider">{selectedAsset?.machine.name}</p>
      </div>
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 p-2">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : filteredVoyages?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs">{t('no.data.found')}</div>
            ) : (
              filteredVoyages?.map((voyage) => (
                <ItemVoyage key={voyage.idVoyage} item={voyage} isActive={selectedVoyage?.idVoyage === voyage.idVoyage} onClick={() => setSelectedVoyage(voyage)} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
