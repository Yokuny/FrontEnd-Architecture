import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Pie, PieChart } from 'recharts';
import DefaultEmpty from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { useTimeOperationDetails } from '@/hooks/use-statistics-api';

const chartConfig = {
  minutes: {
    label: 'Minutes',
  },
} as any;

export function TimeOperationDetailsDialog({ open, onOpenChange, item, filters }: TimeOperationDetailsDialogProps) {
  const { t } = useTranslation();

  const { data: rawData, isLoading } = useTimeOperationDetails(item?.machine?.id, filters);
  const data = rawData as any;

  const formatData = (seriesData: any[]) => {
    if (!seriesData) return [];
    return seriesData.map((d, index) => ({
      name: d.name,
      value: d.y,
      fill: d.color || getChartColor(index),
    }));
  };

  const hasDP = item?.listTimeStatus?.some((x: any) => x.status?.toLowerCase().includes('dp'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item?.machine?.name}</DialogTitle>
          <DialogDescription>
            <ItemDescription>
              {filters.min && format(new Date(filters.min), 'dd MMM yyyy, HH:mm')}
              {filters.max && ` - ${format(new Date(filters.max), 'dd MMM yyyy, HH:mm')}`}
            </ItemDescription>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <DefaultLoading />
        ) : !data || !data?.plataform.length || !data?.fence.length || !data?.atAnchor.length ? (
          <DefaultEmpty />
        ) : (
          <div className="flex flex-col gap-4 md:flex-row">
            {hasDP && (
              <Item variant="outline" className="flex-col items-stretch">
                <ItemHeader className="flex-col items-center pb-0">
                  <ItemTitle>{t('dp')}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie data={formatData(data?.plataform)} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
                      <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
                    </PieChart>
                  </ChartContainer>
                </ItemContent>
              </Item>
            )}

            {data?.fence && data?.fence.length > 0 && (
              <Item variant="outline" className="flex-col items-stretch">
                <ItemHeader className="flex-col items-center pb-0">
                  <ItemTitle>{t('fence')}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie data={formatData(data?.fence)} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
                      <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
                    </PieChart>
                  </ChartContainer>
                </ItemContent>
              </Item>
            )}

            {data?.atAnchor && data?.atAnchor.length > 0 && (
              <Item variant="outline" className="flex-col items-stretch">
                <ItemHeader className="flex-col items-center pb-0">
                  <ItemTitle>{t('at.anchor')}</ItemTitle>
                </ItemHeader>
                <ItemContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie data={formatData(data?.atAnchor)} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
                      <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
                    </PieChart>
                  </ChartContainer>
                </ItemContent>
              </Item>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface TimeOperationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any; // Using any for now to match the legacy flexible structure, can be typed later
  filters: any;
}
