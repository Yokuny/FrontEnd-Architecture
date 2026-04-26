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
import Edit from '@/components/icons/Edit.Icon';
import Save from '@/components/icons/Save.Icon';
import IconService from '@/components/icons/Service.Icon';
import TrendingUp from '@/components/icons/TrendingUp.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PATCH, request } from '@/lib/api/client.api';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { FullPatient } from '@/lib/interfaces';
import type { DbFinancial } from '@/lib/interfaces/financial.interface';
import type { ProfessionalList } from '@/lib/interfaces/professional.interface';
import { cn } from '@/lib/utils/cn.util';
import { usePatientQuery } from '@/query/patient';
import { getProfessionalImage, getProfessionalName, useProfessionalsQuery } from '@/query/professionals';

const FinancialSummaryContent = ({ patient }: { patient: FullPatient }) => {
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
    <ItemGroup className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline" className="flex-col items-start bg-secondary">
        <div className="flex w-full items-center justify-between">
          <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">{t('total')}</ItemTitle>
          <div className="flex items-baseline gap-1 text-muted-foreground">
            <TrendingUp className="size-3" />
            <ItemDescription className="tabular-nums leading-none">
              {currencyFormat(summary.totalLastMonth)} {t('this.month.calendar')}
            </ItemDescription>
          </div>
        </div>
        <ItemContent className="w-full text-center">
          <p className="font-bold text-sky-400 text-xl dark:text-sky-400">{currencyFormat(summary.totalAmount)}</p>
          <ItemDescription>
            {currencyFormat(summary.totalLast3Months)} {t('last.3.months.suffix')}
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col items-start bg-secondary">
        <div className="flex w-full items-center justify-between">
          <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">{t('total.paid')}</ItemTitle>
          <ItemDescription className="tabular-nums leading-none">
            {currencyFormat(summary.paidLast30Days)} {t('this.month.calendar')}
          </ItemDescription>
        </div>
        <ItemContent className="w-full text-center">
          <p className="font-bold text-teal-400 text-xl dark:text-teal-400">{currencyFormat(summary.totalPaid)}</p>
          <ItemDescription>
            {currencyFormat(summary.totalLast2Months)} {t('last.2.months.suffix')}
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col items-start bg-secondary">
        <div className="flex w-full items-center justify-between">
          <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">{t('total.pending')}</ItemTitle>
          <div className="flex items-baseline gap-1 text-muted-foreground">
            <ChartPie className="size-3" />
            <ItemDescription className="tabular-nums leading-none">
              {summary.paidProcedures} {t('of')} {summary.procedureCount} {t('paids')}
            </ItemDescription>
          </div>
        </div>
        <ItemContent className="w-full text-center">
          <p className="font-bold text-lime-500 text-xl dark:text-lime-400">{currencyFormat(summary.totalPending)}</p>
          <ItemDescription>
            {t('last.payment.on')} {summary.lastPaymentDate ? formatDate(String(summary.lastPaymentDate)) : 'N/A'}
          </ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col items-start bg-secondary">
        <div className="flex w-full items-center justify-between">
          <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">{t('procedures')}</ItemTitle>
          <div className="flex items-baseline gap-1 text-muted-foreground">
            <Board className="size-3" />
            <ItemDescription className="tabular-nums leading-none">
              {summary.procedureCount} {t('procedures.lower')}
            </ItemDescription>
          </div>
        </div>
        <ItemContent className="w-full text-center">
          <p className="font-bold text-amber-400 text-xl dark:text-amber-400">
            {summary.proceduresLastMonth} {t('last.month.procedures')}
          </p>
          <ItemDescription>
            {t('added')} {summary.recentProcedures} {t('in.two.months')}
          </ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
};

