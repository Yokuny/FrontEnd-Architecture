import { useState } from 'react';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfessionalStore } from '@/hooks/professionals';
import { currencyFormat, extractDate, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import { useFinancialDetailQuery, useFinancialMutations } from '@/query/financials';
import { useProfessionalsQuery } from '@/query/professionals';
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
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading || !financial) {
    return <DefaultLoading />;
  }

  return (
    <div className="w-full pt-2">
      <div className="mb-6 w-full">
        <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
          <h3 className="truncate font-semibold tracking-wide md:text-2xl">Registro Financeiro</h3>
          <div className="flex w-full items-center justify-end gap-2 md:w-fit">
            {selectedStatus !== null && (
              <Button type="button" size="sm" variant="default" onClick={() => handleStatusChange(selectedStatus)} disabled={updateStatus.isPending}>
                Salvar
              </Button>
            )}
            <Select onValueChange={(value) => setSelectedStatus(value)} defaultValue={financial.status || 'pending'} disabled={updateStatus.isPending}>
              <SelectTrigger className="w-fit">
                <SelectValue className="text-xs">{statusDictionary(selectedStatus || financial.status)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {FINANCIAL_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} className="text-xs" value={opt.value} disabled={updateStatus.isPending}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-4 md:max-w-md">
          <div className="flex w-1/2 items-center space-x-4 rounded-lg p-4 md:border">
            <Avatar className="border">
              <AvatarImage src={useProfessionalStore.getState().getImage(professionals, financial.Professional)} alt="Profissional" />
              <AvatarFallback>{useProfessionalStore.getState().getName(professionals, financial.Professional).slice(0, 2)}</AvatarFallback>
            </Avatar>
            <ItemContent className="gap-0">
              <ItemTitle className="truncate">{useProfessionalStore.getState().getName(professionals, financial.Professional)}</ItemTitle>
              <ItemDescription>Profissional</ItemDescription>
            </ItemContent>
          </div>
          <div className="flex w-1/2 items-center space-x-4 rounded-lg p-4 md:border">
            <Avatar>
              <AvatarImage src={financial.patient?.image} alt="Paciente" />
              <AvatarFallback>{financial.patient?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <ItemContent className="gap-0">
              <ItemTitle className="w-20 truncate md:w-auto">{financial.patient?.name}</ItemTitle>
              <ItemDescription>Paciente</ItemDescription>
            </ItemContent>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <DataTable
            className="w-full rounded-xl border p-4 md:max-w-md md:py-8"
            data={financial.procedures || []}
            columns={[
              { key: 'procedure', header: 'Procedimento' },
              { key: 'price', header: 'Preço', render: (v) => <span className="tabular-nums">{currencyFormat(v)}</span> },
              { key: 'status', header: 'Status', render: (v) => statusDictionary(v) },
            ]}
            searchable={false}
            showPagination={false}
            compact
            bordered={false}
          />

          <div className="flex h-fit flex-row flex-wrap justify-between gap-4 p-4 md:max-w-md md:flex-col md:p-8">
            <ItemContent className="w-1/4 gap-0 md:w-full">
              <ItemDescription>Pagamento</ItemDescription>
              <ItemTitle>{statusDictionary(financial.status || '')}</ItemTitle>
            </ItemContent>
            <ItemContent className="w-1/4 gap-0 md:w-full">
              <ItemDescription>Valor pago</ItemDescription>
              <ItemTitle className="tabular-nums">{currencyFormat(financial.paid || 0)}</ItemTitle>
            </ItemContent>
            <ItemContent className="w-1/4 gap-0 md:w-full">
              <ItemDescription>Forma de Pagamento</ItemDescription>
              <ItemTitle>{financialPaymentMethod(financial.paymentMethod || 'none')}</ItemTitle>
            </ItemContent>
            <ItemContent className="w-1/4 gap-0 md:w-full">
              <ItemDescription>Parcelas</ItemDescription>
              <ItemTitle className="tabular-nums">{financial.installments || 1}</ItemTitle>
            </ItemContent>
            <ItemContent className="w-1/4 gap-0 md:w-full">
              <ItemDescription>Criado em</ItemDescription>
              <ItemTitle className="tabular-nums">{extractDate(financial.createdAt, '')}</ItemTitle>
            </ItemContent>
            <ItemContent className="w-1/4 gap-0 md:w-full">
              <ItemDescription>Total</ItemDescription>
              <ItemTitle className="tabular-nums">{currencyFormat(financial.price)}</ItemTitle>
            </ItemContent>
          </div>
        </div>
      </div>
    </div>
  );
}
