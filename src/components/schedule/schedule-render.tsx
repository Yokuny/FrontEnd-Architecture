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
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemActions, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

function SectionCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-xl border bg-card p-4 md:p-5', className)}>{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">{children}</span>;
}

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

  const renderDateTimeSection = () => {
    const startDate = new Date(schedule.start);
    const endDate = schedule.end ? new Date(schedule.end) : startDate;
    const isSameDay = formatDate(startDate, 'yyyy-MM-dd') === formatDate(endDate, 'yyyy-MM-dd');

    if (schedule.allDay) {
      const daysDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <FieldLabel>{t('date')}</FieldLabel>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(startDate, 'dd MMM yyyy')}</span>
              </div>
            </div>
            <Badge variant="outline" className="gap-1 rounded-full">
              <Calender className="size-3" />
              {t('all.day')}
            </Badge>
          </div>

          {!isSameDay && (
            <>
              <Separator />
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <FieldLabel>{t('date.end')}</FieldLabel>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(endDate, 'dd MMM yyyy')}</span>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1 rounded-full">
                  <Clock className="size-3" />
                  {daysDuration} {t('duration.days')}
                </Badge>
              </div>
            </>
          )}
        </div>
      );
    }

    if (isSameDay) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel>{t('day')}</FieldLabel>
            <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(schedule?.start, 'dd MMM yyyy')}</span>
          </div>

          <Separator />

          <div className="flex flex-col gap-1">
            <FieldLabel>{t('time.label')}</FieldLabel>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(schedule?.start, 'HH:mm')}</span>
              <Right className="size-4 text-muted-foreground" />
              <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(schedule?.end || event.end, 'HH:mm')}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <FieldLabel>{t('date.start')}</FieldLabel>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(schedule?.start, 'HH:mm')}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
              <Calender className="size-3.5" />
              {formatDate(schedule?.start, 'dd/MM')}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-1">
          <FieldLabel>{t('date.end')}</FieldLabel>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-xl tabular-nums tracking-tight">{formatDate(schedule?.end || event.end, 'HH:mm')}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
              <Calender className="size-3.5" />
              {formatDate(schedule?.end || event.end, 'dd/MM')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <DialogHeader className="w-full gap-4">
        <div className="flex w-full flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <DialogTitle className="truncate font-semibold text-sky-blue text-xl tracking-tight md:text-2xl dark:text-primary-blue">{t('dialog.appointment')}</DialogTitle>

          <ItemActions className="flex-wrap items-center justify-end gap-2">
            <Item className="flex-col items-start gap-1 p-0">
              <ItemDescription className="text-xs">{t('appointment.status')}</ItemDescription>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedStatus}
                  disabled={isLoading}
                  onValueChange={(value: string) => {
                    setSelectedStatus(value);
                    setIsEditing(true);
                  }}
                >
                  <SelectTrigger size="sm" className="h-8 w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className={cn('size-2 rounded-full', getStatusColor(selectedStatus))} />
                      <SelectValue className="text-xs">{translatedStatusLabel(selectedStatus)}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} className="text-xs" disabled={isLoading} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <span className={cn('size-2 rounded-full', getStatusColor(opt.value))} />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditing && (
                  <Button size="sm" variant="default" onClick={handleStatusChange} disabled={isLoading}>
                    {t('save')}
                  </Button>
                )}
              </div>
            </Item>

            <div className="flex items-center gap-2 self-end">
              {schedule.status === 'pending' && schedule.Patient && (
                <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={handleRequestScheduleConfirmation}>
                  <Chat className="size-4 text-green-600" />
                </Button>
              )}
              <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={onEdit}>
                <Edit className="size-4 md:mr-2" />
                <span className="hidden md:inline">{t('edit')}</span>
              </Button>
              {schedule.Financial && (
                <Button type="button" variant="outline" size={isMobile ? 'sm' : 'sm'} onClick={() => navigate({ to: '/financial/details', search: { id: schedule.Financial! } })}>
                  <Link className="size-4 md:mr-2" />
                  <span className="hidden md:inline">{t('finance.short')}</span>
                </Button>
              )}
            </div>
          </ItemActions>
        </div>
      </DialogHeader>

      <div className="flex flex-col gap-4 md:px-2">
        <div className="flex items-center justify-between">
          <ItemTitle className="font-medium text-muted-foreground text-sm">{!schedule.Patient ? t('event.kind') : t('appointment')}</ItemTitle>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr]">
          {schedule.Patient ? (
            <SectionCard className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="size-11 shrink-0">
                    <AvatarImage src={patientImage} alt={t('image.patient.alt')} />
                    <AvatarFallback>{patientName?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <FieldLabel>{t('patient')}</FieldLabel>
                    <ItemTitle className="truncate font-semibold text-base">{patientName}</ItemTitle>
                  </div>
                </div>

                {schedule?.Patient && (
                  <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => window.open(`/patient/${schedule?.Patient}`, '_blank')}>
                    <Link className="size-3.5 md:mr-2" />
                    <span className="hidden text-xs md:inline">{t('patient')}</span>
                  </Button>
                )}
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Avatar className="size-11 shrink-0">
                  <AvatarImage src={professionalImage} alt={t('image.professional.alt')} />
                  <AvatarFallback>{professionalName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <FieldLabel>{t('professional.label')}</FieldLabel>
                  <ItemTitle className="truncate font-semibold text-base">{professionalName}</ItemTitle>
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard className="flex flex-col gap-1">
              <FieldLabel>{t('description')}</FieldLabel>
              <ItemTitle className="truncate font-semibold text-base">{schedule.title}</ItemTitle>
            </SectionCard>
          )}

          <SectionCard>{renderDateTimeSection()}</SectionCard>
        </div>

        {schedule.Patient && (
          <SectionCard className="overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t('procedure')}</TableHead>
                  <TableHead>{t('price')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(schedule.financial?.procedures || []).length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={3} className="text-center text-muted-foreground text-sm">
                      {t('no.data')}
                    </TableCell>
                  </TableRow>
                ) : (
                  (schedule.financial?.procedures || []).map((proc, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: procedures list is static within the dialog
                    <TableRow key={index}>
                      <TableCell className="font-medium">{proc.procedure}</TableCell>
                      <TableCell className="tabular-nums">{currencyFormat(proc.price)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{translatedStatusLabel(String(proc.status))}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </SectionCard>
        )}

        {schedule.financial && schedule.financial._id !== null && !schedule.Patient && (
          <SectionCard>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <FieldLabel>{t('total')}</FieldLabel>
                <span className="font-semibold text-base tabular-nums">{currencyFormat(schedule.financial?.price || 0)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>{t('paid')}</FieldLabel>
                <span className="font-semibold text-base tabular-nums">{currencyFormat(schedule.financial?.paid || 0)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>{t('payment.status')}</FieldLabel>
                <span className="font-semibold text-base">{translatedStatusLabel(schedule.financial?.status || '')}</span>
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>{t('consultation.status')}</FieldLabel>
                <span className="font-semibold text-base">{translatedStatusLabel(schedule.status)}</span>
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </>
  );
}
