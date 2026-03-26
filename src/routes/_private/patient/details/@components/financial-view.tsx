import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import Add from '@/components/icons/Add.Icon';
import Board from '@/components/icons/Board.Icon';
import ChartPie from '@/components/icons/ChartPie.Icon';
import Edit from '@/components/icons/Edit.Icon';
import TrendingUp from '@/components/icons/TrendingUp.Icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProfessionalStore } from '@/hooks/professionals';
import { PATCH, request } from '@/lib/api/client';
import { currencyFormat, extractDate, financialPaymentMethod, formatDate, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullPatient } from '@/lib/interfaces';
import type { DbFinancial } from '@/lib/interfaces/financial';
import { usePatientQuery } from '@/query/patient';
import { useProfessionalsQuery } from '@/query/professionals';

const FinancialSummarySection = ({ patient }: { patient: FullPatient }) => {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const financials = patient.financials || [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const procedureCount = financials.reduce((acc, f) => acc + f.procedures.length, 0);
    const paidProcedures = financials.reduce((acc, f) => acc + (f.status === 'paid' ? f.procedures.length : 0), 0);
    const recentProcedures = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (d >= twoMonthsAgo ? f.procedures.length : 0);
    }, 0);
    const proceduresLastMonth = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (d >= thirtyDaysAgo ? f.procedures.length : 0);
    }, 0);
    const totalLastMonth = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (d >= thirtyDaysAgo ? f.price : 0);
    }, 0);
    const totalAmount = financials.reduce((acc, f) => acc + f.price, 0);
    const totalLast3Months = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (d >= threeMonthsAgo ? f.price : 0);
    }, 0);
    const totalLast2Months = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (d >= twoMonthsAgo ? f.price : 0);
    }, 0);
    const totalPaid = financials.reduce((acc, f) => acc + (f.status === 'paid' ? f.price : 0), 0);
    const paidLast30Days = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (f.status === 'paid' && d >= thirtyDaysAgo ? f.price : 0);
    }, 0);
    const totalPending = totalAmount - totalPaid;
    const lastPaymentDate = financials.filter((f) => f.status === 'paid').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt;

    return {
      totalLastMonth,
      procedureCount,
      paidProcedures,
      recentProcedures,
      proceduresLastMonth,
      totalAmount,
      totalLast3Months,
      totalLast2Months,
      totalPaid,
      paidLast30Days,
      totalPending,
      lastPaymentDate,
    };
  }, [patient.financials]);

  return (
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">Resumo Financeiro</ItemTitle>
        <ItemActions>
          <Button onClick={() => navigate({ to: '/patient/details/financial-add', search: { id: patient._id } })}>
            <Add className="size-4" />
            <span className="ml-2 hidden md:block">Novo Registro</span>
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemGroup className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Total</ItemTitle>
            <div className="flex items-baseline gap-1 text-muted-foreground">
              <TrendingUp className="size-3" />
              <ItemDescription className="tabular-nums leading-none">{currencyFormat(summary.totalLastMonth)} este mês</ItemDescription>
            </div>
          </div>
          <ItemContent className="w-full text-center">
            <p className="font-bold text-xl">{currencyFormat(summary.totalAmount)}</p>
            <ItemDescription>{currencyFormat(summary.totalLast3Months)} nos últimos 3 meses</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Total Pago</ItemTitle>
            <ItemDescription className="tabular-nums leading-none">{currencyFormat(summary.paidLast30Days)} este mês</ItemDescription>
          </div>
          <ItemContent className="w-full text-center">
            <p className="font-bold text-green-500 text-xl dark:text-lime-400">{currencyFormat(summary.totalPaid)}</p>
            <ItemDescription>{currencyFormat(summary.totalLast2Months)} nos últimos 2 meses</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Total Pendente</ItemTitle>
            <div className="flex items-baseline gap-1 text-muted-foreground">
              <ChartPie className="size-3" />
              <ItemDescription className="tabular-nums leading-none">
                {summary.paidProcedures} de {summary.procedureCount} pagos
              </ItemDescription>
            </div>
          </div>
          <ItemContent className="w-full text-center">
            <p className="font-bold text-xl text-yellow-500 dark:text-yellow-400">{currencyFormat(summary.totalPending)}</p>
            <ItemDescription>Último pagamento em {summary.lastPaymentDate ? formatDate(String(summary.lastPaymentDate)) : 'N/A'}</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Procedimentos</ItemTitle>
            <div className="flex items-baseline gap-1 text-muted-foreground">
              <Board className="size-3" />
              <ItemDescription className="tabular-nums leading-none">{summary.procedureCount} procedimentos</ItemDescription>
            </div>
          </div>
          <ItemContent className="w-full text-center">
            <p className="font-bold text-xl">{summary.proceduresLastMonth} no último mês</p>
            <ItemDescription>Adicionados {summary.recentProcedures} em 2 meses</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Item>
  );
};

