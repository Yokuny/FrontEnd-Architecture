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
import { useIntegrationAssets } from '../@hooks/use-voyage-integration-api';
import { Route } from '../index';

export function AssetsPanel() {
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

  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  const { data: assets, isLoading } = useIntegrationAssets(idEnterprise || '', deferredSearch);

  return (
    <div className="flex h-full w-72 flex-col border-r bg-background/95 backdrop-blur-sm transition-opacity duration-300">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute top-4 left-2 size-3 text-muted-foreground" />
          <Input placeholder={t('search')} className="pl-6 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 p-2">
            {isLoading ? (
              <DefaultLoading />
            ) : !assets || assets.length === 0 ? (
              <EmptyData />
            ) : (
              assets.map((asset) => (
                <Item
                  key={asset.idMachine}
                  className="cursor-pointer items-center transition-colors hover:bg-secondary"
                  onClick={() => navigate({ search: { ...searchParams, idMachine: asset.idMachine, search: asset.machine.name, code: undefined } })}
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
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
