import { Clock, Droplet, MapPin, Settings2, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate, formatDistanceToNow } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { VesselEngine, VesselPanelItem } from '../@interface/vessel-panel.types';
import { formatNumber, getStatusByDate } from '../@utils/fleet-panel.utils';
import { Proximity } from './proximity';

function StatusAsset({ engines }: { engines?: VesselEngine[] }) {
  const { t } = useTranslation();
  if (engines?.every((x) => x.isRunning)) {
    return (
      <Badge variant="success" className="uppercase">
        {t('operating')}
      </Badge>
    );
  }
  if (engines?.some((x) => x.isRunning)) {
    return (
      <Badge variant="default" className="uppercase">
        1 MCP ON
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="uppercase">
      {t('stopped')}
    </Badge>
  );
}

export function ItemVessel({ data, onClick }: ItemVesselProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    onClick?.(data.id, data.name);
  };

  const lastUpdated = data?.tree?.lastUpdated;
  const statusVariant = getStatusByDate(lastUpdated);

  return (
    <Item variant="outline" className="cursor-pointer gap-0 p-0" onClick={handleClick}>
      <ItemHeader className="p-3">
        <ItemTitle>{data?.name}</ItemTitle>
        <StatusAsset engines={data?.tree?.engineMain} />
      </ItemHeader>

      <ItemMedia className="w-full border border-none p-0">
        {data?.image?.url ? (
          <img src={data.image.url} alt={data.name} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-muted">
            <ItemDescription>{t('empty')}</ItemDescription>
          </div>
        )}
      </ItemMedia>

      {/* Content */}
      <ItemContent className="flex w-full flex-col gap-2 p-3">
        {lastUpdated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={statusVariant} className="text-xs">
                {formatDistanceToNow(new Date(lastUpdated), { addSuffix: false })}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {t('last.date.acronym')}: {formatDate(new Date(lastUpdated), 'dd MMM yyyy HH:mm')}
            </TooltipContent>
          </Tooltip>
        )}
        {/* Engines - RPM */}
        {data?.tree?.engineMain?.map((engine, i) =>
          engine.rpm !== undefined ? (
            <div key={`${i}${engine.title}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className={cn('size-4', engine.isRunning ? 'animate-spin text-info' : 'text-muted-foreground')} style={{ animationDuration: '2s' }} />
                <Badge variant={engine.isRunning ? 'info' : 'secondary'} className="text-xs">
                  {engine.title}
                </Badge>
              </div>
              <ItemDescription>
                <span className="font-medium text-foreground">{formatNumber(engine.rpm)}</span> RPM
              </ItemDescription>
            </div>
          ) : null,
        )}
        {/* Engines - Load */}
        {data?.tree?.engineMain?.map((engine, i) =>
          engine.load?.value !== undefined ? (
            <div key={`${i}${engine.load?.value}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className={cn('size-4', engine.load?.value ? 'animate-spin text-info' : 'text-muted-foreground')} style={{ animationDuration: '2s' }} />
                <Badge variant={engine.load?.value ? 'info' : 'secondary'} className="text-xs">
                  {engine.title}
                </Badge>
              </div>
              <ItemDescription>
                <span className="font-medium text-foreground">{formatNumber(engine.load?.value)}</span> {engine.load?.unit}
              </ItemDescription>
            </div>
          ) : null,
        )}
        {/* Engines - Consumption */}
        {data?.tree?.engineMain?.map((engine, i) =>
          engine.consumption?.value !== undefined ? (
            <div key={`${i}${engine.consumption?.value}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className={cn('size-4', engine.isRunning ? 'text-info' : 'text-muted-foreground')} />
                <Badge variant={engine.isRunning ? 'info' : 'secondary'} className="text-xs">
                  {engine.title}
                </Badge>
              </div>
              <ItemDescription>
                <span className="font-medium text-foreground">{formatNumber(engine.consumption?.value)}</span> {engine.consumption?.unit}
              </ItemDescription>
            </div>
          ) : null,
        )}
        {/* Engines - Hours */}
        {data?.tree?.engineMain?.map((engine, i) =>
          engine.hoursOperation !== undefined ? (
            <div key={`${i}${engine.title}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={cn('size-4', engine.isRunning ? 'text-info' : 'text-muted-foreground')} />
                <Badge variant={engine.isRunning ? 'info' : 'secondary'} className="text-xs">
                  {engine.title}
                </Badge>
              </div>
              <ItemDescription>
                <span className="font-medium text-foreground">{formatNumber(engine.hoursOperation)}</span> HR
              </ItemDescription>
            </div>
          ) : null,
        )}
        {/* Generators */}
        {data?.tree?.generator?.map((gen, i) => (
          <div key={`${i}${gen.title}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={cn('size-4', gen.isRunning ? 'text-warning' : 'text-muted-foreground')} />
              <Badge variant="secondary" className="text-xs">
                {gen.title}
              </Badge>
            </div>
            <ItemDescription className="font-medium">{gen.isRunning ? 'ON' : 'OFF'}</ItemDescription>
          </div>
        ))}
        {/* Oil Tank */}
        {!!data?.tree?.oilTank?.volume && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="size-4 text-muted-foreground" />
              <ItemDescription>{data.tree.oilTank.type}</ItemDescription>
            </div>
            <ItemDescription>
              <span className="font-medium text-foreground">{formatNumber(data.tree.oilTank.volume, 3)}</span> {data.tree.oilTank.unit}
            </ItemDescription>
          </div>
        )}
        {/* Location */}
        <div className="flex items-center justify-between">
          <MapPin className="size-4 text-muted-foreground" />
          <ItemDescription>{data?.tree?.location?.length ? <Proximity latitude={data.tree.location[0]} longitude={data.tree.location[1]} showFlag /> : '-'}</ItemDescription>
        </div>
      </ItemContent>
    </Item>
  );
}

interface ItemVesselProps {
  data: VesselPanelItem;
  onClick?: (id: string, name: string) => void;
}
