import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { MinusIcon, PlusIcon, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { MachineSelect } from '@/components/selects/machine-select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Item, ItemDescription, ItemTitle } from '@/components/ui/item';
import { SensorConfig } from './@components/sensor-config';
import { EQUIPMENT_TYPES } from './@consts/equipment.consts';
import { useDeleteHeatmapConfig, useHeatmapConfig, useMachineSensors, useSaveHeatmapConfig } from './@hooks/use-heatmap-config';
import type { EquipmentConfig, SubgroupConfig } from './@interface/heatmap.types';

const searchParamsSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/telemetry/heatmap-fleet/add')({
  component: HeatmapConfigPage,
  validateSearch: (search: Record<string, unknown>) => searchParamsSchema.parse(search),
  beforeLoad: () => ({
    title: 'add',
  }),
});

function HeatmapConfigPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useSearch({ from: '/_private/telemetry/heatmap-fleet/add' });

  const [enterprise, setEnterprise] = useState<SelectOption | undefined>();
  const [machine, setMachine] = useState<SelectOption | undefined>();
  const [equipmentList, setEquipmentList] = useState<EquipmentConfig[]>([]);

  const { data: configData, isLoading: isLoadingConfig } = useHeatmapConfig(id);
  const { data: sensors = [], isLoading: isLoadingSensors } = useMachineSensors(machine?.value);
  const saveMutation = useSaveHeatmapConfig();
  const deleteMutation = useDeleteHeatmapConfig();

  const hasPermissionDelete = false; // TODO: Replace with actual permission check
  const isEdit = !!id;
  const isLoading = isLoadingConfig || saveMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (configData) {
      if (configData.enterprise) {
        setEnterprise({ label: configData.enterprise.name, value: configData.enterprise.id });
      }
      if (configData.machine) {
        setMachine({ label: configData.machine.name, value: configData.machine.id });
      }
      if (configData.equipments?.length) {
        setEquipmentList(configData.equipments);
      }
    }
  }, [configData]);

  const updateSubgroup = (equipmentCode: string, subgroupIndex: number, updates: Partial<SubgroupConfig>) => {
    const equipmentTemplate = EQUIPMENT_TYPES.find((e) => e.code === equipmentCode);
    if (!equipmentTemplate) return;

    const newEquipmentList = [...equipmentList];
    let equipment = newEquipmentList.find((e) => e.code === equipmentCode);

    if (!equipment) {
      equipment = { name: equipmentTemplate.name, code: equipmentTemplate.code, subgroups: [] };
      newEquipmentList.push(equipment);
    }

    while (equipment.subgroups.length <= subgroupIndex) {
      const templateSubgroup = equipmentTemplate.subgroups[equipment.subgroups.length];
      equipment.subgroups.push({
        index: equipment.subgroups.length,
        subgroupName: templateSubgroup?.subgroupName || '',
      });
    }

    equipment.subgroups[subgroupIndex] = { ...equipment.subgroups[subgroupIndex], ...updates };
    setEquipmentList(newEquipmentList);
  };

  const handleSave = () => {
    if (!enterprise?.value || !machine?.value) return;

    saveMutation.mutate(
      { id, idEnterprise: enterprise.value, idMachine: machine.value, equipments: equipmentList.filter((e) => e.subgroups.length > 0) },
      {
        onSuccess: () => {
          toast.success(t('save.successfull'));
          navigate({ to: '/telemetry/heatmap-fleet', search: { page: 0 } });
        },
        onError: () => toast.error(t('save.error')),
      },
    );
  };

  const handleDelete = () => {
    if (!id || !window.confirm(t('delete.message.default'))) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('delete.successfull'));
        navigate({ to: '/telemetry/heatmap-fleet', search: { page: 0 } });
      },
      onError: () => toast.error(t('delete.error')),
    });
  };

  const sections = [
    {
      title: t('basic.info'),
      description: t('machine.basic.description'),
      fields: [
        <div key="selects-row" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EnterpriseSelect value={enterprise?.value} onChange={(v) => setEnterprise(v ? { label: v, value: v } : undefined)} mode="single" disabled={isEdit} />
          <MachineSelect
            idEnterprise={enterprise?.value}
            value={machine?.value}
            onChange={(v) => setMachine(v ? { label: v, value: v } : undefined)}
            mode="single"
            disabled={isEdit}
          />
        </div>,
      ],
    },
    {
      title: t('machine.equipment'),
      description: t('machine.equipment.description'),
      layout: 'vertical',
      fields: [
        machine?.value ? (
          <Accordion key="equipment-accordion" type="single" collapsible className="flex w-full flex-col gap-2">
            {EQUIPMENT_TYPES.map((equipment) => {
              const equipmentData = equipmentList.find((e) => e.code === equipment.code);
              return (
                <AccordionItem key={equipment.code} value={equipment.code} className="overflow-hidden rounded-lg border bg-background px-4">
                  <AccordionTrigger className="group py-4 hover:no-underline [&>svg]:hidden">
                    <div className="flex w-full items-center gap-3">
                      <div className="relative size-4 shrink-0">
                        <PlusIcon className="absolute inset-0 size-4 text-muted-foreground transition-opacity duration-200 group-data-[state=open]:opacity-0" />
                        <MinusIcon className="absolute inset-0 size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100" />
                      </div>
                      <ItemTitle className="flex-1 text-left">{equipment.name}</ItemTitle>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="ps-7">
                    <Accordion type="single" collapsible className="flex w-full flex-col gap-2 pt-2">
                      {equipment.subgroups.map((subgroup, subIndex) => {
                        const subgroupData = equipmentData?.subgroups?.[subIndex];
                        const subId = `${equipment.code}-${subIndex}`;
                        return (
                          <AccordionItem key={subId} value={subId} className="border-none">
                            <AccordionTrigger className="group py-2 hover:no-underline [&>svg]:hidden">
                              <div className="flex w-full items-center gap-3">
                                <div className="relative size-3.5 shrink-0">
                                  <PlusIcon className="absolute inset-0 size-3.5 text-muted-foreground transition-opacity duration-200 group-data-[state=open]:opacity-0" />
                                  <MinusIcon className="absolute inset-0 size-3.5 text-muted-foreground opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100" />
                                </div>
                                <ItemDescription className="flex-1 text-left font-medium text-foreground">{subgroup.subgroupName}</ItemDescription>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="ps-6">
                              {isLoadingSensors ? (
                                <DefaultLoading />
                              ) : (
                                <SensorConfig
                                  sensors={sensors}
                                  data={subgroupData}
                                  onChangeSensorOnOff={(v) => updateSubgroup(equipment.code, subIndex, { idSensorOnOff: v })}
                                  onChangeSensors={(v) => updateSubgroup(equipment.code, subIndex, { sensors: v.map((s) => ({ sensorKey: s })) })}
                                />
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Item key="no-machine" variant="muted" className="justify-center border-dashed">
            <ItemDescription>{t('select.machine.to.configure')}</ItemDescription>
          </Item>
        ),
      ],
    },
  ];

  if (isLoadingConfig) return <DefaultLoading />;

  return (
    <Card>
      <CardHeader title={t(isEdit ? 'machine.edit' : 'add.machine')}>
        <div className="flex items-center gap-2">
          {isEdit && hasPermissionDelete && (
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete} disabled={isLoading}>
              <Trash2 className="size-4" />
            </Button>
          )}
          <Button onClick={handleSave} disabled={!enterprise?.value || !machine?.value || isLoading} className="h-10 px-6">
            <Save className="mr-2 size-4" />
            {t('save')}
          </Button>
        </div>
      </CardHeader>

      <DefaultFormLayout sections={sections} />
    </Card>
  );
}

interface SelectOption {
  label: string;
  value: string;
}