const FinancialRecordDetail = ({
  el,
  professionals,
  isLoading,
  handleStatusChange,
  isEditing,
  setIsEditing,
  setSelectedStatus,
  selectedStatus,
}: {
  el: DbFinancial;
  professionals: ProfessionalList[] | undefined;
  isLoading: boolean;
  handleStatusChange: (id: string, status: string) => void;
  isEditing: string | null;
  setIsEditing: (id: string | null) => void;
  setSelectedStatus: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedStatus: Record<string, string>;
}) => {
  const navigate = useNavigate();
  const getProfessionalNameById = (id?: string) => getProfessionalName(professionals, id);
  const getProfessionalImageById = (id?: string) => getProfessionalImage(professionals, id);

  const [openCategories, setOpenCategories] = useState<string[]>(['general', 'procedures', 'financial']);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <CollapsibleContent className="my-4 px-2">
      <div className="space-y-6">
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-sm">{t('payment.status.label')}</span>
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
                  {t('pending')}
                </SelectItem>
                <SelectItem value="partial" disabled={isLoading}>
                  {t('partial')}
                </SelectItem>
                <SelectItem value="paid" disabled={isLoading}>
                  {t('paid')}
                </SelectItem>
                <SelectItem value="refund" disabled={isLoading}>
                  {t('refunded')}
                </SelectItem>
                <SelectItem value="canceled" disabled={isLoading}>
                  {t('cancelled')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isEditing === el._id && (
            <Button onClick={() => handleStatusChange(el._id, selectedStatus[el._id] ?? el.status)} disabled={isLoading}>
              <Save className="size-4" />
              <span className="sr-only md:not-sr-only">{t('save')}</span>
            </Button>
          )}
          <Button onClick={() => navigate({ to: '/financial/details', search: { id: el._id } })}>
            <Edit className="size-4" />
            {t('edit')}
          </Button>
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
                  <ItemTitle className="text-base">{t('general.data')}</ItemTitle>
                </div>
                <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('general') && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ItemGroup className="gap-0">
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-md">
                      <AvatarImage src={getProfessionalImageById(el.Professional)} />
                      <AvatarFallback>{getProfessionalNameById(el.Professional).slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <ItemDescription className="font-sans">{t('professional')}</ItemDescription>
                  </div>
                  <ItemTitle className="font-mono">{getProfessionalNameById(el.Professional)}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('created.at')}</ItemDescription>
                  <ItemTitle className="font-mono">{formatDate(String(el.createdAt))}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('time')}</ItemDescription>
                  <ItemTitle className="font-mono">{formatDate(el.createdAt, 'HH:mm')}</ItemTitle>
                </Item>
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
                  <ItemTitle className="text-base">{t('procedures')}</ItemTitle>
                </div>
                <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('procedures') && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ItemGroup className="gap-0">
                {el.procedures?.length > 0 ? (
                  el.procedures.map((procedure, index) => (
                    <div key={procedure._id ?? procedure.procedure}>
                      <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                        <ItemDescription className="font-sans">{procedure.procedure}</ItemDescription>
                        <ItemTitle className="font-mono">{currencyFormat(procedure.price)}</ItemTitle>
                      </Item>
                      {index < el.procedures.length - 1 && <ItemSeparator />}
                    </div>
                  ))
                ) : (
                  <Item variant="default" size="sm" className="justify-center py-4">
                    <ItemDescription className="italic">{t('no.procedures.registered')}</ItemDescription>
                  </Item>
                )}
              </ItemGroup>
            </CollapsibleContent>
          </Collapsible>

          {/* Financeiro */}
          <Collapsible open={openCategories.includes('financial')} onOpenChange={() => toggleCategory('financial')}>
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
              >
                <div className="flex items-center gap-3">
                  <ItemMedia variant="icon" className="text-foreground">
                    <IconDollar className="size-4" />
                  </ItemMedia>
                  <ItemTitle className="text-base">{t('financial')}</ItemTitle>
                </div>
                <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('financial') && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ItemGroup className="gap-0">
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('payment')}</ItemDescription>
                  <ItemTitle className="font-mono">{statusDictionary(el.status)}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('amount.paid')}</ItemDescription>
                  <ItemTitle className="font-mono">{currencyFormat(el.paid || 0)}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('payment.method')}</ItemDescription>
                  <ItemTitle className="font-mono">{financialPaymentMethod(el.paymentMethod || 'none')}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('installments')}</ItemDescription>
                  <ItemTitle className="font-mono">{el.installments || 1}</ItemTitle>
                </Item>
                <ItemSeparator />
                <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                  <ItemDescription className="font-sans">{t('total')}</ItemDescription>
                  <ItemTitle className="font-mono">{currencyFormat(el.price || 0)}</ItemTitle>
                </Item>
              </ItemGroup>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </CollapsibleContent>
  );
};

const FinancialHistorySection = ({ financials, patientId }: { financials: DbFinancial[]; patientId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const { data: professionals } = useProfessionalsQuery();
  const { refetch } = usePatientQuery(patientId);

  const sortedFinancials = useMemo(() => [...financials].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [financials]);

  const handleStatusChange = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      const res = await request(`financial/${id}/status`, PATCH({ status }));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('error.update.status'));
    } finally {
      setIsLoading(false);
      setIsEditing(null);
    }
  };

  return (
    <Item>
      <ItemContent className="w-full gap-0">
        <div className="flex h-12 items-center border-b px-2 text-left text-foreground/80 text-sm">
          <div className="flex-1 font-semibold">{t('payment.status.column')}</div>
          <div className="flex-1 font-semibold">{t('creation.date')}</div>
          <div className="w-32 text-right font-semibold">{t('amount')}</div>
          <div className="w-8" />
        </div>
        {sortedFinancials.map((el) => (
          <Collapsible key={el._id} className="w-full border-b">
            <CollapsibleTrigger className="group w-full transition-colors hover:bg-secondary">
              <div className="flex h-16 items-center px-2 text-left text-foreground/60 text-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BadgeIndicator variant={el.status} pulse />
                    <ItemTitle className="text-lg">{statusDictionary(el.status)}</ItemTitle>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="tabular-nums">{formatDate(String(el.createdAt))}</p>
                </div>
                <div className="w-32 text-right font-medium text-foreground tabular-nums">{currencyFormat(el.price || 0)}</div>
                <div className="ml-4 flex items-center justify-end">
                  <Down className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </div>
              </div>
            </CollapsibleTrigger>
            <FinancialRecordDetail
              el={el}
              professionals={professionals}
              isLoading={isLoading}
              handleStatusChange={handleStatusChange}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              setSelectedStatus={setSelectedStatus}
              selectedStatus={selectedStatus}
            />
          </Collapsible>
        ))}
      </ItemContent>
    </Item>
  );
};

export const PatientFinancialView = ({ patient }: { patient: FullPatient }) => {
  const navigate = useNavigate();
  const hasFinancials = patient.financials && patient.financials.length > 0;

  return (
    <ItemGroup>
      <Item>
        <ItemHeader>
          <ItemTitle className="text-xl">{t('financial.records')}</ItemTitle>
          <ItemActions>
            <Button onClick={() => navigate({ to: '/patient/details/financial-add', search: { id: patient._id } })}>
              <Add className="size-4" />
              <span className="ml-2 hidden md:block">{t('new.record')}</span>
            </Button>
          </ItemActions>
        </ItemHeader>

        <ItemContent>{hasFinancials ? <FinancialSummaryContent patient={patient} /> : <DefaultEmptyData />}</ItemContent>
      </Item>

      {hasFinancials && <FinancialHistorySection financials={patient.financials} patientId={patient._id} />}
    </ItemGroup>
  );
};
