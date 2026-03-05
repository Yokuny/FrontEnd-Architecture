import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { toast } from 'sonner';
import Calender from '@/components/icons/Calender.Icon';
import Chat from '@/components/icons/Chat.Icon';
import Clock from '@/components/icons/Clock.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Link from '@/components/icons/Link.Icon';
import Right from '@/components/icons/Right.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { t } from '@/config/translate';
import { usePatientStore } from '@/hooks/patients';
import { useProfessionalStore } from '@/hooks/professionals';
import { useIsMobile } from '@/hooks/use-mobile';
import { PATCH, POST, request } from '@/lib/api/client';
import { currencyFormat, extractDate, getStatusColor, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullSchedule, PartialSchedule } from '@/lib/interfaces/schedule';
import { cn } from '@/lib/utils';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';

export const ScheduleRender = ({ schedule, event, onEdit }: ScheduleRenderProps) => {
  const { data: professionals } = useProfessionalsQuery();
  const { data: patients } = usePatientsQuery();

  const professionalNameStore = useProfessionalStore();
  const patientStore = usePatientStore();

  const getProfessionalName = (profId: string | undefined) => professionalNameStore.getName(professionals, profId);
  const getProfessionalImage = (profId: string | undefined) => professionalNameStore.getImage(professionals, profId);
  const getPatientName = (patientId: string | undefined) => patientStore.getName(patients, patientId);
  const getPatientImage = (patientId: string | undefined) => patientStore.getImage(patients, patientId);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const [selectedStatus, setSelectedStatus] = useState<string>(schedule.status);
  const navigate = useNavigate();

  const professionalImage = schedule?.Professional ? getProfessionalImage(schedule.Professional) : '';
  const professionalName = schedule?.Professional ? getProfessionalName(schedule.Professional) : '';
  const patientImage = schedule?.Patient ? getPatientImage(schedule.Patient) : '';
  const patientName = schedule?.Patient ? getPatientName(schedule.Patient) : '';

  const handleStatusChange = async () => {
    setIsLoading(true);
    try {
      const res = await request(`schedule/${schedule._id}/status`, PATCH({ status: selectedStatus }));
      if (res.success === false) throw new Error(res.message);
      toast.success(res.message);
      setIsEditing(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestScheduleConfirmation = async () => {
    setIsLoading(true);
    try {
      const res = await request(`schedule/${schedule._id}/confirmation-passkey`, POST({}));
      if (res.success === false) throw new Error(res.message);
      toast.success(res.message);
      window.open(res.data.url, '_blank');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderScheduleDateTime = () => {
    const startDate = new Date(schedule.start);
    const endDate = schedule.end ? new Date(schedule.end) : startDate;
    const isSameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');

    if (schedule.allDay) {
      const daysDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return (
        <div className="flex flex-row items-center justify-between gap-4 md:flex-col">
          <CardContent className="w-full space-y-2 p-4 md:px-6">
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="text-muted-foreground text-sm">Data</p>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Calender className="hidden size-4 md:block" />
                <span className="text-muted-foreground tabular-nums tracking-tight">{t('all.day')}</span>
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0">
              <p className="font-bold text-md tabular-nums md:text-xl">{format(startDate, 'dd - MMM', { locale: ptBR })}</p>
              <p className="text-muted-foreground text-sm tracking-tight">{format(startDate, 'EEEEEE', { locale: ptBR })}</p>
            </div>
          </CardContent>

          {!isSameDay && (
            <CardContent className="w-full space-y-2 p-4 md:px-6">
              <div className="flex flex-row items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm">Data Final</p>
                <Button variant="outline" size="sm" className="gap-1 px-2 text-xs">
                  <Clock className="hidden size-4 md:block" />
                  <span className="text-muted-foreground tabular-nums tracking-tight">{daysDuration} dias</span>
                </Button>
              </div>
              <div className="flex flex-row items-center justify-between space-y-0">
                <p className="font-bold text-md tabular-nums md:text-xl">{format(endDate, 'dd - MMM', { locale: ptBR })}</p>
                <p className="text-muted-foreground text-sm tracking-tight">{format(endDate, 'EEEEEE', { locale: ptBR })}</p>
              </div>
            </CardContent>
          )}
        </div>
      );
    }

    if (isSameDay) {
      return (
        <div className="flex flex-row items-center justify-between gap-4 md:flex-col">
          <div className="flex w-full flex-col items-start gap-2 space-x-4 rounded-lg p-2 md:border md:p-4">
            <p className="text-muted-foreground text-sm">Dia</p>
            <p className="font-bold tabular-nums md:text-xl">{extractDate(schedule?.start, '')}</p>
          </div>
          <div className="flex w-full flex-col items-start gap-2 space-x-4 rounded-lg p-2 md:border md:p-4">
            <p className="text-muted-foreground text-sm">Horário</p>
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-md tabular-nums md:text-xl">{extractDate(schedule?.start, 'hour')}</p>
              <Right className="size-4" />
              <p className="font-bold text-md tabular-nums md:text-xl">{extractDate(schedule?.end || event.end, 'hour')}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-row items-center justify-between gap-4 md:flex-col">
        <div className="flex w-full flex-col items-start gap-2 space-x-4 rounded-lg p-2 md:border md:p-4">
          <p className="text-muted-foreground text-sm">Data Início</p>
          <div className="flex items-baseline gap-3">
            <p className="font-bold tabular-nums md:text-xl">{extractDate(schedule?.start, 'hour')}</p>
            <div className="flex items-start gap-1">
              <Calender className="size-4" />
              <p className="text-muted-foreground md:text-lg">{extractDate(schedule?.start, 'short')}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2 space-x-4 rounded-lg p-2 md:border md:p-4">
          <p className="text-muted-foreground text-sm">Data Final</p>
          <div className="flex items-baseline gap-3">
            <p className="font-bold tabular-nums md:text-xl">{extractDate(schedule?.end || event.end, 'hour')}</p>
            <div className="flex items-start gap-1">
              <Calender className="size-4" />
              <p className="text-muted-foreground md:text-lg">{extractDate(schedule?.end || event.end, 'short')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const statusOptions = [
    { value: 'pending', label: t('pending') },
    { value: 'waiting', label: t('waiting') },
    { value: 'confirmed', label: t('confirmed') },
    { value: 'completed', label: t('completed') },
    { value: 'in_progress', label: t('in.progress') },
    { value: 'no_show', label: t('no.show') },
    { value: 'canceled', label: t('cancelled') },
    { value: 'canceled_by_patient', label: t('canceled.by.patient') },
    { value: 'canceled_by_professional', label: t('canceled.by.professional') },
  ];

  return (
    <>
      <DialogHeader className="w-full">
        <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
          <DialogTitle className="truncate text-sky-blue tracking-wide md:text-2xl dark:text-primary-blue">Agendamento</DialogTitle>
          <div className="flex flex-row items-end gap-2">
            <div className="flex items-end gap-2">
              {isEditing && (
                <Button size={isMobile ? 'sm' : 'sm'} variant="default" onClick={handleStatusChange} disabled={isLoading}>
                  Salvar
                </Button>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">Status do agendamento</p>
                <Select
                  value={selectedStatus}
                  disabled={isLoading}
                  onValueChange={(value: string) => {
                    setSelectedStatus(value);
                    setIsEditing(true);
                  }}
                >
                  <SelectTrigger size="sm" className="w-full">
                    <div className="flex items-center gap-2">
                      <div className={cn('size-2 rounded-full', getStatusColor(selectedStatus))} />
                      <SelectValue className="text-xs">{statusDictionary(selectedStatus)}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} className="text-xs" disabled={isLoading} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={cn('size-2 rounded-full', getStatusColor(opt.value))} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {schedule.status === 'pending' && schedule.Patient && (
              <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={handleRequestScheduleConfirmation}>
                <Chat className="size-4 text-green-600" />
              </Button>
            )}
            <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={onEdit}>
              <Edit className="size-4 md:mr-2" />
              <span className="hidden md:block">Editar</span>
            </Button>
            {schedule.Financial && (
              <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={() => navigate({ to: '/financial/details/$id', params: { id: schedule.Financial! } })}>
                <Link className="size-4 md:mr-2" />
                <span className="hidden md:block">Finança</span>
              </Button>
            )}
          </div>
        </div>
      </DialogHeader>

      <div className="flex flex-col gap-4 md:gap-6 md:px-6">
        <p className="mt-2 font-medium text-muted-foreground text-sm md:mt-0">{!schedule.Patient ? 'Evento' : 'Atendimento'}</p>
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          {schedule.Patient ? (
            <div className="flex w-full flex-row items-start gap-6 rounded-lg p-0 md:max-w-md md:flex-col md:border md:p-6">
              <div className="flex w-full items-center gap-1 md:gap-4">
                <Avatar className="group relative flex items-center justify-center">
                  <AvatarImage src={patientImage} alt="img paciente" />
                  <AvatarFallback>{patientName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-muted-foreground text-sm">Paciente</p>
                    {schedule?.Patient && (
                      <Button type="button" variant="outline" size="sm" onClick={() => window.open(`/patient/${schedule?.Patient}`, '_blank')}>
                        <Link className="size-4 md:mr-2" />
                        <span className="hidden text-xs md:block">Paciente</span>
                      </Button>
                    )}
                  </div>
                  <p className="max-w-32 overflow-hidden truncate font-medium md:max-w-none">{patientName}</p>
                </div>
              </div>
              <div className="flex w-full items-center gap-1 md:gap-4">
                <Avatar className="group relative flex items-center justify-center">
                  <AvatarImage src={professionalImage} alt="img profissional" />
                  <AvatarFallback>{professionalName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex w-full items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">Profissional</p>
                    <p className="truncate font-medium">{professionalName}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-row items-start justify-between gap-4 rounded-lg border p-4 md:max-w-md md:flex-col md:p-6">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Descrição</p>
                <p className="truncate font-semibold text-md">{schedule.title}</p>
              </div>
            </div>
          )}

          {renderScheduleDateTime()}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          {schedule.Patient && (
            <Table className="w-full rounded-xl py-4 md:max-w-md md:border md:py-8">
              <TableHeader>
                <TableRow className="font-semibold leading-none">
                  <TableCell>Procedimento</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.financial?.procedures && schedule.financial.procedures.length > 0 ? (
                  schedule.financial.procedures.map((procedure, i) => (
                    <TableRow key={procedure.procedure + i}>
                      <TableCell>{procedure.procedure}</TableCell>
                      <TableCell className="tabular-nums">{currencyFormat(procedure.price)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{statusDictionary(procedure.status)}</Badge>
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
          )}
          {schedule.financial && schedule.financial._id !== null && !schedule.Patient && (
            <div className="flex h-fit flex-row flex-wrap justify-between gap-4 p-4 md:max-w-md md:flex-col md:p-8 md:px-4">
              <div className="w-1/4 space-y-1 md:w-full">
                <p className="text-muted-foreground text-sm">Total</p>
                <p className="font-semibold text-md tabular-nums">{currencyFormat(schedule.financial?.price || 0)}</p>
              </div>
              <div className="w-1/4 space-y-1 md:w-full">
                <p className="text-muted-foreground text-sm">Pago</p>
                <p className="font-semibold text-md tabular-nums">{currencyFormat(schedule.financial?.paid || 0)}</p>
              </div>
              <div className="w-1/4 space-y-1 md:w-full">
                <p className="text-muted-foreground text-sm">Status Pagamento</p>
                <p className="font-semibold text-md">{statusDictionary(schedule.financial?.status || '')}</p>
              </div>
              <div className="w-1/4 space-y-1 md:w-full">
                <p className="text-muted-foreground text-sm">Status Consulta</p>
                <p className="font-semibold text-md">{statusDictionary(schedule.status)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

type ScheduleRenderProps = {
  schedule: FullSchedule;
  event: PartialSchedule;
  onEdit: () => void;
  onClose: () => void;
};
