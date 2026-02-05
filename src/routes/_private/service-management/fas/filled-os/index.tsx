import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ClipboardClock, Download, Edit, Paperclip, Send, ShieldCheck, Truck, X } from 'lucide-react';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import {
  useAddOrderBuyRequest,
  useCancelOrder,
  useCancelSupplier,
  useConfirmBMS,
  useConfirmBmsSap,
  useConfirmContract,
  useConfirmFasOrder,
  useConfirmPayment,
  useFasInvoice,
  useFasOrder,
  useOrderNotRealized,
  useRefuseBMS,
} from '@/hooks/use-fas-api';
import { OsAttachmentDialog } from './@components/os-attachment-dialog';
import { OsCollaborators } from './@components/os-collaborators';
import { OsDetails } from './@components/os-details';
import { OsExpenses } from './@components/os-expenses';
import { OsRating } from './@components/os-rating';
import { OsReasons } from './@components/os-reasons';
import { OsRefusalDialog } from './@components/os-refusal-dialog';
import {
  canAddBuyRequest,
  canAddSupplier,
  canBeNotRealized,
  canCancelSupplier,
  canConfirmBMS,
  canConfirmOs,
  canConfirmPayment,
  canConfirmSAP,
  canDeleteOS,
  canDownloadInvoice,
  canEditBuyRequest,
  canEditOS,
  canValidateContract,
} from './@utils/os-permissions';

const filledOsSearchSchema = z.object({
  id: z.string(),
  edit: z.boolean().optional(),
  transfer: z.boolean().optional(),
});

export const Route = createFileRoute('/_private/service-management/fas/filled-os/')({
  component: FilledOsPage,
  validateSearch: filledOsSearchSchema,
  staticData: {
    title: 'view.order.service',
    description:
      'Detalhes completos de uma Ordem de Serviço (OS) preenchida. Visualize e gerencie todos os aspectos da OS: detalhes, colaboradores, despesas BMS, avaliações, anexos. Permite confirmações (OS, BMS, contrato, SAP, pagamento), recusas, adição de fornecedor, requisição de compra e cancelamento',
    tags: [
      'os',
      'work-order',
      'filled',
      'order',
      'service',
      'field-service',
      'bms',
      'supplier',
      'fornecedor',
      'contractor',
      'payment',
      'invoice',
      'contract',
      'sap',
      'approval',
      'confirmation',
    ],
    examplePrompts: [
      'Ver detalhes de uma ordem de serviço',
      'Confirmar OS de campo',
      'Adicionar fornecedor a uma OS',
      'Aprovar BMS de uma ordem de serviço',
      'Validar contrato de serviço',
      'Confirmar pagamento de OS',
      'Baixar nota fiscal de serviço',
      'Marcar OS como não realizada',
      'Cancelar ordem de serviço',
    ],
    searchParams: [
      { name: 'id', type: 'string', description: 'ID da ordem de serviço' },
      { name: 'edit', type: 'boolean', description: 'Modo de edição' },
      { name: 'transfer', type: 'boolean', description: 'Modo de transferência' },
    ],
    relatedRoutes: [
      { path: '/_private/service-management/fas/details', relation: 'parent', description: 'Detalhes da FAS' },
      { path: '/_private/service-management/fas', relation: 'parent', description: 'Listagem de FAS' },
      { path: '/_private/service-management', relation: 'parent', description: 'Hub de gestão de serviços' },
    ],
    entities: ['WorkOrder', 'BMS', 'Supplier', 'Collaborator', 'Invoice', 'Contract', 'Attachment', 'Event'],
    capabilities: [
      'Visualizar detalhes da OS',
      'Ver colaboradores',
      'Ver motivos de recusa',
      'Ver despesas BMS',
      'Ver avaliações',
      'Ver timeline de eventos',
      'Gerenciar anexos',
      'Confirmar OS',
      'Recusar OS',
      'Editar OS',
      'Adicionar fornecedor',
      'Cancelar fornecedor',
      'Confirmar BMS',
      'Recusar BMS',
      'Validar contrato',
      'Rejeitar contrato',
      'Confirmar SAP',
      'Rejeitar SAP',
      'Adicionar requisição de compra',
      'Editar requisição de compra',
      'Confirmar pagamento',
      'Rejeitar nota fiscal',
      'Baixar nota fiscal',
      'Marcar como não realizada',
      'Cancelar ordem',
    ],
  },
});

function FilledOsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = Route.useSearch();
  useAuth();
  // TODO: Implement proper permission loading from API or user token
  // For now, using empty array - permissions should be loaded from user session or separate API
  const items: string[] = [];

  // Data query
  const { data, isLoading, refetch } = useFasOrder(id);

  // Modal states
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [showRefuseOsDialog, setShowRefuseOsDialog] = useState(false);
  const [showRefuseBmsDialog, setShowRefuseBmsDialog] = useState(false);
  const [showRefuseContractDialog, setShowRefuseContractDialog] = useState(false);
  const [showRefuseSapDialog, setShowRefuseSapDialog] = useState(false);
  const [showRefuseInvoiceDialog, setShowRefuseInvoiceDialog] = useState(false);
  const [showNotRealizedDialog, setShowNotRealizedDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmBmsDialog, setShowConfirmBmsDialog] = useState(false);
  const [showConfirmContractDialog, setShowConfirmContractDialog] = useState(false);
  const [showConfirmSapDialog, setShowConfirmSapDialog] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  // Payment dialog is handled inline, no separate dialog needed

  // Form field states (for inline fields)
  const [showConfirmOsFields, setShowConfirmOsFields] = useState(false);
  const [recommendedSupplier, setRecommendedSupplier] = useState('');
  const [recommendedSupplierCount, setRecommendedSupplierCount] = useState<number>(3);
  const [osInsurance, setOsInsurance] = useState(false);
  const [osDowntime, setOsDowntime] = useState(false);
  const [confirmObservation, setConfirmObservation] = useState('');
  const [buyRequest, setBuyRequest] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  // Mutations
  const confirmOrder = useConfirmFasOrder();
  const refuseBms = useRefuseBMS();
  const confirmBms = useConfirmBMS();
  const confirmContract = useConfirmContract();
  const confirmSap = useConfirmBmsSap();
  const confirmPayment = useConfirmPayment();
  const orderNotRealized = useOrderNotRealized();
  const cancelOrder = useCancelOrder();
  const cancelSupplier = useCancelSupplier();
  const addBuyRequest = useAddOrderBuyRequest();
  const downloadInvoice = useFasInvoice();

  // Permission items
  const permissionItems = items || [];

  // Derived permissions
  const canConfirmOsAction = canConfirmOs(data, permissionItems);
  const canEditOsAction = canEditOS(data?.fasHeader, { state: data?.state }, permissionItems);
  const canNotRealized = canBeNotRealized(data);
  const canAddSupplierAction = canAddSupplier(permissionItems, data?.state);
  const canCancelSupplierAction = canCancelSupplier(permissionItems, data?.state);
  const canConfirmBmsAction = canConfirmBMS(permissionItems, data?.state);
  const canValidateContractAction = canValidateContract(permissionItems, data?.state);
  const canConfirmSapAction = canConfirmSAP(permissionItems, data?.state);
  const canAddBuyRequestAction = canAddBuyRequest(permissionItems, data?.state);
  const canEditBuyRequestAction = canEditBuyRequest(permissionItems, data?.state);
  const canConfirmPaymentAction = canConfirmPayment(permissionItems, data?.state);
  const canDownloadInvoiceAction = canDownloadInvoice(permissionItems, data?.state);
  const canDeleteOsAction = canDeleteOS(permissionItems, data?.state);

  // Handlers
  const handleConfirmOs = async (confirmed: boolean, osRefusalReason?: string) => {
    confirmOrder.mutate(
      {
        id,
        confirmed,
        recommendedSupplier: confirmed ? recommendedSupplier : undefined,
        recommendedSupplierCount: confirmed ? recommendedSupplierCount : undefined,
        osInsurance: confirmed ? osInsurance : undefined,
        osDowntime: confirmed ? osDowntime : undefined,
        confirmObservation: confirmed ? confirmObservation : undefined,
        osRefusalReason,
      },
      {
        onSuccess: () => {
          setShowConfirmOsFields(false);
          setShowRefuseOsDialog(false);
          refetch();
        },
      },
    );
  };

  const handleRefuseBms = (reason: string) => {
    refuseBms.mutate(
      { id, refusalReason: reason },
      {
        onSuccess: () => {
          setShowRefuseBmsDialog(false);
          refetch();
        },
      },
    );
  };

  const handleConfirmBms = () => {
    confirmBms.mutate(id, {
      onSuccess: () => {
        setShowConfirmBmsDialog(false);
        refetch();
      },
    });
  };

  const handleConfirmContract = (confirmed: boolean, reason?: string) => {
    confirmContract.mutate(
      { id, confirmed, rejectContractReason: reason },
      {
        onSuccess: () => {
          setShowConfirmContractDialog(false);
          setShowRefuseContractDialog(false);
          refetch();
        },
      },
    );
  };

  const handleConfirmSap = (confirmed: boolean, reason?: string) => {
    confirmSap.mutate(
      { id, confirmed, rejectSapReason: reason },
      {
        onSuccess: () => {
          setShowConfirmSapDialog(false);
          setShowRefuseSapDialog(false);
          refetch();
        },
      },
    );
  };

  const handleConfirmPayment = (confirm: boolean, rejectReason?: string) => {
    confirmPayment.mutate(
      { id, confirm, paymentDate: confirm ? paymentDate : undefined, rejectInvoiceReason: rejectReason },
      {
        onSuccess: () => {
          // Close dialogs after successful payment confirmation
          setShowRefuseInvoiceDialog(false);
          refetch();
        },
      },
    );
  };

  const handleNotRealized = (reason: string) => {
    orderNotRealized.mutate(
      { id, notRealizedReason: reason },
      {
        onSuccess: () => {
          setShowNotRealizedDialog(false);
          navigate({ to: '/service-management/fas' });
        },
      },
    );
  };

  const handleCancelOrder = (reason: string) => {
    cancelOrder.mutate(
      { id, item: data?.name || id, cancelReason: reason },
      {
        onSuccess: () => {
          setShowCancelDialog(false);
          navigate({ to: '/service-management/fas' });
        },
      },
    );
  };

  const handleCancelSupplier = () => {
    cancelSupplier.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleAddBuyRequest = () => {
    if (!buyRequest.trim()) {
      toast.error(t('buy.request.required'));
      return;
    }
    addBuyRequest.mutate(
      { id, buyRequest },
      {
        onSuccess: () => {
          setBuyRequest('');
          refetch();
        },
      },
    );
  };

  const handleDownloadInvoice = () => {
    downloadInvoice.mutate(id);
  };

  return (
    <Card>
      <CardHeader title={t('view.order.service')}>
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
                    <div className="text-muted-foreground text-xs">{event.createdAt}</div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !data ? (
          <DefaultEmptyData />
        ) : (
          <ItemContent className="gap-10">
            <OsDetails data={data} />
            <OsCollaborators collaborators={data.collaborators} />
            <OsReasons data={data} />
            <OsExpenses bms={data.bms} />
            <OsRating data={data} />

            {canConfirmOsAction && showConfirmOsFields && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold">{t('fas.confirm.os')}</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('fas.add.info')}</Label>
                    <Input value={recommendedSupplier} onChange={(e) => setRecommendedSupplier(e.target.value)} placeholder={t('recommended.supplier.placeholder')} />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('fas.recommended.supplier.count')}</Label>
                    <Input type="number" min={1} max={10} value={recommendedSupplierCount} onChange={(e) => setRecommendedSupplierCount(Number(e.target.value))} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="osInsurance" checked={osInsurance} onCheckedChange={(checked) => setOsInsurance(!!checked)} />
                    <Label htmlFor="osInsurance">{t('insurance.work.order')}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="osDowntime" checked={osDowntime} onCheckedChange={(checked) => setOsDowntime(!!checked)} />
                    <Label htmlFor="osDowntime">{t('downtime.work.order')}</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('observation')}</Label>
                  <Textarea value={confirmObservation} onChange={(e) => setConfirmObservation(e.target.value)} placeholder={t('observation.placeholder')} rows={3} />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleConfirmOs(true)} disabled={confirmOrder.isPending}>
                    <ShieldCheck className="mr-2 size-4" />
                    {t('confirm')}
                  </Button>
                  <Button variant="destructive" onClick={() => setShowRefuseOsDialog(true)} disabled={confirmOrder.isPending}>
                    <X className="mr-2 size-4" />
                    {t('refuse')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowConfirmOsFields(false)}>
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            )}
            {/* Buy Request Field */}
            {(canAddBuyRequestAction || canEditBuyRequestAction) && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold">{t('buy.request')}</h3>
                <div className="flex gap-2">
                  <Input value={buyRequest} onChange={(e) => setBuyRequest(e.target.value)} placeholder={t('buy.request.placeholder')} className="flex-1" />
                  <Button onClick={handleAddBuyRequest} disabled={addBuyRequest.isPending}>
                    <Send className="mr-2 size-4" />
                    {t('send')}
                  </Button>
                </div>
              </div>
            )}
            {/* Payment Field */}
            {canConfirmPaymentAction && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold">{t('confirm.payment')}</h3>
                <div className="flex gap-2">
                  <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="flex-1" />
                  <Button onClick={() => handleConfirmPayment(true)} disabled={confirmPayment.isPending || !paymentDate}>
                    {t('confirm.payment')}
                  </Button>
                  <Button variant="destructive" onClick={() => setShowRefuseInvoiceDialog(true)} disabled={confirmPayment.isPending}>
                    {t('reject')}
                  </Button>
                </div>
              </div>
            )}
          </ItemContent>
        )}
      </CardContent>

      <CardFooter>
        {data && (
          <>
            {/* Attachments Button */}
            <Button variant="outline" onClick={() => setShowAttachmentDialog(true)}>
              <Paperclip className="mr-2 size-4" />
              {t('attachments')} {data.files?.length ? `(${data.files.length})` : ''}
            </Button>

            {/* Confirm OS Button */}
            {canConfirmOsAction && !showConfirmOsFields && (
              <Button onClick={() => setShowConfirmOsFields(true)}>
                <ShieldCheck className="mr-2 size-4" />
                {t('fas.confirm.os')}
              </Button>
            )}

            {/* Edit OS Button */}
            {canEditOsAction && (
              <Button variant="outline" onClick={() => navigate({ to: './edit/$id', params: { id } } as any)}>
                <Edit className="mr-2 size-4" />
                {t('edit')}
              </Button>
            )}

            {/* Add Supplier Button */}
            {canAddSupplierAction && (
              <Button onClick={() => navigate({ to: './add-supplier/$id', params: { id } } as any)}>
                <Truck className="mr-2 size-4" />
                {t('add.supplier')}
              </Button>
            )}

            {/* Cancel Supplier Button */}
            {canCancelSupplierAction && (
              <Button variant="outline" onClick={handleCancelSupplier} disabled={cancelSupplier.isPending}>
                {t('cancel.supplier')}
              </Button>
            )}

            {/* Confirm BMS Button */}
            {canConfirmBmsAction && (
              <>
                <Button onClick={() => setShowConfirmBmsDialog(true)}>
                  <ShieldCheck className="mr-2 size-4" />
                  {t('confirm.bms')}
                </Button>
                <Button variant="destructive" onClick={() => setShowRefuseBmsDialog(true)}>
                  <X className="mr-2 size-4" />
                  {t('refuse.bms')}
                </Button>
              </>
            )}

            {/* Validate Contract Button */}
            {canValidateContractAction && (
              <>
                <Button onClick={() => setShowConfirmContractDialog(true)}>
                  <ShieldCheck className="mr-2 size-4" />
                  {t('validate.contract')}
                </Button>
                <Button variant="destructive" onClick={() => setShowRefuseContractDialog(true)}>
                  <X className="mr-2 size-4" />
                  {t('reject.contract')}
                </Button>
              </>
            )}

            {/* Confirm SAP Button */}
            {canConfirmSapAction && (
              <>
                <Button onClick={() => setShowConfirmSapDialog(true)}>
                  <ShieldCheck className="mr-2 size-4" />
                  {t('confirm.sap')}
                </Button>
                <Button variant="destructive" onClick={() => setShowRefuseSapDialog(true)}>
                  <X className="mr-2 size-4" />
                  {t('reject.sap')}
                </Button>
              </>
            )}

            {/* Download Invoice */}
            {canDownloadInvoiceAction && (
              <Button variant="outline" onClick={handleDownloadInvoice} disabled={downloadInvoice.isPending}>
                <Download className="mr-2 size-4" />
                {t('download.invoice')}
              </Button>
            )}

            {/* Not Realized */}
            {canNotRealized && (
              <Button variant="outline" onClick={() => setShowNotRealizedDialog(true)}>
                {t('not.realized')}
              </Button>
            )}

            {/* Cancel Order */}
            {canDeleteOsAction && (
              <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                {t('cancel.order')}
              </Button>
            )}
          </>
        )}
      </CardFooter>

      {/* Dialogs */}
      {data && (
        <>
          <OsAttachmentDialog open={showAttachmentDialog} onOpenChange={setShowAttachmentDialog} orderId={id} files={data.files} state={data.state} onSuccess={refetch} />

          <OsRefusalDialog
            open={showRefuseOsDialog}
            onOpenChange={setShowRefuseOsDialog}
            title={t('fas.refuse.os')}
            isPending={confirmOrder.isPending}
            onConfirm={(reason) => handleConfirmOs(false, reason)}
          />

          <OsRefusalDialog open={showRefuseBmsDialog} onOpenChange={setShowRefuseBmsDialog} title={t('refuse.bms')} isPending={refuseBms.isPending} onConfirm={handleRefuseBms} />

          <OsRefusalDialog
            open={showRefuseContractDialog}
            onOpenChange={setShowRefuseContractDialog}
            title={t('reject.contract')}
            isPending={confirmContract.isPending}
            onConfirm={(reason) => handleConfirmContract(false, reason)}
          />

          <OsRefusalDialog
            open={showRefuseSapDialog}
            onOpenChange={setShowRefuseSapDialog}
            title={t('reject.sap')}
            isPending={confirmSap.isPending}
            onConfirm={(reason) => handleConfirmSap(false, reason)}
          />

          <OsRefusalDialog
            open={showRefuseInvoiceDialog}
            onOpenChange={setShowRefuseInvoiceDialog}
            title={t('reject.invoice')}
            isPending={confirmPayment.isPending}
            onConfirm={(reason) => handleConfirmPayment(false, reason)}
          />

          <OsRefusalDialog
            open={showNotRealizedDialog}
            onOpenChange={setShowNotRealizedDialog}
            title={t('order.not.realized')}
            description={t('order.not.realized.description')}
            isPending={orderNotRealized.isPending}
            onConfirm={handleNotRealized}
          />

          <OsRefusalDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            title={t('cancel.order')}
            description={t('cancel.order.description')}
            isPending={cancelOrder.isPending}
            onConfirm={handleCancelOrder}
          />

          <AlertDialog open={showConfirmBmsDialog} onOpenChange={setShowConfirmBmsDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirm.bms')}</AlertDialogTitle>
                <AlertDialogDescription>{t('confirm.bms.description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmBms}>{t('confirm')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showConfirmContractDialog} onOpenChange={setShowConfirmContractDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('validate.contract')}</AlertDialogTitle>
                <AlertDialogDescription>{t('validate.contract.description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleConfirmContract(true)}>{t('confirm')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={showConfirmSapDialog} onOpenChange={setShowConfirmSapDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('confirm.sap')}</AlertDialogTitle>
                <AlertDialogDescription>{t('confirm.sap.description')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleConfirmSap(true)}>{t('confirm')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </Card>
  );
}
