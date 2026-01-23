import { AlertCircle, CheckCircle2, ChevronDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ItemContent, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Asset, NormalizedRVERDO } from '../@interface/rve-rdo.types';
import { RVERDOTable } from './RVERDOTable';

interface RVERDOItemProps {
  asset: Asset;
  data: NormalizedRVERDO[];
  showInoperabilities: boolean;
}

export function RVERDOItem({ asset, data, showInoperabilities }: RVERDOItemProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const totals = data.reduce(
    (acc, b) => {
      let estimated = b.consumptionEstimated || 0;

      if (!showInoperabilities && b.operations.some((x) => x.code?.slice(0, 2) === 'IN')) {
        estimated = b.operations.filter((x) => x.code?.slice(0, 2) !== 'IN').reduce((accInt, op) => accInt + estimated / (24 / op.diffInHours), 0);
      }

      const dailyMax = b.operations.reduce((accInt, op) => accInt + (op.consumptionDailyContract ? (op.consumptionDailyContract / 24) * op.diffInHours : 0), 0);

      return {
        estimated: acc.estimated + estimated,
        max: acc.max + dailyMax,
        hasNull: acc.hasNull || b.consumptionEstimated === undefined,
      };
    },
    { estimated: 0, max: 0, hasNull: false },
  );

  const exceeded = totals.max < totals.estimated;
  const diffPercent = totals.estimated ? (1 - totals.max / totals.estimated) * 100 : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="rounded-lg border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 border">
            <AvatarImage src={asset.image.url} alt={asset.name} className="object-cover" />
            <AvatarFallback>{asset.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ItemContent>
            <ItemTitle className="text-lg">{asset.name}</ItemTitle>
          </ItemContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className={cn('h-auto gap-2 py-1 text-white', exceeded ? 'bg-red-500' : 'bg-blue-500')}>
                  {exceeded ? <TrendingUp className="size-4" /> : <CheckCircle2 className="size-4" />}
                  <span className="font-bold font-mono">{diffPercent.toFixed(1)}%</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 text-xs">
                  <p>
                    {t('consumption.max')}: <strong>{totals.max.toFixed(3)} m³</strong>
                  </p>
                  <p>
                    {t('consume')} {t('estimated')}: <strong>{totals.estimated.toFixed(3)} m³</strong>
                  </p>
                  <p>
                    {t('diff')}: <strong>{(totals.estimated - totals.max).toFixed(3)} m³</strong>
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-4">
          {totals.hasNull && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex animate-pulse items-center gap-1 text-amber-500">
                    <AlertCircle className="size-5" />
                    <span className="hidden font-bold text-xs uppercase md:inline">{t('null.consumption.estimated')}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{t('null.consumption.estimated')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {exceeded && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex animate-pulse items-center gap-1 text-red-500">
                    <AlertCircle className="size-5" />
                    <span className="hidden font-bold text-xs uppercase md:inline">{t('consumption.exceeded')}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{t('consumption.exceeded')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown className={cn('size-5 transition-transform duration-200', isOpen && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        <div className="px-4 pb-4">
          <RVERDOTable data={data} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
