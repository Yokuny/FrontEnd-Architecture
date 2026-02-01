import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { endOfDay, format, parseISO, startOfDay } from 'date-fns';
import { CalendarIcon, ClipboardClock, Edit, FileSpreadsheet, Plus, Save, Ship, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useAddFasOrder, useCancelFas, useCheckFasExists, useExportFasById, useFasDetails, useUpdateFasFields } from '@/hooks/use-fas-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { ModalAddFasService } from '../@components/fas-dialog-add-service';
import type { FasOrderFormValues } from '../@interface/fas-form.schema';
import { canEditFAS, disableAddService, isRegularizationHeader, preUploadAttachments } from '../@utils/fas.utils';
import { OrdersTable } from './@components/order-table';

const fasDetailsSearchSchema = z.object({
  id: z.string(),
  search: z.string().optional(),
  status: z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_private/service-management/fas/details/')({
  component: FasDetailsPage,
  validateSearch: fasDetailsSearchSchema,
});

function FasDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const fasId = searchParams.id;

  // Get permissions from user token
  const { user } = useAuth();
  const permissions: string[] = (user?.items as string[]) || [];

  const { idEnterprise } = useEnterpriseFilter();

  // Data fetching
  const { data, isLoading } = useFasDetails(fasId, idEnterprise);
  const updateMutation = useUpdateFasFields();
  const cancelMutation = useCancelFas();
  const checkExistsMutation = useCheckFasExists();
  const addOrderMutation = useAddFasOrder();
  const exportMutation = useExportFasById();

  // UI State
  const [editMode, setEditMode] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Edit fields state
  const [editServiceDate, setEditServiceDate] = useState<string>('');
  const [editLocal, setEditLocal] = useState<string>('');

  // Start edit mode
  const handleStartEdit = () => {
    setEditServiceDate(data?.serviceDate || '');
    setEditLocal(data?.local || '');
    setEditMode(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditServiceDate('');
    setEditLocal('');
  };

  // Save edited fields
  const handleSaveEdit = async () => {
    if (!fasId || !data) return;

    // Validate if FAS exists for same date/vessel (skip for regularization)
    if (!isRegularizationHeader(data.type) && editServiceDate !== data.serviceDate) {
      const dateOnly = format(parseISO(editServiceDate), 'yyyy-MM-dd');
      const result = await checkExistsMutation.mutateAsync({
        dateOnly,
        idVessel: data.vessel?.id || '',
        type: data.type || '',
        notId: fasId,
        timezone: format(new Date(), 'xxx'),
      });

      if (result.fasExists) {
        toast.error(t('fas.same.day.ship.exists'));
        return;
      }
    }

    await updateMutation.mutateAsync({
      id: fasId,
      serviceDate: editServiceDate,
      local: editLocal,
    });

    setEditMode(false);
  };

  // Cancel FAS
  const handleCancelFas = async () => {
    if (!fasId || !cancelReason) {
      toast.error(t('reason.required'));
      return;
    }

    await cancelMutation.mutateAsync({ id: fasId, cancelReason });
    setShowCancelDialog(false);
    navigate({ to: '/_private/service-management/fas' } as any);
  };

  // Add new order
  const handleAddOrder = async (order: FasOrderFormValues) => {
    if (!fasId || !data) return;

    try {
      setIsExporting(true);
      // Remove trailing slash from name if present
      const orderName = order.name?.endsWith('/') ? order.name.slice(0, -1) : order.name;

      // Pre-upload attachments if any
      let uploadedFiles: any[] = [];
      if (order.files && order.files.length > 0) {
        uploadedFiles = await preUploadAttachments({
          files: order.files,
          supplierCanView: order.supplierCanView,
        });
      }

      await addOrderMutation.mutateAsync({
        id: fasId,
        orders: [
          {
            ...order,
            name: orderName,
            files: uploadedFiles,
          },
        ],
      });

      setShowAddServiceModal(false);
    } catch {
      // Error is handled by the mutation
    } finally {
      setIsExporting(false);
    }
  };

  // Export FAS to CSV
  const handleExportCsv = async () => {
    if (!data?.id || !idEnterprise || !data.serviceDate) return;

    setIsExporting(true);
    try {
      const serviceDate = parseISO(data.serviceDate);
      const dateStart = startOfDay(serviceDate).toISOString();
      const dateEnd = endOfDay(serviceDate).toISOString();

      await exportMutation.mutateAsync({
        id: data.id,
        idEnterprise,
        dateStart,
        dateEnd,
      });
    } catch {
      // Error handled by mutation
    } finally {
      setIsExporting(false);
    }
  };

  // Navigate handlers for table actions
  const handleViewOrder = (orderId: string) => {
    navigate({ to: '/service-management/fas/filled-os', search: { id: orderId } } as any);
  };

  const handleEditOrder = (orderId: string) => {
    navigate({ to: '/service-management/fas/filled-os', search: { id: orderId, edit: true } } as any);
  };

  const handleTransferOrder = (orderId: string) => {
    navigate({ to: '/service-management/fas/filled-os', search: { id: orderId, transfer: true } } as any);
  };

  const handleEditRecSupplier = (orderId: string) => {
    navigate({ to: '/service-management/fas/filled-os', search: { id: orderId, 'edit-rec-sup': true } } as any);
  };

  const handleEditRating = (orderId: string) => {
    navigate({ to: '/service-management/fas/fas-add-rating', search: { id: orderId, 'not-realized': true } } as any);
  };

  // Minimum service date for edit
  const getMinServiceDate = () => {
    if (isRegularizationHeader(data?.type)) return undefined;
    return new Date();
  };

  // Permissions
  const canEdit = canEditFAS({ orders: data?.orders }, permissions, editMode);
  const canRemove = permissions.includes('/fas-remove');
  const canAddService = permissions.includes('/fas-new');
  // RAVITEC feature: canAccessQsms = permissions.includes('/fas-add-qsms');

  return (
    <Card>
      <CardHeader title={t('view.fas')}>
        <div className="flex items-center gap-2">
          {!!data?.events?.length && (
            <Sheet open={showTimeline} onOpenChange={setShowTimeline}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <ClipboardClock className="size-4" />
                  {t('timeline')}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-96 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t('timeline')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {data.events.map((event) => (
                    <div key={event.id} className="border-muted border-l-2 pb-4 pl-4">
                      <div className="font-medium text-sm">{event.type}</div>
                      <div className="text-muted-foreground text-xs">{formatDate(event.createdAt, 'dd MM yyyy HH:mm')}</div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {canEdit && !editMode && (
            <Button onClick={handleStartEdit}>
              <Edit className="size-4" />
              {t('edit')}
            </Button>
          )}

          {editMode && (
            <>
              <Button variant="destructive" onClick={handleCancelEdit}>
                <X className="size-4" />
                {t('cancel')}
              </Button>
              <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                <Save className="size-4" />
                {t('save')}
              </Button>
            </>
          )}

          {canRemove && !editMode && (
            <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
              <Trash2 className="size-4" />
              {t('cancel.fas')}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data ? (
          <DefaultEmptyData />
        ) : (
          <ItemContent className="gap-8">
            <div>
              <Item className="justify-between">
                <div className="flex items-center gap-4">
                  <Ship className="size-8" />
                  <div className="flex flex-col">
                    <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('vessel')}</ItemDescription>
                    <ItemTitle className="font-semibold text-2xl tracking-tighter">{data.vessel?.name || '-'}</ItemTitle>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('enterprise')}</ItemDescription>
                  <ItemTitle className="font-semibold text-2xl tracking-tighter">{data.enterprise?.name || '-'}</ItemTitle>
                </div>
              </Item>

              <Item className="grid grid-cols-1 rounded-none border-y border-y-border py-6 md:grid-cols-4">
                <ItemContent className="md:border-r">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('type')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{data.type || '-'}</ItemTitle>
                </ItemContent>

                <ItemContent className="md:border-r md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('event.team.change')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{data.teamChange ? t('yes') : t('not')}</ItemTitle>
                </ItemContent>

                <ItemContent className="md:border-r md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('service.date')}</ItemDescription>
                  {editMode ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('h-10 w-full justify-start text-left font-normal', !editServiceDate && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 size-4" />
                          {editServiceDate ? formatDate(parseISO(editServiceDate), 'dd MM yyyy HH:mm') : t('select.date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editServiceDate ? parseISO(editServiceDate) : undefined}
                          onSelect={(date) => setEditServiceDate(date ? date.toISOString() : '')}
                          disabled={(date) => {
                            const minDate = getMinServiceDate();
                            return minDate ? date < minDate : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <ItemTitle className="text-2xl leading-none">{data.serviceDate ? formatDate(data.serviceDate, 'dd MM yyyy HH:mm') : '-'}</ItemTitle>
                  )}
                </ItemContent>

                <ItemContent className="md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('local')}</ItemDescription>
                  {editMode ? (
                    <Input value={editLocal} onChange={(e) => setEditLocal(e.target.value)} placeholder={t('local')} className="h-10" />
                  ) : (
                    <ItemTitle className="text-2xl leading-none">{data.local || '-'}</ItemTitle>
                  )}
                </ItemContent>
              </Item>
            </div>

            <OrdersTable
              orders={data.orders || []}
              fasType={data.type}
              permissions={permissions}
              editMode={editMode}
              onViewOrder={handleViewOrder}
              onEditOrder={handleEditOrder}
              onTransferOrder={handleTransferOrder}
              onEditRecSupplier={handleEditRecSupplier}
              onEditRating={handleEditRating}
            />
          </ItemContent>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        <Button variant="outline" onClick={handleExportCsv} disabled={isExporting || exportMutation.isPending || !data}>
          <FileSpreadsheet className="size-4" />
          {t('export')}
        </Button>

        {canAddService && !editMode && (
          <Button onClick={() => setShowAddServiceModal(true)} disabled={disableAddService({ type: data?.type, serviceDate: data?.serviceDate }) || addOrderMutation.isPending}>
            <Plus className="size-4" />
            {t('add.service')}
          </Button>
        )}
      </CardFooter>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('cancel.fas')}</AlertDialogTitle>
            <AlertDialogDescription>{t('cancel.fas.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>{t('reason')}</Label>
            <Textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder={t('reason.placeholder')} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelFas} disabled={!cancelReason || cancelMutation.isPending}>
              {t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ModalAddFasService
        show={showAddServiceModal}
        onClose={() => setShowAddServiceModal(false)}
        onAdd={handleAddOrder}
        headerType={data?.type}
        idEnterprise={data?.enterprise?.id}
      />
    </Card>
  );
}
