import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Bell, MinusIcon, PlusIcon, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { HeatmapNotificationsForm } from './@components/heatmap-notifications-form';
import { useHeatmapAlerts, useSaveHeatmapAlerts } from './@hooks/use-heatmap-alerts';
import { useHeatmapConfig, useMachineSensors } from './@hooks/use-heatmap-config';
import type { HeatmapAlert } from './@interface/heatmap.types';

const searchParamsSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/telemetry/heatmap-fleet/notifications')({
  component: HeatmapNotificationsPage,
  validateSearch: (search: Record<string, unknown>) => searchParamsSchema.parse(search),
});

function HeatmapNotificationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useSearch({ from: '/_private/telemetry/heatmap-fleet/notifications' });

  const { data: configData, isLoading: isLoadingConfig } = useHeatmapConfig(id);
  const machineId = configData?.machine?.id;
  const { data: sensorsBase = [], isLoading: isLoadingSensors } = useMachineSensors(machineId);
  const { data: alertsData, isLoading: isLoadingAlerts } = useHeatmapAlerts(machineId);

  const [alerts, setAlerts] = useState<HeatmapAlert[]>([]);
  const saveMutation = useSaveHeatmapAlerts();

  const isLoading = isLoadingConfig || isLoadingSensors || isLoadingAlerts;

  useEffect(() => {
    if (alertsData?.alerts) {
      setAlerts(alertsData.alerts);
    }
  }, [alertsData]);

  const handleAlertUpdate = (updatedAlert: HeatmapAlert) => {
    setAlerts((prev) => {
      const index = prev.findIndex((a) => a.idAlert === updatedAlert.idAlert || a.idSensor === updatedAlert.idSensor);
      if (index > -1) {
        const newAlerts = [...prev];
        newAlerts[index] = updatedAlert;
        return newAlerts;
      }
      return [...prev, updatedAlert];
    });
  };

  const handleSave = () => {
    if (!machineId) return;
    saveMutation.mutate(
      { idMachine: machineId, alerts },
      {
        onSuccess: () => {
          toast.success(t('save.successfull'));
          navigate({ to: '/telemetry/heatmap-fleet', search: { page: 0 } });
        },
        onError: () => toast.error(t('save.error')),
      },
    );
  };

  const handleReset = () => {
    if (!machineId) return;
    saveMutation.mutate(
      { idMachine: machineId, alerts: [] },
      {
        onSuccess: () => {
          toast.info(t('deactivate.successfull'));
          navigate({ to: '/telemetry/heatmap-fleet', search: { page: 0 } });
        },
        onError: () => toast.error(t('error.deactivate')),
      },
    );
  };

  return (
    <Card>
      <CardHeader title={`${configData?.machine?.name || '...'} - ${t('settings.heatmap.alerts')}`} />

      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <DefaultLoading />
        ) : !configData || !machineId ? (
          <div>{t('error.load')}</div>
        ) : (
          <Accordion type="single" collapsible className="flex w-full flex-col gap-2">
            {configData.equipments.map((equipment) => (
              <AccordionItem key={equipment.code} value={equipment.code} className="overflow-hidden rounded-lg border bg-background px-4">
                <AccordionTrigger className="group hover:no-underline [&>svg]:hidden">
                  <div className="flex w-full items-center gap-3">
                    <div className="relative size-4 shrink-0">
                      <PlusIcon className="absolute inset-0 size-4 text-muted-foreground transition-opacity duration-200 group-data-[state=open]:opacity-0" />
                      <MinusIcon className="absolute inset-0 size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100" />
                    </div>
                    <ItemTitle className="flex-1 text-left">{equipment.name}</ItemTitle>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="ps-7 pt-4">
                  <div className="flex flex-col gap-4">
                    {equipment.subgroups.map((subgroup, idx) => {
                      const sensorsList: Array<{ key: string; onOff: boolean }> = [];
                      if (subgroup.idSensorOnOff) sensorsList.push({ key: subgroup.idSensorOnOff, onOff: true });
                      if (subgroup.sensors) {
                        subgroup.sensors.forEach((s) => {
                          sensorsList.push({ key: s.sensorKey, onOff: false });
                        });
                      }

                      if (sensorsList.length === 0) return null;

                      return (
                        <div key={`${equipment.code}-sub-${idx}`} className="rounded-md border p-4">
                          <ItemTitle className="mb-4 block font-bold text-muted-foreground text-xs uppercase underline">{subgroup.subgroupName}</ItemTitle>
                          <Separator className="mb-4" />
                          <div className="flex flex-col gap-6">
                            {sensorsList.map((sensorItem, sIdx) => {
                              const sensorData = sensorsBase.find((s) => s.sensorId === sensorItem.key);
                              if (!sensorData) return null;
                              const currentAlert = alerts.find((a) => a.idSensor === sensorData.id);

                              return (
                                <HeatmapNotificationsForm
                                  key={`${subgroup.subgroupName}-${sensorItem.key}-${sIdx}`}
                                  sensor={sensorItem}
                                  sensorData={sensorData}
                                  currentAlert={currentAlert}
                                  onUpdate={handleAlertUpdate}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate({ to: '/telemetry/heatmap-fleet', search: { page: 0 } })}>
            {t('cancel')}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-destructive hover:bg-destructive/10" disabled={!alertsData?.alerts?.length}>
                <Trash2 className="mr-2 size-4" />
                {t('delete')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('caution')}!</AlertDialogTitle>
                <AlertDialogDescription>{t('settings.heatmap.alerts.remove')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('not')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                  {t('yes')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Button onClick={handleSave}>
          <Bell className="mr-2 size-4" />
          {t('save')}
        </Button>
      </CardFooter>
    </Card>
  );
}
