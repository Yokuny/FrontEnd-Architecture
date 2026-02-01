import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import {
  ArrowLeft,
  BrushCleaning,
  CalendarIcon,
  ClipboardClock,
  Edit,
  Eye,
  FileDown,
  MoreVertical,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shuffle,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { type FasDetailsOrder, useCancelFas, useCheckFasExists, useFasDetails, useUpdateFasFields } from '@/hooks/use-fas-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { FasStatusBadge } from '../@components/fas-status-badge';
import { FasStatusSelect } from '../@components/fas-status-select';
import {
  canEditFAS,
  canEditOS,
  canEditRating,
  canEditRecSupplier,
  canTransferService,
  disableAddService,
  filterOrders,
  getSupplierDisplay,
  isRegularizationHeader,
} from '../@utils/fas.utils';

const fasDetailsSearchSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_private/service-management/fas/details/$id')({
  component: FasDetailsPage,
  validateSearch: fasDetailsSearchSchema,
});

function FasDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: fasId } = Route.useParams();
  const searchParams = Route.useSearch();
  useAuth();
  // TODO: Implement proper permission loading from API or user token
  // For now, using empty array - permissions should be loaded from user session or separate API
  const permissions: string[] = [];
  const { idEnterprise } = useEnterpriseFilter();

  // Data fetching
  const { data, isLoading, refetch } = useFasDetails(fasId, idEnterprise);
  const updateMutation = useUpdateFasFields();
  const cancelMutation = useCancelFas();
  const checkExistsMutation = useCheckFasExists();

  // UI State
  const [editMode, setEditMode] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showTimeline, setShowTimeline] = useState(false);
  const [_showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Edit fields state
  const [editServiceDate, setEditServiceDate] = useState<string>('');
  const [editLocal, setEditLocal] = useState<string>('');

  // Filter state
  const [localSearch, setLocalSearch] = useState((searchParams as any).search || '');
  const [localStatus, setLocalStatus] = useState<string[]>((searchParams as any).status || []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return filterOrders(data?.orders || [], localSearch, localStatus);
  }, [data?.orders, localSearch, localStatus]);

  const hasFilters = !!(localSearch || localStatus.length > 0);

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
    refetch();
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

  // Apply filters to URL
  const handleApplyFilters = () => {
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: localSearch || undefined,
        status: localStatus.length > 0 ? localStatus : undefined,
      }),
      replace: true,
    } as any);
  };

  // Clear filters
  const handleClearFilters = () => {
    setLocalSearch('');
    setLocalStatus([]);
    navigate({
      search: (prev: any) => ({
        ...prev,
        search: undefined,
        status: undefined,
      }),
      replace: true,
    } as any);
  };

  // Navigate to OS details
  const handleViewOS = (orderId: string) => {
    navigate({ to: '/_private/service-management/fas/filled-os/$id', params: { id: orderId } } as any);
  };

  // Context menu for each order
  const getOrderActions = (order: FasDetailsOrder) => {
    const actions: Array<{ icon: typeof Eye; label: string; onClick: () => void; variant?: 'destructive' }> = [
      {
        icon: Eye,
        label: t('view'),
        onClick: () => handleViewOS(order.id),
      },
    ];

    if (canEditOS({ type: data?.type }, order, permissions)) {
      actions.push({
        icon: Edit,
        label: t('edit'),
        onClick: () => navigate({ to: `/_private/service-management/fas/filled-os/$id`, params: { id: order.id }, search: { edit: true } } as any),
      });
    }

    if (canTransferService({ type: data?.type }, order, permissions)) {
      actions.push({
        icon: Shuffle,
        label: t('transfer.service'),
        onClick: () => navigate({ to: `/_private/service-management/fas/filled-os/$id`, params: { id: order.id }, search: { transfer: true } } as any),
      });
    }

    if (canEditRecSupplier(order, permissions)) {
      actions.push({
        icon: Users,
        label: t('edit.recommended.supplier'),
        onClick: () => navigate({ to: `/_private/service-management/fas/filled-os/$id`, params: { id: order.id }, search: { 'edit-rec-sup': true } } as any),
      });
    }

    if (canEditRating(order)) {
      actions.push({
        icon: Star,
        label: t('edit.rating'),
        onClick: () => navigate({ to: `/_private/service-management/fas/fas-add-rating`, search: { id: order.id, 'not-realized': true } } as any),
      });
    }

    return actions;
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

  return (
    <Card>
      <CardHeader title={t('view.fas')}>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate({ to: -1 } as any)}>
            <ArrowLeft className="size-4" />
            {t('back')}
          </Button>

          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
          </Button>

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

      <CardContent className="space-y-6">
        {isLoading ? (
          <DefaultLoading />
        ) : !data ? (
          <DefaultEmptyData />
        ) : (
          <>
            {/* FAS Header Info */}
            <div className="grid gap-4 md:grid-cols-4">
              <Item variant="outline">
                <Label>{t('enterprise')}</Label>
                <ItemTitle>{data.enterprise?.name || '-'}</ItemTitle>
              </Item>

              <Item variant="outline">
                <Label>{t('vessel')}</Label>
                <ItemTitle>{data.vessel?.name || '-'}</ItemTitle>
              </Item>

              <Item variant="outline">
                <Label>{t('type')}</Label>
                <ItemTitle>{data.type || '-'}</ItemTitle>
              </Item>

              <Item variant="outline">
                <Label>{t('event.team.change')}</Label>
                <ItemTitle>{data.teamChange !== undefined && data.teamChange !== null ? (data.teamChange ? t('yes') : t('no')) : '-'}</ItemTitle>
              </Item>

              {/* Editable: Service Date */}
              <Item variant="outline" className="md:col-span-2">
                <Label>{t('service.date')}</Label>
                {editMode ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !editServiceDate && 'text-muted-foreground')}>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <ItemTitle>{data.serviceDate ? formatDate(data.serviceDate, 'dd MM yyyy HH:mm') : '-'}</ItemTitle>
                )}
              </Item>

              {/* Editable: Local */}
              <Item variant="outline" className="md:col-span-2">
                <Label>{t('local')}</Label>
                {editMode ? <Input value={editLocal} onChange={(e) => setEditLocal(e.target.value)} placeholder={t('local')} /> : <ItemTitle>{data.local || '-'}</ItemTitle>}
              </Item>
            </div>

            {/* Orders Filter */}
            {data.orders && data.orders.length > 0 && (
              <Item variant="outline" className="flex-row items-end gap-4 overflow-x-auto bg-secondary">
                <div className="min-w-48">
                  <Label>{t('search')}</Label>
                  <div className="relative">
                    <Search className="absolute top-3 left-2 size-4 text-muted-foreground" />
                    <Input placeholder={t('search.placeholder')} value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="h-10 bg-background pl-8" />
                  </div>
                </div>

                <FasStatusSelect value={localStatus} onChange={setLocalStatus} placeholder={t('status')} />

                <div className="ml-auto flex gap-2">
                  {hasFilters && (
                    <Button variant="ghost" onClick={handleClearFilters}>
                      <BrushCleaning className="size-4" />
                    </Button>
                  )}
                  <Button variant={hasFilters ? 'default' : 'outline'} onClick={handleApplyFilters}>
                    <Search className="size-4" />
                    {t('filter')}
                  </Button>
                </div>
              </Item>
            )}

            {/* Orders Table */}
            <div>
              <Label className="mb-2 block">{t('order.service')}</Label>

              {filteredOrders.length === 0 ? (
                <DefaultEmptyData />
              ) : (
                <div className="overflow-hidden rounded-lg">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="w-12 text-center">N°</TableHead>
                        <TableHead className="text-center">JOB</TableHead>
                        <TableHead className="text-center">{t('os')}</TableHead>
                        <TableHead>{t('description')}</TableHead>
                        <TableHead className="text-center">{t('materialFas.label')}</TableHead>
                        <TableHead className="text-center">{t('onboardMaterialFas.label')}</TableHead>
                        <TableHead className="text-center">{t('rmrbFas.label')}</TableHead>
                        <TableHead>{t('supplier')}</TableHead>
                        <TableHead className="text-center">{t('status')}</TableHead>
                        <TableHead className="w-16 text-center">{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="transition-colors hover:bg-secondary">
                          <TableCell className="text-center">{order.index}</TableCell>
                          <TableCell className="text-center">{order.job || '-'}</TableCell>
                          <TableCell className="text-center">
                            <ItemTitle>{order.name}</ItemTitle>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <ItemDescription className="line-clamp-2 max-w-xs">{order.description || '-'}</ItemDescription>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">{order.description}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-center">{order.materialFas || '-'}</TableCell>
                          <TableCell className="text-center">{order.onboardMaterial || '-'}</TableCell>
                          <TableCell className="text-center">{order.rmrb || '-'}</TableCell>
                          <TableCell>
                            <ItemDescription className={cn(!order.supplierData?.razao && 'text-muted-foreground/60 italic')}>{getSupplierDisplay(order)}</ItemDescription>
                          </TableCell>
                          <TableCell className="text-center">
                            <FasStatusBadge status={order.state} />
                          </TableCell>
                          <TableCell className="text-center">
                            {!editMode && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {getOrderActions(order).map((action, index) => (
                                    <DropdownMenuItem key={index} onClick={action.onClick} className={action.variant === 'destructive' ? 'text-destructive' : ''}>
                                      <action.icon className="mr-2 size-4" />
                                      {action.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex gap-2">
          {/* Export Button - placeholder for now */}
          <Button variant="outline">
            <FileDown className="size-4" />
            {t('export')}
          </Button>
        </div>

        <div className="flex gap-2">
          {canAddService && !editMode && (
            <Button onClick={() => setShowAddServiceModal(true)} disabled={disableAddService({ type: data?.type, serviceDate: data?.serviceDate })}>
              <Plus className="size-4" />
              {t('add.service')}
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Cancel FAS Dialog */}
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

      {/* TODO: Add Service Modal will be integrated here */}
    </Card>
  );
}
