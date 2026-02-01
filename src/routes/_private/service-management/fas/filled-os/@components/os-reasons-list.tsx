import { AlertCircle, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ItemDescription } from '@/components/ui/item';
import type { FasOrderDetails } from '../@interface/os.schema';

interface OsReasonsListProps {
  data: FasOrderDetails | undefined;
}

interface ReasonItemProps {
  title: string;
  reasons: string[] | undefined;
  variant?: 'warning' | 'error' | 'info';
}

function ReasonItem({ title, reasons, variant = 'info' }: ReasonItemProps) {
  const variantStyles = {
    warning: 'border-yellow-300 bg-yellow-50 text-yellow-900',
    error: 'border-red-300 bg-red-50 text-red-900',
    info: 'border-blue-300 bg-blue-50 text-blue-900',
  };

  if (!reasons || reasons.length === 0) return null;

  return (
    <Collapsible>
      <CollapsibleTrigger className={`flex w-full items-center justify-between rounded-lg border p-3 ${variantStyles[variant]}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4" />
          <span className="font-medium">
            {title} ({reasons.length})
          </span>
        </div>
        <ChevronDown className="size-4 in-data-[state=open]:rotate-180 transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className={`mt-2 list-inside list-disc space-y-1 rounded-lg border p-3 ${variantStyles[variant]}`}>
          {reasons.map((reason, index) => (
            <li key={index} className="text-sm">
              {reason}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function OsReasonsList({ data }: OsReasonsListProps) {
  const { t } = useTranslation();

  if (!data) return null;

  const hasAnyReason =
    (data.cancelReason && data.cancelReason.length > 0) ||
    (data.notRealizedReason && data.notRealizedReason.length > 0) ||
    (data.supplierRejectReason && data.supplierRejectReason.length > 0) ||
    (data.transferReason && data.transferReason.length > 0) ||
    (data.returnReason && data.returnReason.length > 0) ||
    data.osRefusalReason ||
    (data.osRefusalHistory && data.osRefusalHistory.length > 0) ||
    (data.rejectInvoiceReason && data.rejectInvoiceReason.length > 0) ||
    (data.rejectContractReason && data.rejectContractReason.length > 0) ||
    (data.rejectSapReason && data.rejectSapReason.length > 0) ||
    (data.oldBMSRefusalReason && data.oldBMSRefusalReason.length > 0) ||
    data.bms?.refusalReason;

  if (!hasAnyReason) return null;

  // Convert single refusal reason to array
  const osRefusalReasons = data.osRefusalReason ? [data.osRefusalReason, ...(data.osRefusalHistory || [])] : data.osRefusalHistory;
  const bmsRefusalReasons = data.bms?.refusalReason ? [data.bms.refusalReason, ...(data.oldBMSRefusalReason || [])] : data.oldBMSRefusalReason;

  return (
    <div className="space-y-4">
      <ItemDescription className="font-semibold">{t('fas.reasons.history')}</ItemDescription>

      <div className="space-y-2">
        <ReasonItem title={t('fas.cancel.reason')} reasons={data.cancelReason} variant="error" />

        <ReasonItem title={t('fas.not.realized.reason')} reasons={data.notRealizedReason} variant="warning" />

        <ReasonItem title={t('fas.supplier.reject.reason')} reasons={data.supplierRejectReason} variant="error" />

        <ReasonItem title={t('fas.transfer.reason')} reasons={data.transferReason} variant="info" />

        <ReasonItem title={t('fas.return.reason')} reasons={data.returnReason} variant="warning" />

        <ReasonItem title={t('fas.os.refusal.reason')} reasons={osRefusalReasons} variant="error" />

        <ReasonItem title={t('fas.invoice.reject.reason')} reasons={data.rejectInvoiceReason} variant="error" />

        <ReasonItem title={t('fas.contract.reject.reason')} reasons={data.rejectContractReason} variant="error" />

        <ReasonItem title={t('fas.sap.reject.reason')} reasons={data.rejectSapReason} variant="error" />

        <ReasonItem title={t('fas.bms.refusal.reason')} reasons={bmsRefusalReasons} variant="error" />
      </div>
    </div>
  );
}
