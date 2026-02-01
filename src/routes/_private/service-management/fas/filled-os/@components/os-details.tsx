import { CalendarIcon, CreditCard, FileSearch, Info, Layers, Package, Truck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, StatusIndicator, type StatusVariant } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { FasOrderDetails } from '../@interface/os.schema';

export function OsDetails({ data }: OsDetailsSectionProps) {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <div className="space-y-6">
      <Item className="justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex flex-col gap-1">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('service.order')}</ItemDescription>
            <ItemTitle className="font-semibold text-2xl tracking-tighter">{data.name}</ItemTitle>
          </div>
          <div className="flex flex-col gap-1">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('vessel')}</ItemDescription>
            <ItemTitle className="font-semibold text-2xl tracking-tighter">{data.fasHeader?.vessel?.name || '-'}</ItemTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <>
              <StatusIndicator
                status={
                  (() => {
                    switch (data.state) {
                      case 'fas.closed':
                      case 'not.approved':
                      case 'cancelled':
                        return 'neutral';
                      case 'awaiting.create.confirm':
                      case 'awaiting.bms':
                      case 'bms.refused':
                      case 'not.realized':
                        return 'warning';
                      case 'awaiting.request':
                      case 'awaiting.payment':
                        return 'success';
                      case 'supplier.canceled':
                      case 'awaiting.collaborators':
                      case 'awaiting.bms.confirm':
                      case 'awaiting.contract.validation':
                      case 'awaiting.rating':
                      case 'awaiting.buy.request':
                      case 'awaiting.sap':
                        return 'error';
                      case 'awaiting.invoice':
                        return 'info';
                      default:
                        return 'neutral';
                    }
                  })() as StatusVariant
                }
              />
              <ItemTitle className="font-semibold text-2xl leading-none tracking-tight">{t(data.state)}</ItemTitle>
            </>
          )}
        </div>
      </Item>

      <Item className="grid grid-cols-1 rounded-none border-y border-y-border py-6 md:grid-cols-4">
        <ItemContent className="md:border-r">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('type')}</ItemDescription>
          <ItemTitle className="text-2xl leading-none">{data.fasHeader?.type || '-'}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('event.team.change')}</ItemDescription>
          <ItemTitle className="text-2xl leading-none">{data.fasHeader?.teamChange ? t('yes') : t('not')}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('service.date')}</ItemDescription>
          <ItemTitle className="text-2xl leading-none">{data.fasHeader?.serviceDate ? formatDate(data.fasHeader.serviceDate, 'dd MM yyyy HH:mm') : '-'}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('local')}</ItemDescription>
          <ItemTitle className="text-2xl leading-none">{data.fasHeader?.local || '-'}</ItemTitle>
        </ItemContent>
      </Item>
      {/* OS Main Info Header */}
      <div className="rounded-xl border p-6 transition-all">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 font-mono text-[10px] text-primary uppercase tracking-wider">
                {t('os')}
              </Badge>
              {data.job && (
                <Badge variant="secondary" className="bg-secondary/50 font-mono text-[10px]">
                  JOB: {data.job}
                </Badge>
              )}
              {data.vor && (
                <Badge variant="error" className="animate-pulse font-mono text-[10px]">
                  VOR: {data.vor}
                </Badge>
              )}
            </div>
            <p className="max-w-3xl text-muted-foreground text-sm italic leading-relaxed">{data.description || t('no.description')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Materials and RMRB */}
        <Item className="border-muted/40 bg-card/30 shadow-none lg:col-span-2">
          <ItemHeader className="flex-row items-center gap-3 space-y-0 pb-4">
            <div className="rounded-lg border border-primary/20 bg-primary/10 p-2">
              <Package className="size-5 text-primary" />
            </div>
            <ItemTitle className="font-bold text-base text-primary/80 uppercase tracking-tight">{t('materials')}</ItemTitle>
          </ItemHeader>
          <ItemContent className="grid gap-4 sm:grid-cols-2">
            <Item variant="muted" className="flex-col items-start rounded-xl border border-transparent p-4 transition-all hover:border-muted-foreground/20">
              <ItemDescription className="mb-2 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">{t('materialFas.label')}</ItemDescription>
              <div className="flex flex-col">
                <ItemTitle className="font-bold text-base">{data.materialFas || '-'}</ItemTitle>
                {data.materialFasCode && <span className="mt-1 w-fit rounded bg-primary/5 px-1.5 py-0.5 font-mono text-[10px] text-primary/70">{data.materialFasCode}</span>}
              </div>
            </Item>
            <Item variant="muted" className="flex-col items-start rounded-xl border border-transparent p-4 transition-all hover:border-muted-foreground/20">
              <ItemDescription className="mb-2 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">{t('rmrbFas.label')}</ItemDescription>
              <div className="flex flex-col">
                <ItemTitle className="font-bold text-base">{data.rmrb || '-'}</ItemTitle>
                {data.rmrbCode && <span className="mt-1 w-fit rounded bg-primary/5 px-1.5 py-0.5 font-mono text-[10px] text-primary/70">{data.rmrbCode}</span>}
              </div>
            </Item>
            <Item variant="muted" className="flex-col items-start rounded-xl border border-transparent p-4 transition-all hover:border-muted-foreground/20 sm:col-span-2">
              <ItemDescription className="mb-2 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">{t('onboardMaterialFas.label')}</ItemDescription>
              <ItemTitle className="font-bold text-base">{data.onboardMaterial || '-'}</ItemTitle>
            </Item>
          </ItemContent>
        </Item>

        {/* Supplier Section */}
        <Item className="border-muted/40 bg-card/30 shadow-none">
          <ItemHeader className="flex-row items-center gap-3 space-y-0 pb-4">
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2">
              <Truck className="size-5 text-orange-600" />
            </div>
            <ItemTitle className="font-bold text-base text-orange-600/80 uppercase tracking-tight">{t('supplier')}</ItemTitle>
          </ItemHeader>
          <ItemContent>
            {data.supplierData && !data.supplierData.cancelled && data.supplierData.codigoFornecedor ? (
              <div className="space-y-4 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] p-4">
                <div className="space-y-1">
                  <ItemDescription className="font-bold text-[10px] text-orange-600/70 uppercase tracking-wider">{t('name')}</ItemDescription>
                  <ItemTitle className="font-bold text-base leading-tight">{data.supplierData.razao || '-'}</ItemTitle>
                </div>
                <div className="space-y-1">
                  <ItemDescription className="font-bold text-[10px] text-orange-600/70 uppercase tracking-wider">{t('code')}</ItemDescription>
                  <ItemTitle className="font-mono text-sm">{data.supplierData.codigoFornecedor}</ItemTitle>
                </div>
                {data.supplierData.emails && data.supplierData.emails.length > 0 && (
                  <div className="space-y-2 border-orange-500/10 border-t pt-2">
                    <ItemDescription className="font-bold text-[10px] text-orange-600/70 uppercase tracking-wider">{t('emails')}</ItemDescription>
                    <div className="flex flex-wrap gap-2">
                      {data.supplierData.emails.map((email) => (
                        <Badge key={email} variant="outline" className="bg-background/50 font-medium text-[10px]">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/5 py-12 text-center text-muted-foreground">
                <Truck className="mb-3 size-10 opacity-20" />
                <p className="max-w-[150px] font-medium text-xs italic">{t('no.supplier.assigned')}</p>
              </div>
            )}
          </ItemContent>
        </Item>
      </div>

      {/* Additional and Payment Info */}
      <Item className="overflow-hidden border-muted/40 bg-card/30 shadow-none">
        <ItemHeader className="flex-row items-center gap-3 space-y-0 border-b bg-muted/20 pb-4">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
            <Info className="size-5 text-blue-600" />
          </div>
          <ItemTitle className="font-bold text-base text-blue-600/80 uppercase tracking-tight">{t('fas.info')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="p-0">
          <div className="grid divide-y divide-muted/40 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {/* Status Section */}
            <div className="space-y-6 bg-blue-500/[0.02] p-6">
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <Layers className="size-3.5" />
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('insurance.work.order')}</ItemDescription>
                </div>
                <Badge variant={data.osInsurance ? 'default' : 'secondary'} className={cn('w-fit font-bold', data.osInsurance ? 'bg-primary' : 'opacity-70')}>
                  {t(data.osInsurance ? 'yes' : 'not')}
                </Badge>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <Users className="size-3.5" />
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('event.team.change')}</ItemDescription>
                </div>
                <Badge variant={data.fasHeader?.teamChange ? 'default' : 'secondary'} className={cn('w-fit font-bold', data.fasHeader?.teamChange ? 'bg-primary' : 'opacity-70')}>
                  {t(data.fasHeader?.teamChange ? 'yes' : 'not')}
                </Badge>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-muted-foreground/80">
                  <FileSearch className="size-3.5" />
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('downtime.work.order')}</ItemDescription>
                </div>
                <Badge variant={data.osDowntime ? 'default' : 'secondary'} className={cn('w-fit font-bold', data.osDowntime ? 'bg-primary' : 'opacity-70')}>
                  {t(data.osDowntime ? 'yes' : 'not')}
                </Badge>
              </div>
            </div>

            {/* Observation Section */}
            <div className="space-y-3 p-6 lg:col-span-2">
              <ItemDescription className="font-bold text-muted-foreground/80 text-xs uppercase tracking-wider">{t('observation')}</ItemDescription>
              <div className="rounded-lg border border-muted/50 bg-muted/30 p-4">
                <p className="min-h-[100px] whitespace-pre-wrap text-balance text-foreground text-sm leading-relaxed">
                  {data.confirmObservation || <span className="italic opacity-30">{t('no.observations')}</span>}
                </p>
              </div>
            </div>

            {/* Financial Section */}
            <div className="space-y-6 bg-emerald-500/[0.02] p-6">
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-emerald-600/80">
                  <CreditCard className="size-4" />
                  <ItemDescription className="font-bold text-xs uppercase tracking-wider">{t('buy.request')}</ItemDescription>
                </div>
                {data.buyRequest ? (
                  <ItemTitle className="rounded border border-emerald-500/10 bg-emerald-500/5 p-2 font-bold font-mono text-base text-emerald-700 tracking-tight">
                    {data.buyRequest}
                  </ItemTitle>
                ) : (
                  <span className="text-muted-foreground/50 text-sm italic">{t('not.informed')}</span>
                )}
              </div>
              <Separator className="bg-emerald-500/10" />
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-emerald-600/80">
                  <CalendarIcon className="size-4" />
                  <ItemDescription className="font-bold text-xs uppercase tracking-wider">{t('date.of.payment')}</ItemDescription>
                </div>
                <ItemTitle className="font-bold text-base text-emerald-700">
                  {data.paymentDate ? (
                    formatDate(data.paymentDate, 'dd MMM yyyy')
                  ) : (
                    <span className="font-normal text-muted-foreground/50 text-sm italic">{t('not.informed')}</span>
                  )}
                </ItemTitle>
              </div>
            </div>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}

interface OsDetailsSectionProps {
  data: FasOrderDetails | undefined;
}
