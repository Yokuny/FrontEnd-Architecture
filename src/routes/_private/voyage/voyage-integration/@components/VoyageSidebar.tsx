import { ArrowLeft, Search, X } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useIntegrationVoyages } from '../@hooks/use-voyage-integration-api';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';
import { ItemVoyage } from './ItemVoyage';

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
    <div className="flex h-full w-72 flex-col border-r bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 border-b p-4">
        <Button variant="ghost" size="icon-sm" onClick={() => setSelectedAsset(null)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
          <Input placeholder={t('search')} className="h-9 pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive"
          onClick={() => {
            setSelectedVoyage(null);
            setSelectedAsset(null);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="border-b bg-muted/30 px-4 py-2">
        <p className="truncate font-bold text-[10px] text-muted-foreground uppercase tracking-wider">{selectedAsset?.machine.name}</p>
      </div>

      <ScrollArea className="flex-1">
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
  );
}
