import { CreditCard, FileSearch, Layers, Package, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge, StatusIndicator, type StatusVariant } from '@/components/ui/badge';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { FasOrderDetails } from '../@interface/os.schema';

export function OsDetails({ data }: OsDetailsSectionProps) {
  const { t } = useTranslation();

  if (!data) return null;

  const categories: SpecCategory[] = [
    {
      id: 'general',
      name: t('general.info'),
      icon: <FileSearch className="size-4" />,
      specs: [
        { label: 'JOB', value: data.job || '-' },
        {
          label: 'VOR',
          value: data.vor ? <Badge variant="error">{data.vor}</Badge> : '-',
        },
        { label: t('add.request'), value: data.requestOrder || '-' },
        {
          label: t('description'),
          value: <span className="whitespace-pre-wrap">{data.description || '-'}</span>,
        },
      ],
    },
    {
      id: 'materials',
      name: t('materials'),
      icon: <Package className="size-4" />,
      specs: [
        {
          label: t('materialFas.label'),
          value: (
            <div className="flex flex-col">
              <ItemTitle>{data.materialFas || '-'}</ItemTitle>
              {data.materialFasCode && <ItemDescription>{data.materialFasCode}</ItemDescription>}
            </div>
          ),
        },
        {
          label: t('rmrbFas.label'),
          value: (
            <div className="flex flex-col">
              <ItemTitle>{data.rmrb || '-'}</ItemTitle>
              {data.rmrbCode && <ItemDescription>{data.rmrbCode}</ItemDescription>}
            </div>
          ),
        },
        { label: t('onboardMaterialFas.label'), value: data.onboardMaterial || '-' },
      ],
    },
    {
      id: 'supplier',
      name: t('supplier'),
      icon: <Truck className="size-4" />,
      specs:
        data.supplierData && !data.supplierData.cancelled && data.supplierData.codigoFornecedor
          ? [
              { label: t('name'), value: data.supplierData.razao || '-' },
              { label: t('code'), value: data.supplierData.codigoFornecedor },
              ...(data.supplierData.emails && data.supplierData.emails.length > 0
                ? [
                    {
                      label: t('emails'),
                      value: (
                        <div className="flex flex-col gap-1">
                          {data.supplierData.emails.map((email) => (
                            <ItemTitle key={email}>{email}</ItemTitle>
                          ))}
                        </div>
                      ),
                    },
                  ]
                : []),
            ]
          : [{ label: t('supplier'), value: t('no.supplier.assigned') }],
    },
    {
      id: 'status',
      name: t('fas.info'),
      icon: <Layers className="size-4" />,
      specs: [
        {
          label: t('insurance.work.order'),
          value: <Badge variant={data.osInsurance ? 'success' : 'secondary'}>{t(data.osInsurance ? 'yes' : 'not')}</Badge>,
        },
        {
          label: t('event.team.change'),
          value: <Badge variant={data.fasHeader?.teamChange ? 'success' : 'secondary'}>{t(data.fasHeader?.teamChange ? 'yes' : 'not')}</Badge>,
        },
        {
          label: t('downtime.work.order'),
          value: <Badge variant={data.osDowntime ? 'success' : 'secondary'}>{t(data.osDowntime ? 'yes' : 'not')}</Badge>,
        },
      ],
    },
    {
      id: 'observation',
      name: t('observation'),
      icon: <FileSearch className="size-4" />,
      specs: [
        {
          label: t('observation'),
          value: <div className="whitespace-pre-wrap">{data.confirmObservation || <ItemDescription className="italic">{t('no.observations')}</ItemDescription>}</div>,
        },
      ],
    },
    {
      id: 'financial',
      name: t('financial'),
      icon: <CreditCard className="size-4" />,
      specs: [
        {
          label: t('buy.request'),
          value: data.buyRequest ? (
            <ItemTitle className="font-mono text-emerald-600">{data.buyRequest}</ItemTitle>
          ) : (
            <ItemDescription className="italic">{t('not.informed')}</ItemDescription>
          ),
        },
        {
          label: t('date.of.payment'),
          value: data.paymentDate ? (
            <ItemTitle className="text-emerald-600">{formatDate(data.paymentDate, 'dd MMM yyyy')}</ItemTitle>
          ) : (
            <ItemDescription className="italic">{t('not.informed')}</ItemDescription>
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-4">
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

      <div className="overflow-hidden bg-card">
        <Table>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="bg-muted/50 py-4 align-top font-medium">
                  <div className="flex items-center gap-1">
                    <ItemMedia variant="icon">{category.icon}</ItemMedia>
                    <ItemTitle>{category.name}</ItemTitle>
                  </div>
                </TableCell>
                {category.specs.map((spec) => (
                  <TableCell key={`${category.id}-${spec.label}`} className="py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <ItemDescription>{spec.label}</ItemDescription>
                      <ItemTitle>{spec.value}</ItemTitle>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface SpecItem {
  label: string;
  value: React.ReactNode;
}

interface SpecCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  specs: SpecItem[];
}

interface OsDetailsSectionProps {
  data: FasOrderDetails | undefined;
}
