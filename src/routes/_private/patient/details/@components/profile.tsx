import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import Add from '@/components/icons/Add.Icon';
import Cake from '@/components/icons/Cake.Icon';
import Calender from '@/components/icons/Calender.Icon';
import Check from '@/components/icons/Check.Icon';
import Clock from '@/components/icons/Clock.Icon';
import Copy from '@/components/icons/Copy.Icon';
import Dollar from '@/components/icons/Dollar.Icon';
import Down from '@/components/icons/Down.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Eye from '@/components/icons/Eye.Icon';
import Help from '@/components/icons/Help.Icon';
import ID from '@/components/icons/ID.Icon';
import IDCard from '@/components/icons/IDCard.Icon';
import Mail from '@/components/icons/Mail.Icon';
import MapIcon from '@/components/icons/Map.Icon';
import Phone from '@/components/icons/Phone.Icon';
import Point from '@/components/icons/Point.Icon';
import TrendingUp from '@/components/icons/TrendingUp.Icon';
import User from '@/components/icons/User.Icon';
import Whatsapp from '@/components/icons/Whatsapp.Icon';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { calculateAge, capitalizeString, currencyFormat, formatCep, formatCpfCnpj, formatPhone, formatRg, handleCopy } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { FullPatient } from '@/lib/interfaces';
import { cn } from '@/lib/utils/cn.util';

const PERSONAL_CATEGORIES = ['contact', 'documents', 'personal', 'address'];

