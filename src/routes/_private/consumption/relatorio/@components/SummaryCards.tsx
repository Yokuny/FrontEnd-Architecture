import { Clock, CloudUpload, Droplet, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { ConsumptionIntervalData } from '../@interface/consumption-interval.types';

export function SummaryCards({ data, unit, isReal }: SummaryCardsProps) {
  const { t } = useTranslation();

  const totalConsumption = data?.reduce((acc, curr) => acc + ((isReal ? curr?.consumptionReal?.value : curr?.consumption?.value) || 0), 0);
  const totalHours = data?.reduce((acc, curr) => acc + (curr?.hours || 0), 0);
  const totalCo2 = data?.reduce((acc, curr) => acc + ((isReal ? curr?.consumptionReal?.co2 : curr?.consumption?.co2) || 0), 0);
  const average = totalHours > 0 ? totalConsumption / totalHours : 0;

  const cards = [
    {
      title: `${t('consumption')} ${unit}`,
      value: totalConsumption.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: Droplet,
      color: isReal ? 'text-sky-600' : 'text-amber-600',
    },
    {
      title: t('hours'),
      value: totalHours.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: Clock,
      color: isReal ? 'text-blue-800' : 'text-amber-800',
    },
    {
      title: `${t('average')} ${unit}/HR`,
      value: average.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: Droplets,
      color: isReal ? 'text-sky-600' : 'text-amber-600',
    },
    {
      title: 'CO₂ Ton',
      value: (totalCo2 / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: CloudUpload,
      color: 'text-zinc-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Item key={`${card.title}-${index}`} variant="outline">
          <ItemContent>
            <div className="flex items-center gap-2">
              <card.icon className={cn('size-5', card.color)} />
              <ItemDescription className="text-sm font-medium">{card.title}</ItemDescription>
            </div>
            <ItemTitle className="text-2xl font-bold">{card.value}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}

interface SummaryCardsProps {
  data: ConsumptionIntervalData[];
  unit: string;
  isReal: boolean;
}
