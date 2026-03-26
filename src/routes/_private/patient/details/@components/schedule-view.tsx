import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import Add from '@/components/icons/Add.Icon';
import Board from '@/components/icons/Board.Icon';
import IconCalendar from '@/components/icons/Calender.Icon';
import ChartPie from '@/components/icons/ChartPie.Icon';
import IconDollar from '@/components/icons/Dollar.Icon';
import Down from '@/components/icons/Down.Icon';
import Link from '@/components/icons/Link.Icon';
import IconService from '@/components/icons/Service.Icon';
import TrendingUp from '@/components/icons/TrendingUp.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClinicStore } from '@/hooks/clinic';
import { useProfessionalStore } from '@/hooks/professionals';
import { PATCH, request } from '@/lib/api/client.api';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, extractDate, getStatusColor, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullPatient } from '@/lib/interfaces';
import type { PartialClinic } from '@/lib/interfaces/clinic.interface';
import type { ProfessionalList } from '@/lib/interfaces/professional.interface';
import type { DbSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
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
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">Resumo dos Agendamentos</ItemTitle>
        <ItemActions>
          <Button onClick={() => navigate({ to: '/patient/details/schedule-add', search: { id: patient._id } })}>
            <Add className="size-4" />
            <span className="ml-2 hidden md:block">Agendar Consulta</span>
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemGroup className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Item variant="outline" className="flex-col items-start bg-secondary">
          <ItemTitle className="text-muted-foreground text-xs uppercase">Próxima consulta</ItemTitle>
          <ItemContent className="w-full text-center">
            <p className="font-bold text-xl">{summary.nextSchedule ? formatDate(String(summary.nextSchedule.start)) : 'Sem consulta agendada'}</p>
            <ItemDescription>{summary.upcomingSchedules} consultas nos próximos 30 dias</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Consultas</ItemTitle>
            <div className="flex items-baseline gap-1 text-muted-foreground">
              <ChartPie className="size-3" />
              <ItemDescription className="tabular-nums leading-none">
                {summary.completedSchedules} de {summary.totalSchedules}
              </ItemDescription>
            </div>
          </div>
          <ItemContent className="w-full text-center">
            <div className="flex items-baseline justify-center gap-2">
              <p className="font-bold text-xl">{summary.attendanceRate.toFixed(0)}%</p>
              <ItemDescription className="text-lg">de comparecimento</ItemDescription>
            </div>
            <ItemDescription>+ {summary.recentSchedules} consultas nos últimos 30 dias</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Procedimentos</ItemTitle>
            <div className="flex items-baseline gap-1 text-muted-foreground">
              <Board className="size-3" />
              <ItemDescription className="tabular-nums leading-none">{summary.totalProcedures} no total</ItemDescription>
            </div>
          </div>
          <ItemContent className="w-full text-center">
            <div className="flex items-baseline justify-center gap-2">
              <p className="font-bold text-primary text-xl">+ {summary.proceduresLast3Months}</p>
              <ItemDescription className="text-lg">nos últimos 3 meses</ItemDescription>
            </div>
            <ItemDescription>Em média {summary.avgProceduresPerSchedule.toFixed(1)} procedimentos por consulta</ItemDescription>
          </ItemContent>
        </Item>

        <Item variant="outline" className="flex-col items-start bg-secondary">
          <div className="flex w-full items-center justify-between">
            <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">Total em Procedimentos</ItemTitle>
            <div className="flex items-baseline gap-1 text-muted-foreground">
              <TrendingUp className="size-3" />
              <ItemDescription className="tabular-nums leading-none">{currencyFormat(summary.averageAmountPerSchedule)}</ItemDescription>
            </div>
          </div>
          <ItemContent className="w-full">
            <p className="font-bold text-xl">{currencyFormat(summary.totalAmount)}</p>
            <ItemDescription>Em média {currencyFormat(summary.averageAmountPerSchedule)} por consulta</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Item>
  );
};

