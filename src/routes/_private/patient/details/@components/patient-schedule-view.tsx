import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import Add from '@/components/icons/Add.Icon';
import Board from '@/components/icons/Board.Icon';
import ChartPie from '@/components/icons/ChartPie.Icon';
import Link from '@/components/icons/Link.Icon';
import TrendingUp from '@/components/icons/TrendingUp.Icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useClinicStore } from '@/hooks/clinic';
import { useProfessionalStore } from '@/hooks/professionals';
import { PATCH, request } from '@/lib/api/client';
import { currencyFormat, extractDate, formatDate, getStatusColor, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullPatient } from '@/lib/interfaces';
import type { DbSchedule } from '@/lib/interfaces/schedule';
import { cn } from '@/lib/utils';
import { useClinicApi } from '@/query/clinic';
import { usePatientQuery } from '@/query/patient';
import { useProfessionalsQuery } from '@/query/professionals';

const scheduleStatuses = ['pending', 'waiting', 'confirmed', 'completed', 'in_progress', 'no_show', 'canceled', 'canceled_by_patient', 'canceled_by_professional'] as const;

const ScheduleSummarySection = ({ patient }: { patient: FullPatient }) => {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const schedules = patient.schedules || [];
    const financials = patient.financials || [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const nextThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const totalProcedures = financials.reduce((acc, f) => acc + f.procedures.length, 0);
    const totalAmount = financials.reduce((acc, f) => acc + f.procedures.reduce((sum, p) => sum + p.price, 0), 0);

    const completedSchedules = schedules.filter((s) => ['completed', 'confirmed', 'in_progress'].includes(s.status)).length;
    const upcomingSchedules = schedules.filter((s) => {
      const d = new Date(s.start);
      return d > now && d < nextThirtyDays;
    }).length;
    const nextSchedule = schedules.filter((s) => new Date(s.start) > now && s.status === 'pending').sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];
    const recentSchedules = schedules.filter((s) => new Date(s.start) >= thirtyDaysAgo).length;
    const proceduresLast3Months = financials.reduce((acc, f) => {
      const d = new Date(f.createdAt);
      return acc + (d >= threeMonthsAgo && d <= now ? f.procedures.length : 0);
    }, 0);
    const avgProceduresPerSchedule = totalProcedures / (schedules.length || 1);
    const attendanceRate = (completedSchedules / (schedules.length || 1)) * 100;
    const averageAmountPerSchedule = totalAmount / (schedules.length || 1);

    return {
      totalSchedules: schedules.length,
      completedSchedules,
      totalAmount,
      upcomingSchedules,
      recentSchedules,
      totalProcedures,
      nextSchedule,
      avgProceduresPerSchedule,
      attendanceRate,
      averageAmountPerSchedule,
      proceduresLast3Months,
    };
  }, [patient.schedules, patient.financials]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Resumo dos Agendamentos</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: '/patient/details/schedule-add', search: { id: patient._id } })}>
            <Add className="mr-2 size-4" />
            <span className="hidden md:block">Agendar Consulta</span>
          </Button>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 rounded-md border bg-muted/20 p-6">
            <span className="font-semibold text-muted-foreground text-xs uppercase">Próxima consulta</span>
            <p className="font-bold text-lg text-primary">{summary.nextSchedule ? formatDate(String(summary.nextSchedule.start)) : 'Sem consulta agendada'}</p>
            <span className="text-muted-foreground text-xs">{summary.upcomingSchedules} consultas nos próximos 30 dias</span>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground text-xs uppercase">Consultas</span>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <ChartPie className="size-3" />
                <span className="tabular-nums">
                  {summary.completedSchedules} de {summary.totalSchedules}
                </span>
              </div>
            </div>
            <p className="text-center font-bold text-xl">{summary.attendanceRate.toFixed(0)}%</p>
            <span className="block text-center text-muted-foreground text-xs">de comparecimento</span>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground text-xs uppercase">Procedimentos</span>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Board className="size-3" />
                <span>{summary.totalProcedures} no total</span>
              </div>
            </div>
            <p className="text-center font-bold text-lg text-primary">+ {summary.proceduresLast3Months}</p>
            <span className="block text-center text-muted-foreground text-xs">nos últimos 3 meses</span>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground text-xs uppercase">Total em Procedimentos</span>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <TrendingUp className="size-3" />
                <span className="tabular-nums">{currencyFormat(summary.averageAmountPerSchedule)}</span>
              </div>
            </div>
            <p className="text-center font-bold text-xl">{currencyFormat(summary.totalAmount)}</p>
            <span className="block text-center text-muted-foreground text-xs">Em média {currencyFormat(summary.averageAmountPerSchedule)} por consulta</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ScheduleHistorySection = ({ schedules, financials, patientId }: { schedules: DbSchedule[]; financials: FullPatient['financials']; patientId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { data: professionals } = useProfessionalsQuery();
  const { data: clinic } = useClinicApi();
  const professionalStore = useProfessionalStore();
  const clinicStore = useClinicStore();
  const { refetch } = usePatientQuery(patientId);

  const getProfessionalName = (id?: string) => professionalStore.getName(professionals, id);
  const getProfessionalImage = (id?: string) => professionalStore.getImage(professionals, id);
  const getRoomName = (id?: string) => clinicStore.getRoomName(clinic, id);

  const sortedSchedules = useMemo(() => [...schedules].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()), [schedules]);

  const handleStatusChange = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      const res = await request(`schedule/${id}/status`, PATCH({ status }));
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
    <Card>
      <CardContent className="flex flex-col gap-6 p-6">
        <CardTitle className="text-xl">Histórico de Consultas</CardTitle>
        <Accordion type="single" collapsible className="w-full">
          {sortedSchedules.map((el) => {
            const financial = financials?.find((f) => f._id === el.Financial);

            return (
              <AccordionItem key={el._id} value={el._id} className="w-full rounded-lg py-1">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between">
                    <BadgeIndicator variant={el.status}>{statusDictionary(el.status)}</BadgeIndicator>
                    <p className="text-muted-foreground text-sm tabular-nums">{formatDate(String(el.start))}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="my-6 space-y-6 px-2">
                  <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-2">
                      <span className="text-muted-foreground text-sm">Status do agendamento</span>
                      <Select
                        value={selectedStatus[el._id] ?? el.status}
                        onValueChange={(value: string) => {
                          setIsEditing(el._id);
                          setSelectedStatus((prev) => ({ ...prev, [el._id]: value }));
                        }}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <div className={cn('size-2 rounded-full', getStatusColor(selectedStatus[el._id] ?? el.status))} />
                            <SelectValue>{statusDictionary(selectedStatus[el._id] ?? el.status)}</SelectValue>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {scheduleStatuses.map((status) => (
                            <SelectItem key={status} value={status} disabled={isLoading}>
                              <div className="flex items-center gap-2">
                                <div className={cn('size-2 rounded-full', getStatusColor(status))} />
                                {statusDictionary(status)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {isEditing === el._id && (
                      <Button size="sm" onClick={() => handleStatusChange(el._id, selectedStatus[el._id] ?? el.status)} disabled={isLoading}>
                        Salvar
                      </Button>
                    )}
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
                          <span className="text-muted-foreground text-sm">Data</span>
                          <span className="font-bold text-lg">{formatDate(String(el.start))}</span>
                        </div>
                        {!el.allDay && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-sm">Horário</span>
                            <span className="font-bold text-lg">
                              {extractDate(el.start, 'hour')} - {extractDate(el.end, 'hour')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                      <Table className="w-full rounded-xl border p-4 md:max-w-xl">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {financial?.procedures?.length ? (
                            financial.procedures.map((procedure, index) => (
                              <TableRow key={procedure._id ?? index}>
                                <TableCell>{procedure.procedure}</TableCell>
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
                          <span className="text-muted-foreground text-sm">Valor Total</span>
                          <p className="font-medium">{currencyFormat(financial?.procedures?.reduce((acc, p) => acc + p.price, 0) ?? 0)}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-sm">Sala</span>
                          <p className="font-medium">{getRoomName(el.Room) || '-'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-sm">Criado em</span>
                          <p className="font-medium">{formatDate(String(el.createdAt))}</p>
                        </div>
                        {el.Financial && (
                          <Button variant="outline" size="sm" onClick={() => navigate({ to: '/financial/details', search: { id: el.Financial } })}>
                            <Link className="mr-2 size-4" />
                            Financeiro
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export const PatientScheduleView = ({ patient }: { patient: FullPatient }) => {
  const hasSchedules = patient.schedules && patient.schedules.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {hasSchedules ? (
        <>
          <ScheduleSummarySection patient={patient} />
          <ScheduleHistorySection schedules={patient.schedules} financials={patient.financials} patientId={patient._id} />
        </>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DefaultEmptyData />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
