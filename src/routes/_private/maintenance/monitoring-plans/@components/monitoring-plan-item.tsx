import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
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
    if (planItem.expired) return 'var(--color-hue-red)';
    if (planItem.next) return 'var(--color-hue-orange)';
    if (planItem.warning) return 'var(--color-hue-amber)';
    if (planItem.daysLeft) return 'var(--color-hue-green)';
    return 'var(--color-ui-hard)';
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
      <Item variant="outline" className="cursor-pointer p-2 px-4 bg-secondary">
        <ItemContent className="flex w-full flex-row justify-between items-center">
          {/* Titulo e status */}
          <div className="flex flex-col gap-2">
            <ItemTitle className="font-medium text-base">{planItem.description}</ItemTitle>
            <div className="flex gap-4 items-center">
              <div className="flex gap-1.5 shrink-0">
                {planItem.expired && <Badge className="bg-hue-red/80 hover:bg-hue-red text-[9px] px-1.5 h-4.5 uppercase font-bold">{t('expired')}</Badge>}
                {planItem.next && !planItem.expired && (
                  <Badge variant="destructive" className="text-[9px] px-1.5 h-4.5 uppercase font-bold">
                    {t('next')}
                  </Badge>
                )}
                {planItem.warning && <Badge className="bg-hue-amber/80 hover:bg-hue-amber text-[9px] px-1.5 h-4.5 uppercase font-bold">{t('next')}</Badge>}
              </div>

              {planItem.daysLeft !== null && (
                <p className="font-semibold tabular-nums" style={{ color: statusColor }}>
                  {planItem.daysLeft} {t('days')}
                </p>
              )}
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <ItemDescription className="text-lg font-semibold">{planItem.dateWindowEnd ? format(new Date(planItem.dateWindowEnd), 'dd MM yyyy') : '-'}</ItemDescription>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                {t('date.window.end')}
              </div>
            </div>

            <div className="size-16 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="75%" outerRadius="100%" startAngle={90} endAngle={-270} paddingAngle={0} dataKey="value">
                    <Cell key="progress" fill={statusColor} stroke="none" />
                    <Cell key="remaining" fill="hsl(var(--muted)/0.2)" stroke="none" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                <span className="text-[11px] font-bold tracking-tighter" style={{ color: statusColor }}>
                  {planItem.percentual}%
                </span>
              </div>
            </div>
          </div>
        </ItemContent>
      </Item>
    </EditEventScheduleDialog>
  );
}
