import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import Calender from '@/components/icons/Calender.Icon';
import Chat from '@/components/icons/Chat.Icon';
import Clock from '@/components/icons/Clock.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Link from '@/components/icons/Link.Icon';
import Right from '@/components/icons/Right.Icon';
import { translatedStatusLabel } from '@/components/schedule/status-label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePatientStore } from '@/hooks/patients';
import { useProfessionalStore } from '@/hooks/professionals';
import { useIsMobile } from '@/hooks/use-mobile';
import { PATCH, POST, request } from '@/lib/api/client.api';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, getStatusColor } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { FullSchedule, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';

export type ScheduleRenderProps = {
  schedule: FullSchedule;
  event: PartialSchedule;
  onEdit: () => void;
  onClose: () => void;
};

export function ScheduleRender({ schedule, event, onEdit }: ScheduleRenderProps) {
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

  const statusOptions = [
    { value: 'pending', label: t('pending') },
    { value: 'confirmed', label: t('confirmed') },
    { value: 'completed', label: t('completed') },
    { value: 'canceled', label: t('cancelled') },
    { value: 'noshow', label: t('no.show') },
  ];

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
    const isSameDay = formatDate(startDate, 'yyyy-MM-dd') === formatDate(endDate, 'yyyy-MM-dd');

    if (schedule.allDay) {
      const daysDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return (
        <Item className="flex-row items-center justify-between gap-4 md:flex-col">
          <ItemContent className="w-full space-y-2 p-4 md:px-6">
            <ItemActions className="w-full items-center justify-between gap-2">
              <ItemDescription>{t('date')}</ItemDescription>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Calender className="hidden size-4 md:block" />
                <ItemTitle className="text-muted-foreground tabular-nums tracking-tight">{t('all.day')}</ItemTitle>
              </Button>
            </ItemActions>
            <ItemActions className="w-full items-center justify-between space-y-0">
              <ItemTitle className="text-md tabular-nums md:text-xl">{formatDate(startDate, 'dd - MMM')}</ItemTitle>
              <ItemDescription className="tracking-tight">{formatDate(startDate, 'EEEEEE')}</ItemDescription>
            </ItemActions>
          </ItemContent>

          {!isSameDay && (
            <ItemContent className="w-full space-y-2 p-4 md:px-6">
              <ItemActions className="w-full items-center justify-between gap-2">
                <ItemDescription>{t('date.end')}</ItemDescription>
                <Button variant="outline" size="sm" className="gap-1 px-2 text-xs">
                  <Clock className="hidden size-4 md:block" />
                  <ItemTitle className="text-muted-foreground tabular-nums tracking-tight">
                    {daysDuration} {t('duration.days')}
                  </ItemTitle>
                </Button>
              </ItemActions>
              <ItemActions className="w-full items-center justify-between space-y-0">
                <ItemTitle className="text-md tabular-nums md:text-xl">{formatDate(endDate, 'dd - MMM')}</ItemTitle>
                <ItemDescription className="tracking-tight">{formatDate(endDate, 'EEEEEE')}</ItemDescription>
              </ItemActions>
            </ItemContent>
          )}
        </Item>
      );
    }

    if (isSameDay) {
      return (
        <Item className="flex-row items-center justify-between gap-4 md:flex-col">
          <Item className="w-full flex-col items-start gap-2 rounded-lg p-2 md:border md:p-4">
            <ItemDescription>{t('day')}</ItemDescription>
            <ItemTitle className="tabular-nums md:text-xl">{formatDate(schedule?.start)}</ItemTitle>
          </Item>
          <Item className="w-full flex-col items-start gap-2 rounded-lg p-2 md:border md:p-4">
            <ItemDescription>{t('time.label')}</ItemDescription>
            <ItemActions className="items-center gap-2">
              <ItemTitle className="text-md tabular-nums md:text-xl">{formatDate(schedule?.start, 'HH:mm')}</ItemTitle>
              <Right className="size-4" />
              <ItemTitle className="text-md tabular-nums md:text-xl">{formatDate(schedule?.end || event.end, 'HH:mm')}</ItemTitle>
            </ItemActions>
          </Item>
        </Item>
      );
    }

    return (
      <Item className="flex-row items-center justify-between gap-4 md:flex-col">
        <Item className="w-full flex-col items-start gap-2 rounded-lg p-2 md:border md:p-4">
          <ItemDescription>{t('date.start')}</ItemDescription>
          <ItemActions className="items-baseline gap-3">
            <ItemTitle className="tabular-nums md:text-xl">{formatDate(schedule?.start, 'HH:mm')}</ItemTitle>
            <ItemActions className="items-start gap-1">
              <Calender className="size-4" />
              <ItemDescription className="md:text-lg">{formatDate(schedule?.start, 'dd/MM')}</ItemDescription>
            </ItemActions>
          </ItemActions>
        </Item>
        <Item className="w-full flex-col items-start gap-2 rounded-lg p-2 md:border md:p-4">
          <ItemDescription>{t('date.end')}</ItemDescription>
          <ItemActions className="items-baseline gap-3">
            <ItemTitle className="tabular-nums md:text-xl">{formatDate(schedule?.end || event.end, 'HH:mm')}</ItemTitle>
            <ItemActions className="items-start gap-1">
              <Calender className="size-4" />
              <ItemDescription className="md:text-lg">{formatDate(schedule?.end || event.end, 'dd/MM')}</ItemDescription>
            </ItemActions>
          </ItemActions>
        </Item>
      </Item>
    );
  };

  return (
    <>
      <DialogHeader className="w-full">
        <Item className="w-full flex-col items-start justify-between gap-2 md:flex-row">
          <DialogTitle className="truncate text-sky-blue tracking-wide md:text-2xl dark:text-primary-blue">{t('dialog.appointment')}</DialogTitle>
          <ItemActions className="items-end gap-2">
            <ItemActions className="items-end gap-2">
              {isEditing && (
                <Button size={isMobile ? 'sm' : 'sm'} variant="default" onClick={handleStatusChange} disabled={isLoading}>
                  {t('save')}
                </Button>
              )}
              <Item className="flex-col gap-2">
                <ItemDescription>{t('appointment.status')}</ItemDescription>
                <Select
                  value={selectedStatus}
                  disabled={isLoading}
                  onValueChange={(value: string) => {
                    setSelectedStatus(value);
                    setIsEditing(true);
                  }}
                >
                  <SelectTrigger size="sm" className="w-full">
                    <ItemActions className="items-center gap-2">
                      <div className={cn('size-2 rounded-full', getStatusColor(selectedStatus))} />
                      <SelectValue className="text-xs">{translatedStatusLabel(selectedStatus)}</SelectValue>
                    </ItemActions>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} className="text-xs" disabled={isLoading} value={opt.value}>
                        <ItemActions className="items-center gap-2">
                          <div className={cn('size-2 rounded-full', getStatusColor(opt.value))} />
                          {opt.label}
                        </ItemActions>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Item>
            </ItemActions>
            {schedule.status === 'pending' && schedule.Patient && (
              <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={handleRequestScheduleConfirmation}>
                <Chat className="size-4 text-green-600" />
              </Button>
            )}
            <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={onEdit}>
              <Edit className="size-4 md:mr-2" />
              <ItemTitle className="hidden md:block">{t('edit')}</ItemTitle>
            </Button>
            {schedule.Financial && (
              <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={() => navigate({ to: '/financial/details', search: { id: schedule.Financial! } })}>
                <Link className="size-4 md:mr-2" />
                <ItemTitle className="hidden md:block">{t('finance.short')}</ItemTitle>
              </Button>
            )}
          </ItemActions>
        </Item>
      </DialogHeader>

      <Item className="flex-col gap-4 md:gap-6 md:px-6">
        <ItemTitle className="mt-2 font-medium text-muted-foreground text-sm md:mt-0">{!schedule.Patient ? t('event.kind') : t('appointment')}</ItemTitle>
        <ItemActions className="flex-col gap-4 md:flex-row md:gap-6">
          {schedule.Patient ? (
            <Item className="w-full flex-row items-start gap-6 rounded-lg p-0 md:max-w-md md:flex-col md:border md:p-6">
              <ItemActions className="w-full items-center gap-1 md:gap-4">
                <Avatar className="group relative flex items-center justify-center">
                  <AvatarImage src={patientImage} alt={t('image.patient.alt')} />
                  <AvatarFallback>{patientName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <Item className="w-full">
                  <ItemActions className="w-full items-center justify-between">
                    <ItemDescription>{t('patient')}</ItemDescription>
                    {schedule?.Patient && (
                      <Button type="button" variant="outline" size="sm" onClick={() => window.open(`/patient/${schedule?.Patient}`, '_blank')}>
                        <Link className="size-4 md:mr-2" />
                        <ItemTitle className="hidden text-xs md:block">{t('patient')}</ItemTitle>
                      </Button>
                    )}
                  </ItemActions>
                  <ItemTitle className="max-w-32 overflow-hidden truncate font-medium md:max-w-none">{patientName}</ItemTitle>
                </Item>
              </ItemActions>
              <ItemActions className="w-full items-center gap-1 md:gap-4">
                <Avatar className="group relative flex items-center justify-center">
                  <AvatarImage src={professionalImage} alt={t('image.professional.alt')} />
                  <AvatarFallback>{professionalName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <ItemActions className="w-full items-center justify-between">
                  <Item className="space-y-1">
                    <ItemDescription>{t('professional.label')}</ItemDescription>
                    <ItemTitle className="truncate font-medium">{professionalName}</ItemTitle>
                  </Item>
                </ItemActions>
              </ItemActions>
            </Item>
          ) : (
            <Item className="w-full flex-row items-start justify-between gap-4 rounded-lg border p-4 md:max-w-md md:flex-col md:p-6">
              <Item className="space-y-1">
                <ItemDescription>{t('description')}</ItemDescription>
                <ItemTitle className="truncate font-semibold text-md">{schedule.title}</ItemTitle>
              </Item>
            </Item>
          )}

          {renderScheduleDateTime()}
        </ItemActions>

        <ItemActions className="flex-col gap-4 md:flex-row md:gap-6">
          {schedule.Patient && (
            <DataTable
              className="w-full rounded-xl py-4 md:max-w-md md:border md:py-8"
              data={schedule.financial?.procedures || []}
              columns={[
                { key: 'procedure', header: t('procedure') },
                { key: 'price', header: t('price'), render: (v) => <ItemTitle className="tabular-nums">{currencyFormat(v)}</ItemTitle> },
                { key: 'status', header: t('status'), render: (v) => <Badge variant="outline">{translatedStatusLabel(String(v))}</Badge> },
              ]}
              searchable={false}
              showPagination={false}
              compact
              bordered={false}
            />
          )}
          {schedule.financial && schedule.financial._id !== null && !schedule.Patient && (
            <Item className="h-fit flex-row flex-wrap justify-between gap-4 p-4 md:max-w-md md:flex-col md:p-8 md:px-4">
              <Item className="w-1/4 space-y-1 md:w-full">
                <ItemDescription>{t('total')}</ItemDescription>
                <ItemTitle className="font-semibold text-md tabular-nums">{currencyFormat(schedule.financial?.price || 0)}</ItemTitle>
              </Item>
              <Item className="w-1/4 space-y-1 md:w-full">
                <ItemDescription>{t('paid')}</ItemDescription>
                <ItemTitle className="font-semibold text-md tabular-nums">{currencyFormat(schedule.financial?.paid || 0)}</ItemTitle>
              </Item>
              <Item className="w-1/4 space-y-1 md:w-full">
                <ItemDescription>{t('payment.status')}</ItemDescription>
                <ItemTitle className="font-semibold text-md">{translatedStatusLabel(schedule.financial?.status || '')}</ItemTitle>
              </Item>
              <Item className="w-1/4 space-y-1 md:w-full">
                <ItemDescription>{t('consultation.status')}</ItemDescription>
                <ItemTitle className="font-semibold text-md">{translatedStatusLabel(schedule.status)}</ItemTitle>
              </Item>
            </Item>
          )}
        </ItemActions>
      </Item>
    </>
  );
}
