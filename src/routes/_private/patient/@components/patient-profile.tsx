import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import Cake from '@/components/icons/Cake.Icon';
import Chat from '@/components/icons/Chat.Icon';
import Check from '@/components/icons/Check.Icon';
import Clock from '@/components/icons/Clock.Icon';
import Copy from '@/components/icons/Copy.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Help from '@/components/icons/Help.Icon';
import ID from '@/components/icons/ID.Icon';
import Map from '@/components/icons/Map.Icon';
import TrendingUp from '@/components/icons/TrendingUp.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { t } from '@/config/translate';
import { calculateAge, capitalizeString, currencyFormat, formatCep, formatCpfCnpj, formatDate, formatPhone, formatRg, handleCopy } from '@/lib/helpers/formatter.helper';
import type { FullPatient } from '@/lib/interfaces';
import { cn } from '@/lib/utils/cn.util';

export const PatientProfile = ({ patient }: { patient: FullPatient }) => {
  const navigate = useNavigate();
  const [copiedPhones, setCopiedPhones] = useState<{ [key: number]: boolean }>({});

  const { total, totalPaid, totalPending, paidLast30Days, paidLast3Months, generatedLast30Days } = useMemo(() => {
    let total = 0,
      totalPaid = 0,
      totalPending = 0,
      paidLast30Days = 0,
      paidLast3Months = 0,
      generatedLast30Days = 0;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    patient.financials?.forEach((financial) => {
      const createdAt = new Date(financial.createdAt);
      total += financial.price;
      if (financial.status === 'paid') {
        totalPaid += financial.price;
        if (createdAt >= thirtyDaysAgo) paidLast30Days += financial.price;
        if (createdAt >= threeMonthsAgo) paidLast3Months += financial.price;
      } else {
        totalPending += financial.price;
      }
      if (createdAt >= thirtyDaysAgo) generatedLast30Days += financial.price;
    });

    return { total, totalPaid, totalPending, paidLast30Days, paidLast3Months, generatedLast30Days };
  }, [patient.financials]);

  const scheduleSummary = useMemo(() => {
    if (!patient.schedules || patient.schedules.length === 0) {
      return {
        nextSchedule: null,
        totalSchedules: 0,
        completedSchedules: 0,
        attendanceRate: 0,
        schedulesLast3Months: 0,
      };
    }
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const nextSchedule = patient.schedules
      .filter((s) => new Date(s.start) > now && s.status === 'pending')
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];

    const completedSchedules = patient.schedules.filter((s) => ['completed', 'confirmed'].includes(s.status)).length;
    const totalSchedules = patient.schedules.length;
    const schedulesLast3Months = patient.schedules.filter((s) => new Date(s.start) >= threeMonthsAgo).length;

    return {
      nextSchedule,
      totalSchedules,
      completedSchedules,
      attendanceRate: (completedSchedules / (totalSchedules || 1)) * 100,
      schedulesLast3Months,
    };
  }, [patient.schedules]);

  const handleCopyWithFeedback = async (text: string, type: 'email' | 'phone', index?: number) => {
    await handleCopy(text);
    if (type === 'phone' && index !== undefined) {
      setCopiedPhones((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => setCopiedPhones((prev) => ({ ...prev, [index]: false })), 2000);
    }
  };

  const openWhatsApp = (phoneNumber: string) => {
    const phone = phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/+55${phone}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex h-full w-full flex-col overflow-hidden">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <CardTitle className="text-xl">Informações Pessoais</CardTitle>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Help className="mr-2 size-5 cursor-pointer text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Última atualização: {patient.updatedAt ? formatDate(String(patient.updatedAt)) : ''}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="outline" size="sm" onClick={() => navigate({ to: '/patient/add', search: { id: patient._id } })}>
                  <Edit className="mr-2 size-4" />
                  Editar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {patient.phone?.map((phone, i) => (
                <div key={i} className="flex flex-col space-y-1">
                  <span className="font-semibold text-muted-foreground text-sm uppercase">{capitalizeString(phone.tag) || `Telefone ${i + 1}`}</span>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{formatPhone(phone.number)}</span>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="icon" className="size-7" onClick={() => handleCopyWithFeedback(phone.number, 'phone', i)}>
                        {copiedPhones[i] ? <Check className="size-3" /> : <Copy className="size-3" />}
                      </Button>
                      <Button variant="outline" size="icon" className="size-7 text-green-600" onClick={() => openWhatsApp(phone.number)}>
                        <Chat className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-muted-foreground text-sm uppercase">E-mail</span>
                <span className="truncate font-medium">{patient.email || 'Não informado'}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-muted-foreground text-sm uppercase">CPF</span>
                <div className="flex items-center gap-2">
                  <ID className="size-4 text-muted-foreground" />
                  <span className="font-medium">{formatCpfCnpj(patient.cpf) || 'Não informado'}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-muted-foreground text-sm uppercase">RG</span>
                <div className="flex items-center gap-2">
                  <ID className="size-4 text-muted-foreground" />
                  <span className="font-medium">{formatRg(patient.rg) || 'Não informado'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn('size-3 rounded-full', patient.sex === 'M' ? 'bg-blue-500' : 'bg-pink-500')} />
                <span className="font-medium">{patient.sex === 'M' ? 'Masculino' : 'Feminino'}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-muted-foreground text-sm uppercase">Nascimento</span>
                <div className="flex items-center gap-2">
                  <Cake className="size-4 text-muted-foreground" />
                  <span className="font-medium">{patient.birthdate ? `${formatDate(String(patient.birthdate))} (${calculateAge(patient.birthdate)} anos)` : 'Não informado'}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-muted-foreground text-sm uppercase">CEP</span>
                <span className="font-medium">{formatCep(patient.cep) || 'Não informado'}</span>
              </div>
              <div className="flex flex-col space-y-1 md:col-span-2">
                <span className="font-semibold text-muted-foreground text-sm uppercase">Endereço</span>
                <div className="flex items-center gap-2">
                  <Map className="size-4 text-muted-foreground" />
                  <span className="font-medium">{patient.address || 'Não informado'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <CardTitle className="text-xl">Agendamentos</CardTitle>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col rounded-md border bg-muted/20 p-4">
                  <span className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Próxima Consulta</span>
                  <span className="font-bold text-lg text-primary">{scheduleSummary.nextSchedule ? formatDate(String(scheduleSummary.nextSchedule.start)) : 'Nenhuma'}</span>
                  {scheduleSummary.nextSchedule && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-muted-foreground text-xs">
                      <Clock className="size-3" />
                      <span>{formatDate(String(scheduleSummary.nextSchedule.start))}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col rounded-md border bg-muted/20 p-4">
                  <span className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Total de Consultas</span>
                  <span className="font-bold text-xl">{scheduleSummary.totalSchedules}</span>
                  <span className="mt-1 text-muted-foreground text-xs">{scheduleSummary.schedulesLast3Months} nos últimos 3 meses</span>
                </div>
                <div className="flex flex-col rounded-md border bg-muted/20 p-4">
                  <span className="mb-2 font-semibold text-muted-foreground text-xs uppercase">Comparecimento</span>
                  <span className="font-bold text-xl">{scheduleSummary.attendanceRate.toFixed(0)}%</span>
                  <span className="mt-1 text-muted-foreground text-xs">{scheduleSummary.completedSchedules} concluídas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <CardTitle className="text-xl">Resumo Financeiro</CardTitle>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col rounded-md border bg-muted/20 p-4">
                  <span className="mb-2 font-semibold text-muted-foreground text-xs uppercase">{t('total.generated')}</span>
                  <span className="font-bold text-lg">{currencyFormat(total)}</span>
                  <span className="mt-1 flex items-center justify-center gap-1 text-muted-foreground text-xs">
                    <TrendingUp className="size-3" />
                    {currencyFormat(generatedLast30Days)} {t('this.month')}
                  </span>
                </div>
                <div className="flex flex-col rounded-md border bg-muted/20 p-4">
                  <span className="mb-2 font-semibold text-muted-foreground text-xs uppercase">{t('pending')}</span>
                  <span className="font-bold text-destructive text-lg">{currencyFormat(totalPending)}</span>
                  <span className="mt-1 text-muted-foreground text-xs">
                    {currencyFormat(totalPaid)} {t('paid')}
                  </span>
                </div>
                <div className="flex flex-col rounded-md border bg-muted/20 p-4">
                  <span className="mb-2 font-semibold text-muted-foreground text-xs uppercase">{t('last.payments')}</span>
                  <span className="font-bold text-lg text-primary">{currencyFormat(paidLast30Days)}</span>
                  <span className="mt-1 text-muted-foreground text-xs">
                    {currencyFormat(paidLast3Months)} {t('in.3.months')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