export function PatientProfile({ patient }: { patient: FullPatient }) {
  const navigate = useNavigate();
  const [copiedPhones, setCopiedPhones] = useState<{ [key: number]: boolean }>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openCategories, setOpenCategories] = useState<string[]>(PERSONAL_CATEGORIES);

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
      return { nextSchedule: null, totalSchedules: 0, completedSchedules: 0, attendanceRate: 0, schedulesLast3Months: 0 };
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

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const expandAll = () => setOpenCategories(PERSONAL_CATEGORIES);
  const collapseAll = () => setOpenCategories([]);

  const handleCopyWithFeedback = async (text: string, type: 'email' | 'phone', index?: number) => {
    await handleCopy(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else if (type === 'phone' && index !== undefined) {
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
      <div className="flex flex-col gap-6">
        {/* Informações Pessoais — specs-table style */}
        <div className="flex flex-col gap-4">
          <ItemHeader>
            <div className="flex items-center gap-2">
              <ItemTitle className="text-xl">{t('personal.information')}</ItemTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Help className="size-4 cursor-pointer text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('last.updated')} {patient.updatedAt ? formatDate(String(patient.updatedAt)) : '-'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="primary" size="sm" onClick={expandAll} className="text-muted-foreground text-xs hover:text-foreground">
                {t('expand')}
              </Button>
              <Separator orientation="vertical" className="h-4 self-center" />
              <Button variant="primary" size="sm" onClick={collapseAll} className="text-muted-foreground text-xs hover:text-foreground">
                {t('collapse')}
              </Button>
              <Separator orientation="vertical" className="h-4 self-center" />
              <Button size="sm" onClick={() => navigate({ to: '/patient/add', search: { id: patient._id } })}>
                <Edit className="mr-1.5 size-4" />
                {t('edit')}
              </Button>
            </div>
          </ItemHeader>

          <div className="overflow-hidden rounded-lg border bg-card">
            {/* Contato */}
            <Collapsible open={openCategories.includes('contact')} onOpenChange={() => toggleCategory('contact')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="primary"
                  className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
                >
                  <div className="flex items-center gap-3">
                    <ItemMedia variant="icon" className="text-foreground">
                      <Phone className="size-4" />
                    </ItemMedia>
                    <ItemTitle className="text-base">{t('contact')}</ItemTitle>
                  </div>
                  <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('contact') && 'rotate-180')} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ItemGroup className="gap-0">
                  {patient.phone?.map((phone, i) => (
                    <div key={phone.number}>
                      <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                        <ItemContent>
                          <ItemDescription className="font-sans">{capitalizeString(phone.tag) || `${t('phone')} ${i + 1}`}</ItemDescription>
                          <ItemTitle className="font-mono tabular-nums">{formatPhone(phone.number)}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <Button size="icon" className="size-7" onClick={() => handleCopyWithFeedback(phone.number, 'phone', i)}>
                            {copiedPhones[i] ? <Check className="size-3" /> : <Copy className="size-3" />}
                          </Button>
                          <Button size="icon" className="size-7 text-green-600" onClick={() => openWhatsApp(phone.number)}>
                            <Whatsapp className="size-3" />
                          </Button>
                        </ItemActions>
                      </Item>
                      <ItemSeparator />
                    </div>
                  ))}
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemContent>
                      <ItemDescription className="flex items-center gap-1.5 font-sans">
                        <Mail className="size-3.5" />
                        {t('email')}
                      </ItemDescription>
                      <ItemTitle className="font-mono tabular-nums">{patient.email || t('not.informed')}</ItemTitle>
                    </ItemContent>
                    {patient.email && (
                      <ItemActions>
                        <Button size="icon" className="size-7" onClick={() => handleCopyWithFeedback(patient.email ?? '', 'email')}>
                          {copiedEmail ? <Check className="size-3" /> : <Copy className="size-3" />}
                        </Button>
                      </ItemActions>
                    )}
                  </Item>
                </ItemGroup>
              </CollapsibleContent>
            </Collapsible>

            {/* Documentos */}
            <Collapsible open={openCategories.includes('documents')} onOpenChange={() => toggleCategory('documents')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="primary"
                  className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
                >
                  <div className="flex items-center gap-3">
                    <ItemMedia variant="icon" className="text-foreground">
                      <IDCard className="size-4" />
                    </ItemMedia>
                    <ItemTitle className="text-base">{t('documents')}</ItemTitle>
                  </div>
                  <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('documents') && 'rotate-180')} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ItemGroup className="gap-0">
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemDescription className="flex items-center gap-1.5 font-sans">
                      <IDCard className="size-3.5" />
                      {t('cpf')}
                    </ItemDescription>
                    <ItemTitle className="font-mono tabular-nums">{formatCpfCnpj(patient.cpf) || t('not.informed')}</ItemTitle>
                  </Item>
                  <ItemSeparator />
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemDescription className="flex items-center gap-1.5 font-sans">
                      <ID className="size-3.5" />
                      {t('rg')}
                    </ItemDescription>
                    <ItemTitle className="font-mono tabular-nums">{formatRg(patient.rg) || t('not.informed')}</ItemTitle>
                  </Item>
                </ItemGroup>
              </CollapsibleContent>
            </Collapsible>

            {/* Dados Pessoais */}
            <Collapsible open={openCategories.includes('personal')} onOpenChange={() => toggleCategory('personal')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="primary"
                  className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
                >
                  <div className="flex items-center gap-3">
                    <ItemMedia variant="icon" className="text-foreground">
                      <User className="size-4" />
                    </ItemMedia>
                    <ItemTitle className="text-base">{t('personal.data')}</ItemTitle>
                  </div>
                  <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('personal') && 'rotate-180')} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ItemGroup className="gap-0">
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemDescription className="font-sans">{t('sex')}</ItemDescription>
                    <ItemTitle className="font-mono tabular-nums">
                      <div className={cn('size-2.5 rounded-full', patient.sex === 'M' ? 'bg-blue-500' : 'bg-pink-500')} />
                      {patient.sex === 'M' ? t('male') : t('female')}
                    </ItemTitle>
                  </Item>
                  <ItemSeparator />
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemDescription className="flex items-center gap-1.5 font-sans">
                      <Cake className="size-3.5" />
                      {t('birth.date')}
                    </ItemDescription>
                    <ItemTitle className="font-mono tabular-nums">
                      {patient.birthdate ? `${formatDate(String(patient.birthdate))} (${calculateAge(patient.birthdate)} ${t('years.old')})` : t('not.informed')}
                    </ItemTitle>
                  </Item>
                </ItemGroup>
              </CollapsibleContent>
            </Collapsible>

            {/* Endereço */}
            <Collapsible open={openCategories.includes('address')} onOpenChange={() => toggleCategory('address')}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="primary"
                  className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
                >
                  <div className="flex items-center gap-3">
                    <ItemMedia variant="icon" className="text-foreground">
                      <MapIcon className="size-4" />
                    </ItemMedia>
                    <ItemTitle className="text-base">{t('address')}</ItemTitle>
                  </div>
                  <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('address') && 'rotate-180')} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ItemGroup className="gap-0">
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemDescription className="flex items-center gap-1.5 font-sans">
                      <Point className="size-3.5" />
                      {t('cep')}
                    </ItemDescription>
                    <ItemTitle className="font-mono tabular-nums">{formatCep(patient.cep) || t('not.informed')}</ItemTitle>
                  </Item>
                  <ItemSeparator />
                  <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                    <ItemDescription className="flex items-center gap-1.5 font-sans">
                      <MapIcon className="size-3.5" />
                      {t('address')}
                    </ItemDescription>
                    <ItemTitle className="font-mono tabular-nums">{patient.address || t('not.informed')}</ItemTitle>
                  </Item>
                </ItemGroup>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Coluna direita: Agendamentos + Resumo Financeiro */}
        <div className="flex flex-col gap-6">
          {/* Agendamentos */}
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="flex w-full items-center justify-between bg-secondary px-4 py-2.5">
              <div className="flex items-center gap-3">
                <ItemMedia variant="icon" className="text-foreground">
                  <Calender className="size-4" />
                </ItemMedia>
                <ItemTitle className="text-base">{t('schedule')}</ItemTitle>
              </div>
              <ItemActions>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Help className="size-4 cursor-pointer text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('last.updated')} {patient.schedules?.[0] ? formatDate(String(patient.schedules[0].updatedAt)) : 'N/A'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button size="sm" className="gap-1.5" onClick={() => navigate({ to: '/patient/details/schedule-add', search: { id: patient._id } })}>
                  <Add className="size-4" />
                  <span className="hidden md:inline">{t('book.appointment')}</span>
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => navigate({ to: '/patient/details', search: { id: patient._id, tab: 'schedule' } })}>
                  <Eye className="size-4" />
                  <span className="hidden md:inline">{t('see.more')}</span>
                </Button>
              </ItemActions>
            </div>
            <ItemGroup className="gap-0">
              <Item className="grid grid-cols-1 rounded-none border-t border-t-border py-6 md:grid-cols-3">
                <ItemContent className="px-4 md:border-r md:px-6">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('next.appointment.title')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{scheduleSummary.nextSchedule ? formatDate(String(scheduleSummary.nextSchedule.start)) : t('none.f')}</ItemTitle>
                  {scheduleSummary.nextSchedule && (
                    <ItemDescription className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDate(scheduleSummary.nextSchedule.start, 'HH:mm')} {t('hour.suffix')}
                    </ItemDescription>
                  )}
                </ItemContent>
                <ItemContent className="px-4 md:border-r md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('total.appointments')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{scheduleSummary.totalSchedules}</ItemTitle>
                  <ItemDescription>
                    {scheduleSummary.schedulesLast3Months} {t('last.3.months.suffix')}
                  </ItemDescription>
                </ItemContent>
                <ItemContent className="px-4 md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('attendance')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{scheduleSummary.attendanceRate.toFixed(0)}%</ItemTitle>
                  <ItemDescription>
                    {scheduleSummary.completedSchedules} {t('completeds')}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>

          {/* Resumo Financeiro */}
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="flex w-full items-center justify-between bg-secondary px-4 py-2.5">
              <div className="flex items-center gap-3">
                <ItemMedia variant="icon" className="text-foreground">
                  <Dollar className="size-4" />
                </ItemMedia>
                <ItemTitle className="text-base">{t('financial.summary')}</ItemTitle>
              </div>
              <ItemActions>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Help className="size-4 cursor-pointer text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('last.updated')} {patient.financials?.[0] ? formatDate(String(patient.financials[0].updatedAt)) : 'N/A'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button size="sm" className="gap-1.5" onClick={() => navigate({ to: '/patient/details/financial-add', search: { id: patient._id } })}>
                  <Add className="size-4" />
                  <span className="hidden md:inline">{t('add')}</span>
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => navigate({ to: '/patient/details', search: { id: patient._id, tab: 'financial' } })}>
                  <Eye className="size-4" />
                  <span className="hidden md:inline">{t('see.more')}</span>
                </Button>
              </ItemActions>
            </div>
            <ItemGroup className="gap-0">
              <Item className="grid grid-cols-1 rounded-none border-t border-t-border py-6 md:grid-cols-3">
                <ItemContent className="px-4 md:border-r md:px-6">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('total.generated')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{currencyFormat(total)}</ItemTitle>
                  <ItemDescription className="flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    {currencyFormat(generatedLast30Days)} {t('this.month')}
                  </ItemDescription>
                </ItemContent>
                <ItemContent className="px-4 md:border-r md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('pending')}</ItemDescription>
                  <ItemTitle className="text-2xl text-destructive leading-none">{currencyFormat(totalPending)}</ItemTitle>
                  <ItemDescription>
                    {currencyFormat(totalPaid)} {t('paid')}
                  </ItemDescription>
                </ItemContent>
                <ItemContent className="px-4 md:px-8">
                  <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('last.payments')}</ItemDescription>
                  <ItemTitle className="text-2xl leading-none">{currencyFormat(paidLast30Days)}</ItemTitle>
                  <ItemDescription>
                    {currencyFormat(paidLast3Months)} {t('in.3.months')}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