const FinancialHistorySection = ({ financials, patientId }: { financials: DbFinancial[]; patientId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { data: professionals } = useProfessionalsQuery();
  const professionalStore = useProfessionalStore();
  const { refetch } = usePatientQuery(patientId);

  const getProfessionalName = (id?: string) => professionalStore.getName(professionals, id);
  const getProfessionalImage = (id?: string) => professionalStore.getImage(professionals, id);

  const sortedFinancials = useMemo(() => [...financials].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [financials]);

  const handleStatusChange = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      const res = await request(`financial/${id}/status`, PATCH({ status }));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar status');
    } finally {
      setIsLoading(false);
      setIsEditing(null);
    }
  };

  return (
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">Registros Financeiros</ItemTitle>
      </ItemHeader>

      <ItemContent>
        <Accordion type="single" collapsible className="w-full">
          {sortedFinancials.map((el) => (
            <AccordionItem key={el._id} value={el._id} className="w-full rounded-lg py-1">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <BadgeIndicator variant={el.status}>{statusDictionary(el.status)}</BadgeIndicator>
                  <p className="text-muted-foreground text-sm tabular-nums">{formatDate(String(el.createdAt))}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="my-6 space-y-6 px-2">
                <div className="flex items-end gap-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground text-sm">Status do pagamento</span>
                    <Select
                      value={selectedStatus[el._id] ?? el.status}
                      onValueChange={(value: string) => {
                        setIsEditing(el._id);
                        setSelectedStatus((prev) => ({ ...prev, [el._id]: value }));
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>{statusDictionary(selectedStatus[el._id] ?? el.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending" disabled={isLoading}>
                          Pendente
                        </SelectItem>
                        <SelectItem value="partial" disabled={isLoading}>
                          Parcial
                        </SelectItem>
                        <SelectItem value="paid" disabled={isLoading}>
                          Pago
                        </SelectItem>
                        <SelectItem value="refund" disabled={isLoading}>
                          Reembolsado
                        </SelectItem>
                        <SelectItem value="canceled" disabled={isLoading}>
                          Cancelado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isEditing === el._id && (
                    <Button onClick={() => handleStatusChange(el._id, selectedStatus[el._id] ?? el.status)} disabled={isLoading}>
                      Salvar
                    </Button>
                  )}
                  <Button onClick={() => navigate({ to: '/financial/details', search: { id: el._id } })}>
                    <Edit className="mr-2 size-4" />
                    Editar
                  </Button>
                </div>

                <div className="flex w-full flex-col gap-4 md:gap-6">
                  <div className="flex flex-col gap-4 md:max-w-xl md:flex-row">
                    <div className="flex w-full items-center gap-3 rounded-xl border p-6">
                      <Avatar>
                        <AvatarImage src={getProfessionalImage(el.Professional)} />
                        <AvatarFallback>{getProfessionalName(el.Professional).slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Profissional</span>
                        <span className="font-bold">{getProfessionalName(el.Professional)}</span>
                      </div>
                    </div>
                    <div className="flex w-full gap-4 rounded-xl border p-6">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Criado em</span>
                        <span className="font-bold text-lg">{formatDate(String(el.createdAt))}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Horário</span>
                        <span className="font-bold text-lg">{extractDate(el.createdAt, 'hour')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <Table className="w-full rounded-xl border p-4 md:max-w-xl">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Procedimento</TableHead>
                          <TableHead>Preço</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {el.procedures?.length > 0 ? (
                          el.procedures.map((procedure) => (
                            <TableRow key={procedure._id ?? procedure.procedure}>
                              <TableCell className="max-w-28 truncate md:max-w-none">{procedure.procedure}</TableCell>
                              <TableCell className="tabular-nums">{currencyFormat(procedure.price)}</TableCell>
                              <TableCell>
                                <BadgeIndicator variant={procedure.status}>{statusDictionary(procedure.status)}</BadgeIndicator>
                              </TableCell>
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

                    <div className="flex flex-col gap-4 rounded-xl border p-6 md:max-w-md">
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">Pagamento</span>
                        <p className="font-medium">{statusDictionary(el.status)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">Valor pago</span>
                        <p className="font-medium">{currencyFormat(el.paid || 0)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">Forma de Pagamento</span>
                        <p className="font-medium">{financialPaymentMethod(el.paymentMethod || 'none')}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">Parcelas</span>
                        <p className="font-medium">{el.installments || 1}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">Total</span>
                        <p className="font-medium">{currencyFormat(el.price || 0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ItemContent>
    </Item>
  );
};

export const PatientFinancialView = ({ patient }: { patient: FullPatient }) => {
  const hasFinancials = patient.financials && patient.financials.length > 0;

  return (
    <ItemGroup>
      {hasFinancials ? (
        <>
          <FinancialSummarySection patient={patient} />
          <FinancialHistorySection financials={patient.financials} patientId={patient._id} />
        </>
      ) : (
        <Item>
          <ItemContent>
            <DefaultEmptyData />
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  );
};
