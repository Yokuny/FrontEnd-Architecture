import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Back from '@/components/icons/Back.Icon';
import IconCalendar from '@/components/icons/Calender.Icon';
import IconCard from '@/components/icons/Card.Icon';
import IconDollar from '@/components/icons/Dollar.Icon';
import IconService from '@/components/icons/Service.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useProfessionalStore } from '@/hooks/professionals';
import { currencyFormat, extractDate, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullFinancial } from '@/lib/interfaces/financial';
import type { ProfessionalList } from '@/lib/interfaces/professional';
import { useFinancialDetailQuery } from '@/query/financials';
import { useProfessionalsQuery } from '@/query/professionals';
import { FinancialEditForm } from './@components/financial-edit-form';
import { STATUS_TO_BADGE_VARIANT } from './@consts/financial.consts';
import { useFinancialEditForm } from './@hooks/use-financial-edit-form';

const searchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute('/_private/financial/details')({
  component: FinancialDetailPage,
  validateSearch: searchSchema,
  staticData: {
    title: 'Detalhes do Registro',
    description: 'Visualização completa e edição de registro financeiro.',
  },
});

function FinancialDetailPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const id = search.id;
  const { data: financial, isLoading } = useFinancialDetailQuery(id);
  const { data: professionals } = useProfessionalsQuery();

  const initialData = useMemo(
    () => ({
      price: financial?.price || 0,
      paid: financial?.paid || 0,
      paymentMethod: financial?.paymentMethod || 'none',
      installments: financial?.installments || 1,
      status: financial?.status || 'pending',
    }),
    [financial],
  );

  const { form, onSubmit, isPending } = useFinancialEditForm(id, initialData);

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button variant="outline" type="button" onClick={() => navigate({ to: '/financial' })} disabled={isPending} className="min-w-32">
            <Back className="mr-2 size-4" />
            Voltar
          </Button>
          <Button type="submit" form="financial-edit-form" disabled={isPending} className="min-w-40">
            {isPending && <Spinner className="mr-2 size-4" />}
            Salvar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className={isLoading || !financial ? 'p-12' : ''}>
        {isLoading ? (
          <DefaultLoading />
        ) : !financial ? (
          <EmptyData />
        ) : (
          <div className="flex flex-col gap-8">
            <FinancialDetailContent id={id} financial={financial} professionals={professionals} />
            <Separator />
            <Form {...form}>
              <form onSubmit={onSubmit} id="financial-edit-form">
                <FinancialEditForm />
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FinancialDetailContent({ financial, professionals }: { id: string; financial: FullFinancial; professionals: ProfessionalList[] | undefined }) {
  const badgeVariant = STATUS_TO_BADGE_VARIANT[financial.status] || 'pending';
  const professionalName = useProfessionalStore.getState().getName(professionals, financial.Professional);
  const professionalImage = useProfessionalStore.getState().getImage(professionals, financial.Professional);

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
              <ItemDescription className="font-medium text-xs uppercase tracking-widest">Paciente</ItemDescription>
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{financial.patient?.name}</ItemTitle>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={professionalImage} alt={professionalName} />
              <AvatarFallback>{professionalName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <ItemDescription className="font-medium text-xs uppercase tracking-widest">Profissional</ItemDescription>
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{professionalName}</ItemTitle>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BadgeIndicator variant={badgeVariant}>{statusDictionary(financial.status || 'pending')}</BadgeIndicator>
        </div>
      </Item>

      {/* Grid Strip */}
      <Item className="grid grid-cols-1 rounded-none border-y border-y-border py-6 md:grid-cols-4">
        <ItemContent className="md:border-r">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Valor Total</ItemDescription>
          <ItemTitle className="text-2xl tabular-nums leading-none">{currencyFormat(financial.price || 0)}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Total Pago</ItemDescription>
          <ItemTitle className="text-2xl text-green-500 tabular-nums leading-none dark:text-lime-400">{currencyFormat(financial.paid || 0)}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:border-r md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Pagamento</ItemDescription>
          <ItemTitle className="text-2xl leading-none">{financialPaymentMethod(financial.paymentMethod || 'none')}</ItemTitle>
        </ItemContent>

        <ItemContent className="md:px-8">
          <ItemDescription className="font-medium text-xs uppercase tracking-widest">Data</ItemDescription>
          <ItemTitle className="text-2xl tabular-nums leading-none">{extractDate(financial.createdAt, '')}</ItemTitle>
        </ItemContent>
      </Item>

      {/* Detalhes Financeiros */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium" rowSpan={2}>
                <div className="flex items-center gap-1">
                  <ItemMedia variant="icon">
                    <IconDollar className="size-4" />
                  </ItemMedia>
                  <ItemTitle>Valores</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Valor Total</ItemDescription>
                  <ItemTitle className="tabular-nums">{currencyFormat(financial.price || 0)}</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Total Pago</ItemDescription>
                  <ItemTitle className="text-green-500 tabular-nums dark:text-lime-400">{currencyFormat(financial.paid || 0)}</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Parcelas</ItemDescription>
                  <ItemTitle className="tabular-nums">{financial.installments || 1}x</ItemTitle>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium">
                <div className="flex items-center gap-1">
                  <ItemMedia variant="icon">
                    <IconCard className="size-4" />
                  </ItemMedia>
                  <ItemTitle>Pagamento</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Método</ItemDescription>
                  <ItemTitle>{financialPaymentMethod(financial.paymentMethod || 'none')}</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Status</ItemDescription>
                  <BadgeIndicator variant={badgeVariant}>{statusDictionary(financial.status || 'pending')}</BadgeIndicator>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium">
                <div className="flex items-center gap-1">
                  <ItemMedia variant="icon">
                    <IconCalendar className="size-4" />
                  </ItemMedia>
                  <ItemTitle>Datas</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Criação</ItemDescription>
                  <ItemTitle className="tabular-nums">{extractDate(financial.createdAt, '')}</ItemTitle>
                </div>
              </TableCell>
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <ItemDescription>Última Atualização</ItemDescription>
                  <ItemTitle className="tabular-nums">{extractDate(financial.updatedAt, '')}</ItemTitle>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Procedimentos */}
      {financial.procedures && financial.procedures.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium" rowSpan={financial.procedures.length + 1}>
                  <div className="flex items-center gap-1">
                    <ItemMedia variant="icon">
                      <IconService className="size-4" />
                    </ItemMedia>
                    <ItemTitle>Procedimentos</ItemTitle>
                  </div>
                </TableCell>
                <TableCell className="py-4 align-top">
                  <ItemDescription>Procedimento</ItemDescription>
                </TableCell>
                <TableCell className="py-4 align-top">
                  <ItemDescription>Preço</ItemDescription>
                </TableCell>
                <TableCell className="py-4 align-top">
                  <ItemDescription>Status</ItemDescription>
                </TableCell>
              </TableRow>
              {financial.procedures.map((proc) => (
                <TableRow key={proc.procedure} className="border-t">
                  <TableCell className="py-4 align-top">
                    <ItemTitle>{proc.procedure}</ItemTitle>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    <ItemTitle className="tabular-nums">{currencyFormat(proc.price)}</ItemTitle>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    <ItemTitle>{statusDictionary(proc.status)}</ItemTitle>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