const ScheduleRecordDetail = ({
  el,
  financial,
  professionals,
  clinic,
  isLoading,
  handleStatusChange,
  isEditing,
  setIsEditing,
  setSelectedStatus,
  selectedStatus,
}: {
  el: DbSchedule;
  financial: FullPatient['financials'][number] | undefined;
  professionals: ProfessionalList[] | undefined;
  clinic: PartialClinic | undefined;
  isLoading: boolean;
  handleStatusChange: (id: string, status: string) => void;
  isEditing: string | null;
  setIsEditing: (id: string | null) => void;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedStatus: Record<string, string>;
}) => {
  const navigate = useNavigate();
  const professionalStore = useProfessionalStore();
  const clinicStore = useClinicStore();
  const getProfessionalName = (id?: string) => professionalStore.getName(professionals, id);
  const getProfessionalImage = (id?: string) => professionalStore.getImage(professionals, id);
  const getRoomName = (id?: string) => clinicStore.getRoomName(clinic, id);

  const [openCategories, setOpenCategories] = useState<string[]>(['general', 'procedures', 'details']);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <CollapsibleContent className="my-4 px-2">
      <div className="space-y-6">
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
            <Button onClick={() => handleStatusChange(el._id, selectedStatus[el._id] ?? el.status)} disabled={isLoading}>
              Salvar
            </Button>
          )}
        </div>

        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Dados Gerais */}
          <Collapsible open={openCategories.includes('general')} onOpenChange={() => toggleCategory('general')}>
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
              >
                <div className="flex items-center gap-3">
                  <ItemMedia variant="icon" className="text-foreground">
                    <IconCalendar className="size-4" />
                  </ItemMedia>
                  <ItemTitle className="text-base">Dados Gerais</ItemTitle>
                </div>
                <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('general') && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ItemGroup className="gap-0">
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-md">
                      <AvatarImage src={getProfessionalImage(el.Professional)} />
                      <AvatarFallback>{getProfessionalName(el.Professional).slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <ItemDescription className="font-sans">Profissional</ItemDescription>
                  </div>
                  <ItemTitle className="font-mono">{getProfessionalName(el.Professional)}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">Data</ItemDescription>
                  <ItemTitle className="font-mono">{formatDate(String(el.start))}</ItemTitle>
                </Item>
                {!el.allDay && (
                  <>
                    <ItemSeparator />
                    <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                      <ItemDescription className="font-sans">Horário</ItemDescription>
                      <ItemTitle className="font-mono">
                        {extractDate(el.start, 'hour')} - {extractDate(el.end, 'hour')}
                      </ItemTitle>
                    </Item>
                  </>
                )}
              </ItemGroup>
            </CollapsibleContent>
          </Collapsible>

          {/* Procedimentos */}
          <Collapsible open={openCategories.includes('procedures')} onOpenChange={() => toggleCategory('procedures')}>
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
              >
                <div className="flex items-center gap-3">
                  <ItemMedia variant="icon" className="text-foreground">
                    <IconService className="size-4" />
                  </ItemMedia>
                  <ItemTitle className="text-base">Procedimentos</ItemTitle>
                </div>
                <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('procedures') && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ItemGroup className="gap-0">
                {financial?.procedures?.length ? (
                  financial.procedures.map((procedure, index) => (
                    <div key={procedure._id ?? index}>
                      <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                        <ItemDescription className="font-sans">{procedure.procedure}</ItemDescription>
                        <ItemTitle className="font-mono">{currencyFormat(procedure.price)}</ItemTitle>
                      </Item>
                      {index < financial.procedures.length - 1 && <ItemSeparator />}
                    </div>
                  ))
                ) : (
                  <Item variant="default" size="sm" className="justify-center py-4">
                    <ItemDescription className="italic">Nenhum procedimento registrado</ItemDescription>
                  </Item>
                )}
              </ItemGroup>
            </CollapsibleContent>
          </Collapsible>

          {/* Detalhes */}
          <Collapsible open={openCategories.includes('details')} onOpenChange={() => toggleCategory('details')}>
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
              >
                <div className="flex items-center gap-3">
                  <ItemMedia variant="icon" className="text-foreground">
                    <IconDollar className="size-4" />
                  </ItemMedia>
                  <ItemTitle className="text-base">Detalhes</ItemTitle>
                </div>
                <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('details') && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ItemGroup className="gap-0">
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">Valor Total</ItemDescription>
                  <ItemTitle className="font-mono">{currencyFormat(financial?.procedures?.reduce((acc, p) => acc + p.price, 0) ?? 0)}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">Sala</ItemDescription>
                  <ItemTitle className="font-mono">{getRoomName(el.Room) || '-'}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">Criado em</ItemDescription>
                  <ItemTitle className="font-mono">{formatDate(String(el.createdAt))}</ItemTitle>
                </Item>
                {el.Financial && (
                  <>
                    <ItemSeparator />
                    <Item variant="default" size="sm" className="justify-center py-2 hover:bg-secondary">
                      <Badge variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/financial/details', search: { id: el.Financial } })}>
                        <Link className="mr-2 size-4" />
                        Ver Financeiro
                      </Badge>
                    </Item>
                  </>
                )}
              </ItemGroup>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </CollapsibleContent>
  );
};

const ScheduleHistorySection = ({ schedules, financials, patientId }: { schedules: DbSchedule[]; financials: FullPatient['financials']; patientId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const { data: professionals } = useProfessionalsQuery();
  const { data: clinic } = useClinicApi();
  const clinicStore = useClinicStore();
  const { refetch } = usePatientQuery(patientId);

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
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">Histórico de Consultas</ItemTitle>
      </ItemHeader>

      <ItemContent>
        <div className="w-full">
          <div className="flex h-12 items-center border-b px-2 text-left text-foreground/80 text-sm">
            <div className="flex-1 font-semibold">Status do agendamento</div>
            <div className="flex-1 font-semibold">Data do atendimento</div>
            <div className="w-48 text-right font-semibold">Sala</div>
            <div className="w-8" />
          </div>
          {sortedSchedules.map((el) => {
            const financial = financials?.find((f) => f._id === el.Financial);

            return (
              <Collapsible key={el._id} className="w-full border-b">
                <CollapsibleTrigger className="group w-full text-left transition-colors hover:bg-secondary">
                  <div className="flex h-16 items-center px-2 text-left text-foreground/60 text-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BadgeIndicator variant={el.status} pulse />
                        <ItemTitle className="text-lg">{statusDictionary(el.status)}</ItemTitle>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="tabular-nums">{formatDate(String(el.start))}</p>
                    </div>
                    <div className="w-48 text-right font-medium text-foreground">{getRoomName(el.Room) || '-'}</div>
                    <div className="ml-4 flex items-center justify-end">
                      <Down className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <ScheduleRecordDetail
                  el={el}
                  financial={financial}
                  professionals={professionals}
                  clinic={clinic}
                  isLoading={isLoading}
                  handleStatusChange={handleStatusChange}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  setSelectedStatus={setSelectedStatus}
                  selectedStatus={selectedStatus}
                />
              </Collapsible>
            );
          })}
        </div>
      </ItemContent>
    </Item>
  );
};

export const PatientScheduleView = ({ patient }: { patient: FullPatient }) => {
  const hasSchedules = patient.schedules && patient.schedules.length > 0;

  return (
    <ItemGroup>
      {hasSchedules ? (
        <>
          <ScheduleSummarySection patient={patient} />
          <ScheduleHistorySection schedules={patient.schedules} financials={patient.financials} patientId={patient._id} />
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
