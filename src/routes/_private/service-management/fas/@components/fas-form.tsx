import { useLocation } from '@tanstack/react-router';
import { format } from 'date-fns';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { FasTypeSelect } from '@/components/selects/fas-type-select';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ItemActions, ItemContent, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFasExistsValidation } from '@/hooks/use-fas-api';
import type { FasFormValues, FasOrderFormValues } from '../@interface/fas-form.schema';
import { ModalAddFasService } from './fas-dialog-add-service';

export function FasForm() {
  const { t } = useTranslation();
  const form = useFormContext<FasFormValues>();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  // Cast state to any to access transferReason
  const transferReason = (location.state as any)?.transferReason;

  const watchedValues = form.watch(['idVessel', 'serviceDate', 'type']);
  const headerType = watchedValues[2];
  const { refetch: checkExistence } = useFasExistsValidation({
    idVessel: watchedValues[0],
    dateOnly: watchedValues[1] ? watchedValues[1].split('T')[0] : '',
    type: watchedValues[2],
    timezone: format(new Date(), 'xxx'),
  });

  const handleOpenModal = async () => {
    const { data } = await checkExistence();
    if (data?.fasExists) {
      toast.warning(t('fas.same.day.ship.exists'));
    }
    setShowModal(true);
  };

  const addOrder = (order: FasOrderFormValues) => {
    const currentOrders = form.getValues('orders');
    form.setValue('orders', [...currentOrders, order], { shouldValidate: true });
  };

  const removeOrder = (index: number) => {
    const currentOrders = form.getValues('orders');
    form.setValue(
      'orders',
      currentOrders.filter((_, i: number) => i !== index),
      { shouldValidate: true },
    );
  };

  const selectedEnterprise = form.watch('idEnterprise');
  const orders = form.watch('orders');

  const sections = [
    {
      title: t('general.information'),
      description: t('fas.general.description'),
      fields: [
        <FormField
          key="idEnterprise"
          control={form.control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="row-vessel-type-date" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="idVessel"
            render={({ field }) => (
              <FormItem>
                <MachineByEnterpriseSelect mode="single" idEnterprise={selectedEnterprise} value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FasTypeSelect mode="single" value={field.value} onChange={field.onChange} disabled={orders.length > 0} noRegularization={!!transferReason} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serviceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('service.date')} *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} className="bg-background focus-visible:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="row-team-local" className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <FormField
            control={form.control}
            name="teamChange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('event.team.change')} *</FormLabel>
                <Select value={field.value ? 'true' : 'false'} onValueChange={(val) => field.onChange(val === 'true')}>
                  <FormControl className="w-full max-w-32">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="false">{t('not')}</SelectItem>
                    <SelectItem value="true">{t('yes')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="local"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>{t('local')} *</FormLabel>
                <Input {...field} placeholder={t('local')} className="bg-background focus-visible:ring-primary" />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('services'),
      description: t('fas.services.description'),
      layout: 'vertical' as const,
      fields: [
        <div key="services-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <ItemContent>
              <ItemTitle className="text-base">{t('services.list')}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button type="button" onClick={handleOpenModal} className="gap-2">
                <Plus className="size-4" />
                {t('add.service')}
              </Button>
            </ItemActions>
          </div>

          <div className="overflow-hidden rounded-md border bg-muted/20">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-center font-semibold italic">JOB</TableHead>
                    <TableHead className="font-semibold">{t('os')}</TableHead>
                    <TableHead className="font-semibold">{t('description')}</TableHead>
                    <TableHead className="text-center font-semibold">{t('materialFas.label')}</TableHead>
                    <TableHead className="text-center font-semibold">{t('materialFas.code.label')}</TableHead>
                    <TableHead className="text-center font-semibold">{t('onboardMaterialFas.label')}</TableHead>
                    <TableHead className="text-center font-semibold">{t('rmrbFas.label')}</TableHead>
                    <TableHead className="text-center font-semibold">{t('rmrbFas.code.label')}</TableHead>
                    <TableHead className="w-[80px] text-center font-semibold">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground italic">
                        {t('no.services.added')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order: FasOrderFormValues, index: number) => (
                      <TableRow key={`${order.name}-${index}`} className="group bg-background hover:bg-muted/30">
                        <TableCell className="text-center font-mono text-muted-foreground text-xs">{order.job || '-'}</TableCell>
                        <TableCell className="font-semibold text-xs">{order.name}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="line-clamp-2 text-[10px] text-muted-foreground">{order.description}</p>
                        </TableCell>
                        <TableCell className="text-center text-xs">{order.materialFas}</TableCell>
                        <TableCell className="text-center text-xs">{order.materialFasCode || '-'}</TableCell>
                        <TableCell className="text-center text-xs">{order.onboardMaterial}</TableCell>
                        <TableCell className="text-center text-xs">{order.rmrb}</TableCell>
                        <TableCell className="text-center text-xs">{order.rmrbCode || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100"
                            onClick={() => removeOrder(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {form.formState.errors.orders && <p className="font-medium text-destructive text-sm">{form.formState.errors.orders.message}</p>}

          {transferReason && (
            <div className="flex items-center gap-2 rounded-md bg-warning/10 p-4 text-warning">
              <AlertCircle className="size-4" />
              <p className="text-sm">{t('transfer.os.warning')}</p>
            </div>
          )}
        </div>,
      ],
    },
  ];

  return (
    <>
      <DefaultFormLayout sections={sections} />
      <ModalAddFasService show={showModal} onClose={() => setShowModal(false)} onAdd={addOrder} headerType={headerType} idEnterprise={selectedEnterprise} />
    </>
  );
}
