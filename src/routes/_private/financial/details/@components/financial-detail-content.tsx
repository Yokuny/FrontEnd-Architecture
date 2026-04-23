import { useState } from 'react';
import IconCalendar from '@/components/icons/Calender.Icon';
import IconCard from '@/components/icons/Card.Icon';
import IconDollar from '@/components/icons/Dollar.Icon';
import Down from '@/components/icons/Down.Icon';
import IconService from '@/components/icons/Service.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { FullFinancial } from '@/lib/interfaces/financial.interface';
import type { ProfessionalList } from '@/lib/interfaces/professional.interface';
import { cn } from '@/lib/utils/cn.util';
import { getProfessionalImage, getProfessionalName } from '@/query/professionals';
import { STATUS_TO_BADGE_VARIANT } from '../../@consts/financial.consts';

interface FinancialDetailContentProps {
  financial: FullFinancial;
  professionals: ProfessionalList[] | undefined;
}

export function FinancialDetailContent({ financial, professionals }: FinancialDetailContentProps) {
  const badgeVariant = STATUS_TO_BADGE_VARIANT[financial.status] || 'pending';
  const professionalName = getProfessionalName(professionals, financial.Professional);
  const professionalImage = getProfessionalImage(professionals, financial.Professional);

  const [openCategories, setOpenCategories] = useState<string[]>(['values', 'payment', 'dates', 'procedures']);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Item className="justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={financial.patient?.image} alt={financial.patient?.name} />
              <AvatarFallback>{financial.patient?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('patient')}</ItemDescription>
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{financial.patient?.name}</ItemTitle>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={professionalImage} alt={professionalName} />
              <AvatarFallback>{professionalName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('professional')}</ItemDescription>
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{professionalName}</ItemTitle>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BadgeIndicator variant={badgeVariant} pulse />
          <ItemTitle className="text-2xl">{statusDictionary(financial.status || 'pending')}</ItemTitle>
        </div>
      </Item>

      {/* Grid Strip */}
      <Item className="grid grid-cols-1 rounded-none border-y border-y-border py-6 md:grid-cols-4">
        <ItemContent className="md:border-r">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('amount.total')}</ItemDescription>
          <ItemTitle className="text-2xl tabular-nums leading-none">{currencyFormat(financial.price || 0)}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('total.paid')}</ItemDescription>
          <ItemTitle className="text-2xl text-green-500 tabular-nums leading-none dark:text-lime-400">{currencyFormat(financial.paid || 0)}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('payment')}</ItemDescription>
          <ItemTitle className="text-2xl leading-none">{financialPaymentMethod(financial.paymentMethod || 'none')}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('date')}</ItemDescription>
          <ItemTitle className="text-2xl tabular-nums leading-none">{formatDate(financial.createdAt)}</ItemTitle>
        </ItemContent>
      </Item>

      <div className="overflow-hidden rounded-lg border bg-card">
        {/* Valores */}
        <Collapsible open={openCategories.includes('values')} onOpenChange={() => toggleCategory('values')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
            >
              <div className="flex items-center gap-3">
                <ItemMedia variant="icon" className="text-foreground">
                  <IconDollar className="size-4" />
                </ItemMedia>
                <ItemTitle className="text-base">{t('values.section')}</ItemTitle>
              </div>
              <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('values') && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ItemGroup className="gap-0">
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('amount.total')}</ItemDescription>
                <ItemTitle className="font-mono tabular-nums">{currencyFormat(financial.price || 0)}</ItemTitle>
              </Item>
              <ItemSeparator />
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('total.paid')}</ItemDescription>
                <ItemTitle className="font-mono text-green-500 tabular-nums dark:text-lime-400">{currencyFormat(financial.paid || 0)}</ItemTitle>
              </Item>
              <ItemSeparator />
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('installments')}</ItemDescription>
                <ItemTitle className="font-mono tabular-nums">{financial.installments || 1}x</ItemTitle>
              </Item>
            </ItemGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Pagamento */}
        <Collapsible open={openCategories.includes('payment')} onOpenChange={() => toggleCategory('payment')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
            >
              <div className="flex items-center gap-3">
                <ItemMedia variant="icon" className="text-foreground">
                  <IconCard className="size-4" />
                </ItemMedia>
                <ItemTitle className="text-base">{t('payment')}</ItemTitle>
              </div>
              <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('payment') && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ItemGroup className="gap-0">
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('method')}</ItemDescription>
                <ItemTitle className="font-mono">{financialPaymentMethod(financial.paymentMethod || 'none')}</ItemTitle>
              </Item>
              <ItemSeparator />
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('status')}</ItemDescription>
                <div className="flex items-center gap-2">
                  <BadgeIndicator variant={badgeVariant} pulse />
                  <ItemTitle>{statusDictionary(financial.status || 'pending')}</ItemTitle>
                </div>
              </Item>
            </ItemGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Datas */}
        <Collapsible open={openCategories.includes('dates')} onOpenChange={() => toggleCategory('dates')}>
          <CollapsibleTrigger asChild>
            <Button
              variant="secondary"
              className="w-full items-center justify-between rounded-none border-none bg-secondary outline-none hover:bg-secondary/80 focus-visible:ring-2"
            >
              <div className="flex items-center gap-3">
                <ItemMedia variant="icon" className="text-foreground">
                  <IconCalendar className="size-4" />
                </ItemMedia>
                <ItemTitle className="text-base">{t('dates')}</ItemTitle>
              </div>
              <Down className={cn('size-5 stroke-2 text-muted-foreground transition-transform duration-200', openCategories.includes('dates') && 'rotate-180')} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ItemGroup className="gap-0">
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('created.at')}</ItemDescription>
                <ItemTitle className="font-mono tabular-nums">{formatDate(financial.createdAt)}</ItemTitle>
              </Item>
              <ItemSeparator />
              <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                <ItemDescription className="font-sans">{t('last.updated')}</ItemDescription>
                <ItemTitle className="font-mono tabular-nums">{formatDate(financial.updatedAt)}</ItemTitle>
              </Item>
            </ItemGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Procedimentos */}
        {financial.procedures && financial.procedures.length > 0 && (
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
                {financial.procedures.map((proc, index) => (
                  <div key={`${proc.procedure}-${proc.price}-${proc.status}`}>
                    <Item variant="default" size="sm" className="justify-between py-2 hover:bg-secondary">
                      <ItemDescription className="font-sans">{proc.procedure}</ItemDescription>
                      <div className="flex items-center gap-2">
                        <BadgeIndicator variant={STATUS_TO_BADGE_VARIANT[proc.status] || 'pending'} pulse />
                        <ItemTitle className="tabular-nums">{statusDictionary(proc.status)}</ItemTitle>
                      </div>
                    </Item>
                    {financial.procedures && financial.procedures.length > 1 && index < financial.procedures.length - 1 && <ItemSeparator />}
                  </div>
                ))}
              </ItemGroup>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
