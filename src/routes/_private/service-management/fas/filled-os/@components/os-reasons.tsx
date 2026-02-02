import { History } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { FasOrderDetails } from '../@interface/os.schema';

export function OsReasons({ data }: OsReasonsListProps) {
  const { t } = useTranslation();

  if (!data) return null;

  interface SpecItem {
    label: string;
    value: React.ReactNode;
    fullWidth?: boolean;
  }

  interface SpecCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    specs: SpecItem[];
  }

  const osRefusalReasons = data.osRefusalReason ? [data.osRefusalReason, ...(data.osRefusalHistory || [])] : data.osRefusalHistory || [];
  const bmsRefusalReasons = data.bms?.refusalReason ? [data.bms.refusalReason, ...(data.oldBMSRefusalReason || [])] : data.oldBMSRefusalReason || [];

  const renderReasonList = (reasons: string[] | undefined) => {
    if (!reasons || reasons.length === 0) return null;
    if (reasons.length === 1) return <div className="whitespace-pre-wrap">{reasons[0] ? reasons[0] : '-'}</div>;
    return (
      <ul className="list-inside list-disc space-y-1">
        {reasons.map((reason, index) => (
          <li key={`${index}${reason}`} className="text-sm">
            {reason ? reason : '-'}
          </li>
        ))}
      </ul>
    );
  };

  const categories: SpecCategory[] = [
    {
      id: 'reasons-history',
      name: t('fas.reasons.history'),
      icon: <History className="size-4" />,
      specs: [
        {
          label: t('fas.cancel.reason'),
          value: renderReasonList(data.cancelReason),
          fullWidth: true,
        },
        {
          label: t('fas.not.realized.reason'),
          value: renderReasonList(data.notRealizedReason),
          fullWidth: true,
        },
        {
          label: t('fas.supplier.reject.reason'),
          value: renderReasonList(data.supplierRejectReason),
          fullWidth: true,
        },
        {
          label: t('fas.transfer.reason'),
          value: renderReasonList(data.transferReason),
          fullWidth: true,
        },
        {
          label: t('fas.return.reason'),
          value: renderReasonList(data.returnReason),
          fullWidth: true,
        },
        {
          label: t('fas.os.refusal.reason'),
          value: renderReasonList(osRefusalReasons),
          fullWidth: true,
        },
        {
          label: t('fas.invoice.reject.reason'),
          value: renderReasonList(data.rejectInvoiceReason),
          fullWidth: true,
        },
        {
          label: t('fas.contract.reject.reason'),
          value: renderReasonList(data.rejectContractReason),
          fullWidth: true,
        },
        {
          label: t('fas.sap.reject.reason'),
          value: renderReasonList(data.rejectSapReason),
          fullWidth: true,
        },
        {
          label: t('fas.bms.refusal.reason'),
          value: renderReasonList(bmsRefusalReasons),
          fullWidth: true,
        },
      ].filter((spec) => spec.value !== null),
    },
  ];

  if (categories[0].specs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableBody>
          {categories.map((category) => {
            const normalSpecs = category.specs.filter((s) => !s.fullWidth);
            const fullWidthSpecs = category.specs.filter((s) => s.fullWidth);
            const hasNormalRow = normalSpecs.length > 0;
            const totalRows = (hasNormalRow ? 1 : 0) + fullWidthSpecs.length;

            return (
              <React.Fragment key={category.id}>
                {/* Main Row / Normal Specs Row */}
                {hasNormalRow && (
                  <TableRow className="border-t">
                    <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium" rowSpan={totalRows}>
                      <div className="flex items-center gap-1">
                        <ItemMedia variant="icon">{category.icon}</ItemMedia>
                        <ItemTitle>{category.name}</ItemTitle>
                      </div>
                    </TableCell>
                    {normalSpecs.map((spec) => (
                      <TableCell key={spec.label} className="py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <ItemDescription>{spec.label}</ItemDescription>
                          <ItemTitle>{spec.value}</ItemTitle>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )}

                {/* Full Width Specs (Reasons) */}
                {fullWidthSpecs.map((spec, index) => (
                  <TableRow key={spec.label} className="border-t">
                    {!hasNormalRow && index === 0 && (
                      <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium" rowSpan={totalRows}>
                        <div className="flex items-center gap-1">
                          <ItemMedia variant="icon">{category.icon}</ItemMedia>
                          <ItemTitle>{category.name}</ItemTitle>
                        </div>
                      </TableCell>
                    )}
                    <TableCell colSpan={hasNormalRow ? normalSpecs.length : 3} className="py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <ItemDescription>{spec.label}</ItemDescription>
                        <ItemTitle>{spec.value}</ItemTitle>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

interface OsReasonsListProps {
  data: FasOrderDetails | undefined;
}
