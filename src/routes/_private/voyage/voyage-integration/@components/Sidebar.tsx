import { ChevronRight, Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useEnterprisesSelect } from '@/hooks/use-enterprises-api';
import { cn } from '@/lib/utils';
import { useIntegrationAssets } from '../@hooks/use-voyage-integration-api';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';
import type { IntegrationAsset } from '../@interface/voyage-integration';
import { VoyageSidebar } from './VoyageSidebar';

export function Sidebar() {
  const { t } = useTranslation();
  const idEnterprise = useEnterpriseFilter((state) => state.idEnterprise);
  const setIdEnterprise = useEnterpriseFilter((state) => state.setIdEnterprise);

  const { data: enterprises } = useEnterprisesSelect();

  // Auto-select first enterprise if none selected (Legacy behavior)
  useEffect(() => {
    if (!idEnterprise && enterprises?.length) {
      setIdEnterprise(enterprises[0].id);
    }
  }, [idEnterprise, enterprises, setIdEnterprise]);

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const selectedAsset = useVoyageIntegrationStore((state) => state.selectedAsset);
  const setSelectedAsset = useVoyageIntegrationStore((state) => state.setSelectedAsset);

  const { data: assets, isLoading } = useIntegrationAssets(idEnterprise || '', deferredSearch);

  if (selectedAsset) {
    return <VoyageSidebar />;
  }

  const assetList = assets as IntegrationAsset[] | undefined;

  return (
    <div className="flex h-full w-72 flex-col border-r bg-background/95 backdrop-blur-sm">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute top-3.5 left-2 size-4 text-muted-foreground" />
          <Input placeholder={t('search')} className="pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {isLoading ? (
            <DefaultLoading />
          ) : !assetList || assetList.length === 0 ? (
            <EmptyData />
          ) : (
            assetList.map((asset) => {
              const isActive = (selectedAsset as any)?.idMachine === asset.idMachine;
              return (
                <Item
                  key={asset.idMachine}
                  variant={isActive ? 'muted' : 'default'}
                  className={cn('cursor-pointer items-center transition-colors hover:bg-secondary', isActive && 'border-primary')}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <ItemMedia variant="image">
                    <div className="items-center justify-center text-xs uppercase">{asset.machine.name.trim().substring(0, 2)}</div>
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-sm">{asset.machine.name}</ItemTitle>
                    <ItemDescription className="text-xs">{asset.machine.code}</ItemDescription>
                  </ItemContent>
                  <ChevronRight className="ml-auto size-4" />
                </Item>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
