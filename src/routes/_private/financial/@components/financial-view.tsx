import { useState } from 'react';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import { useFinancialDetailQuery, useFinancialMutations } from '@/query/financials';
import { getProfessionalName, useProfessionalsQuery } from '@/query/professionals';
import { FINANCIAL_STATUS_OPTIONS } from '../@consts/financial.consts';

type FinancialViewProps = {
  id: string;
  isOpen?: boolean;
};

export function FinancialView({ id, isOpen = true }: FinancialViewProps) {
  const { data: financial, isLoading } = useFinancialDetailQuery(isOpen ? id : undefined);
  const { data: professionals } = useProfessionalsQuery();
  const { updateStatus } = useFinancialMutations();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleStatusChange = async (status: string) => {
    setSelectedStatus(status);
    try {
      const res = await updateStatus.mutateAsync({ id, status });
      toast.success(res.message);
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  const handleStatusSelection = (value: string) => {
    handleStatusChange(value);
  };

  if (isLoading || !financial) {
    return <DefaultLoading />;
  }

  return (
    <div className="flex w-full flex-col">
      {/* 1. Procedimentos */}
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('procedure.singular')}</TableHead>
            <TableHead className="h-7 w-[150px] px-4 py-1.5 font-medium text-foreground text-xs">{t('status')}</TableHead>
            <TableHead className="h-7 w-[150px] px-4 py-1.5 text-right font-medium text-foreground text-xs">{t('price')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financial.procedures?.length ? (
            financial.procedures.map((proc: { procedure: string; status: string; price: number; _id?: string }, index: number) => (
              <TableRow key={proc._id || index} className="border-b-0">
                <TableCell className="px-4 py-2 font-medium text-xs">{proc.procedure}</TableCell>
                <TableCell className="px-4 py-2 text-muted-foreground text-xs">{statusDictionary(proc.status)}</TableCell>
                <TableCell className="px-4 py-2 text-right font-mono font-semibold text-xs tabular-nums">{currencyFormat(proc.price)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="px-4 py-4 text-center text-muted-foreground text-xs">
                {t('procedures.none.found')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 2. Resto dos Dados Financeiros */}
      <Table className="mt-0">
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('professional')}</TableHead>
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('patient')}</TableHead>
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('payment.method.short')}</TableHead>
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('installments')}</TableHead>
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('date')}</TableHead>
            <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">{t('amount.paid')}</TableHead>
            <TableHead className="h-7 px-4 py-1.5 text-right font-medium text-foreground text-xs">{t('total')}</TableHead>
            <TableHead className="h-7 w-[150px] px-4 py-1.5 text-right font-medium text-foreground text-xs">{t('status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell className="w-[180px] px-4 py-3 text-xs">
              <span className="max-w-[120px] truncate font-medium" title={getProfessionalName(professionals, financial.Professional)}>
                {getProfessionalName(professionals, financial.Professional)}
              </span>
            </TableCell>
            <TableCell className="w-[180px] px-4 py-3 text-xs">
              <span className="max-w-[120px] truncate font-medium" title={financial.patient?.name}>
                {financial.patient?.name}
              </span>
            </TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground text-xs">{financialPaymentMethod(financial.paymentMethod || 'none')}</TableCell>
            <TableCell className="px-4 py-3 text-xs tabular-nums">{financial.installments || 1}x</TableCell>
            <TableCell className="px-4 py-3 text-muted-foreground text-xs tabular-nums">{formatDate(financial.createdAt)}</TableCell>
            <TableCell className="px-4 py-3 font-medium font-mono text-xs tabular-nums">{currencyFormat(financial.paid || 0)}</TableCell>
            <TableCell className="px-4 py-3 text-right font-bold font-mono text-foreground text-xs tabular-nums">{currencyFormat(financial.price)}</TableCell>
            <TableCell className="p-2 pr-4 text-right">
              <Select onValueChange={handleStatusSelection} value={selectedStatus || financial.status || 'pending'} disabled={updateStatus.isPending}>
                <SelectTrigger className="ml-auto h-7 w-fit min-w-[110px] text-xs">
                  <SelectValue>{statusDictionary(selectedStatus || financial.status || 'pending')}</SelectValue>
                </SelectTrigger>
                <SelectContent align="end">
                  {FINANCIAL_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} className="text-xs" value={opt.value} disabled={updateStatus.isPending}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
