import { useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import type { MonitoringPlanItem as MonitoringPlanItemType } from '../@interface/monitoring-plan.types';
import { EditEventScheduleDialog } from './edit-event-schedule-dialog';

interface MonitoringPlanItemProps {
  planItem: MonitoringPlanItemType;
  idMachine: string;
}

export function MonitoringPlanItem({ planItem, idMachine }: MonitoringPlanItemProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Color logic based on legacy ItemMonitoringPlan.jsx
  const getStatusColor = () => {
    if (planItem.expired) return getChartColor(8); // Red
    if (planItem.next) return getChartColor(9); // Orange
    if (planItem.warning) return getChartColor(10); // Amber
    if (planItem.daysLeft) return getChartColor(13); // Green
    return getChartColor(14);
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['monitoring-plans'] });
  };

  const chartData = [
    { name: 'Progress', value: planItem.percentual },
    { name: 'Remaining', value: Math.max(0, 100 - planItem.percentual) },
  ];

  const statusColor = getStatusColor();

  return (
    <EditEventScheduleDialog idMachine={idMachine} idMaintenancePlan={planItem.idMaintenancePlan} dateWindowEnd={planItem.dateWindowEnd} onSuccess={handleSuccess}>
      <Item variant="outline" className="cursor-pointer bg-secondary p-2 px-4">
        <ItemContent className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <ItemTitle className="font-medium text-base">{planItem.description}</ItemTitle>
            <div className="flex items-stretch gap-4">
              <div className="flex shrink-0 gap-1.5">
                {planItem.expired && <Badge className="bg-red-600 px-2 font-bold text-white text-xs uppercase ring-0 hover:bg-red-500">{t('expired')}</Badge>}
                {planItem.warning && <Badge className="bg-amber-600 px-2 font-bold text-white text-xs uppercase ring-0 hover:bg-amber-500">{t('next')}</Badge>}
                {planItem.next && !planItem.expired && (
                  <Badge variant="error" className="px-2 font-bold text-xs uppercase">
                    {t('next')}
                  </Badge>
                )}
              </div>

              {planItem.daysLeft !== null && (
                <ItemTitle className="tabular-nums" style={{ color: statusColor }}>
                  {planItem.daysLeft} {t('days')}
                </ItemTitle>
              )}
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <ItemTitle className="font-semibold text-lg">{planItem.dateWindowEnd ? formatDate(planItem.dateWindowEnd, 'dd MM yyyy') : '-'}</ItemTitle>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                {t('date.window.end')}
              </div>
            </div>

            <div className="relative size-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="75%" outerRadius="100%" startAngle={90} endAngle={-270} paddingAngle={0} dataKey="value">
                    <Cell key="progress" fill={statusColor} stroke="none" />
                    <Cell key="remaining" fill="var(--accent)" stroke="none" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <ItemTitle className="font-bold text-xs">{planItem.percentual}%</ItemTitle>
              </div>
            </div>
          </div>
        </ItemContent>
      </Item>
    </EditEventScheduleDialog>
  );
}
