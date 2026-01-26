import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Item, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';

interface ConnectionsVoyageProps {
  voyages: any[]; // The legacy code receives 'data' which is typed as 'IntegrationVoyageDetail[]' in my new hook
}

export function ConnectionsVoyage({ voyages }: ConnectionsVoyageProps) {
  const { t } = useTranslation();
  const kickVoyageFilter = useVoyageIntegrationStore((state) => state.kickVoyageFilter);
  const setKickVoyageFilter = useVoyageIntegrationStore((state) => state.setKickVoyageFilter);

  if (!voyages?.length) return null;

  const getTravels = () => {
    const travelsData = voyages.map((v) => ({ ...v, operations: String(v.operations || '') }));

    const seqFinish = travelsData.slice(-1)[0]?.sequence;
    const seqDeparture = travelsData.find((x) => x.operations?.includes('D'))?.sequence;

    const kicks = [
      {
        source: travelsData.find((x) => x.operations?.includes('S')),
        destiny: travelsData.find((x) => x.operations?.includes('L')),
      },
      {
        source: travelsData.find((x) => x.operations?.includes('L')),
        destiny: travelsData.find((x) => x.operations?.includes('D')),
      },
    ];

    if (seqFinish !== seqDeparture) {
      kicks.push({
        source: travelsData.find((x) => x.operations?.includes('D')),
        destiny: travelsData.slice(-1)[0],
      });
    }

    return kicks;
  };

  const travels = getTravels();

  const handleToggleComplete = () => {
    if (kickVoyageFilter) {
      setKickVoyageFilter(null);
    } else if (travels.length > 0) {
      setKickVoyageFilter({
        dateTimeDeparture: travels[0].source?.dateTimeDeparture,
        dateTimeArrival: travels[0].destiny?.dateTimeArrival,
        dateTimeSourceArrival: travels[0].source?.dateTimeArrival,
        dateTimeDestinyDeparture: travels[0].destiny?.dateTimeDeparture,
        index: 0,
      });
    }
  };

  const handleSelectKick = (x: any, i: number) => {
    const isSelected = kickVoyageFilter?.index === i;
    if (isSelected) {
      setKickVoyageFilter(null);
    } else {
      setKickVoyageFilter({
        dateTimeDeparture: x?.source?.dateTimeDeparture,
        dateTimeArrival: x?.destiny?.dateTimeArrival,
        dateTimeSourceArrival: x?.source?.dateTimeArrival,
        dateTimeDestinyDeparture: x?.destiny?.dateTimeDeparture,
        index: i,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 border-b py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ItemTitle className="text-xs uppercase tracking-wider opacity-70">{t('kick.voyage')}</ItemTitle>
        </div>
        <div className="flex cursor-pointer select-none items-center gap-2" onClick={handleToggleComplete}>
          <Checkbox checked={!kickVoyageFilter} onCheckedChange={handleToggleComplete} />
          <span className="text-[11px] text-muted-foreground">{t('voyage.complete')}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {travels.map((x, i) => {
          const isSelected = kickVoyageFilter?.index === i;
          return (
            <Item
              key={i}
              size="sm"
              variant={isSelected ? 'muted' : 'default'}
              className={cn('cursor-pointer border border-transparent p-2 transition-colors', isSelected && 'border-primary/50')}
              onClick={() => handleSelectKick(x, i)}
            >
              <div className="grid w-full grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <ArrowUpCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="flex flex-col truncate">
                    <span className="truncate font-bold text-xs leading-none">{x.source?.port}</span>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {x.source?.dateTimeDeparture ? formatDate(new Date(x.source.dateTimeDeparture), 'dd MMM, HH:mm') : '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowDownCircle className="mt-0.5 size-4 shrink-0 text-success" />
                  <div className="flex flex-col truncate">
                    <span className="truncate font-bold text-xs leading-none">{x.destiny?.port}</span>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {x.destiny?.dateTimeArrival ? formatDate(new Date(x.destiny.dateTimeArrival), 'dd MMM, HH:mm') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </Item>
          );
        })}
      </div>
    </div>
  );
}
