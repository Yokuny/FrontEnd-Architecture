import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { currencyFormat, extractDate, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import { useFinancialDetailQuery, useFinancialMutations } from '@/query/financials';
import { getProfessionalImage, getProfessionalName, useProfessionalsQuery } from '@/query/professionals';
import { FINANCIAL_STATUS_OPTIONS } from '../@consts/financial.consts';

type FinancialViewProps = {
  id: string;
};

export function FinancialView({ id }: FinancialViewProps) {
  const [open, setOpen] = useState(false);

  const { data: financial, isLoading } = useFinancialDetailQuery(open ? id : undefined);
  const { data: professionals } = useProfessionalsQuery();
  const { updateStatus } = useFinancialMutations();

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleStatusChange = async (status: string) => {
    setSelectedStatus(status);
    try {
      const res = await updateStatus.mutateAsync({ id, status });
      toast.success(res.message);
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-2 py-1.5 text-sm">Visualizar detalhes</DialogTrigger>

      <DialogContent className="w-11/12 gap-0 md:w-full md:max-w-4xl">
        {financial && !isLoading ? (
          <>
            <DialogHeader className="w-full">
              <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
                <DialogTitle className="truncate tracking-wide md:text-2xl">Registro Financeiro</DialogTitle>
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
            </DialogHeader>

            <div className="flex flex-col gap-4 md:gap-6 md:px-6">
              <div className="flex items-center gap-4 md:max-w-md">
                <div className="flex w-1/2 items-center space-x-4 rounded-lg p-4 md:border">
                  <Avatar className="border">
                    <AvatarImage src={getProfessionalImage(professionals, financial.Professional)} alt="Profissional" />
                    <AvatarFallback>{getProfessionalName(professionals, financial.Professional).slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <ItemContent className="gap-0">
                    <ItemTitle className="truncate">{getProfessionalName(professionals, financial.Professional)}</ItemTitle>
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
                <Table className="w-full rounded-xl border p-4 md:max-w-md md:py-8">
                  <TableHeader>
                    <TableRow className="font-semibold leading-none">
                      <TableCell>Procedimento</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financial.procedures?.length > 0 ? (
                      financial.procedures.map((procedure, i) => (
                        <TableRow key={`${procedure.procedure}-${i}`}>
                          <TableCell>{procedure.procedure}</TableCell>
                          <TableCell className="tabular-nums">{currencyFormat(procedure.price)}</TableCell>
                          <TableCell>{statusDictionary(procedure.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Nenhum procedimento registrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

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
          </>
        ) : (
          <>
            <DialogHeader className="w-full">
              <DialogTitle>
                <Skeleton className="h-7 w-[200px] md:h-8 md:w-[250px]" />
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 md:gap-6 md:px-6">
              <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
                <Skeleton className="flex w-full flex-row items-start py-16 md:max-w-lg md:flex-col" />
                <div className="flex w-full flex-row items-start justify-between gap-4 md:flex-col">
                  <Skeleton className="w-full max-w-40 py-8" />
                  <Skeleton className="w-full max-w-40 py-8" />
                </div>
              </div>
              <Skeleton className="py-32 md:max-w-lg" />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
