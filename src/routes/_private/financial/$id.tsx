import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { currencyFormat, extractDate, financialPaymentMethod, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { FullFinancial } from '@/lib/interfaces/financial';
import type { ProfessionalList } from '@/lib/interfaces/professional';
import { useFinancialDetailQuery } from '@/query/financials';
import { getProfessionalImage, getProfessionalName, useProfessionalsQuery } from '@/query/professionals';
import { FinancialEditForm } from './@components/financial-edit-form';
import { STATUS_TO_BADGE_VARIANT } from './@consts/financial.consts';
import { useFinancialEditForm } from './@hooks/use-financial-edit-form';

export const Route = createFileRoute('/_private/financial/$id')({
  component: FinancialDetailPage,
});

function FinancialDetailPage() {
  const { id } = useParams({ from: '/_private/financial/$id' });
  const navigate = useNavigate();
  const { data: financial, isLoading } = useFinancialDetailQuery(id);
  const { data: professionals } = useProfessionalsQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  if (!financial) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registro não encontrado</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate({ to: '/financial' })}>
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return <FinancialDetailContent id={id} financial={financial} professionals={professionals} />;
}

function FinancialDetailContent({ id, financial, professionals }: { id: string; financial: FullFinancial; professionals: ProfessionalList[] | undefined }) {
  const navigate = useNavigate();
  const badgeVariant = STATUS_TO_BADGE_VARIANT[financial.status] || 'neutral';

  const initialData = useMemo(
    () => ({
      price: financial.price || 0,
      paid: financial.paid || 0,
      paymentMethod: financial.paymentMethod || 'none',
      installments: financial.installments || 1,
      status: financial.status || 'pending',
    }),
    [financial],
  );

  const { form, onSubmit, isPending } = useFinancialEditForm(id, initialData);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Financeiro</CardTitle>
          <ItemDescription>Visualize e edite as informações do registro financeiro</ItemDescription>
        </div>
        <CardAction>
          <Button variant="outline" onClick={() => navigate({ to: '/financial' })}>
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-8">
          {/* Informações do Atendimento */}
          <div className="flex flex-col gap-4">
            <ItemTitle className="font-semibold text-base">Informações do Atendimento</ItemTitle>
            <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row">
              <div className="flex w-full items-center gap-3 rounded-lg border p-4">
                <Avatar className="size-12">
                  <AvatarImage src={financial.patient?.image} alt={financial.patient?.name} />
                  <AvatarFallback>{financial.patient?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <ItemContent className="gap-0">
                  <ItemDescription>Paciente</ItemDescription>
                  <ItemTitle>{financial.patient?.name}</ItemTitle>
                </ItemContent>
              </div>
              <div className="flex w-full items-center gap-3 rounded-lg border p-4">
                <Avatar className="size-12">
                  <AvatarImage src={getProfessionalImage(professionals, financial.Professional)} alt="Profissional" />
                  <AvatarFallback>{getProfessionalName(professionals, financial.Professional).slice(0, 2)}</AvatarFallback>
                </Avatar>
                <ItemContent className="gap-0">
                  <ItemDescription>Profissional</ItemDescription>
                  <ItemTitle>{getProfessionalName(professionals, financial.Professional)}</ItemTitle>
                </ItemContent>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Financeiras */}
          <div className="flex flex-col gap-4">
            <ItemTitle className="font-semibold text-base">Informações Financeiras</ItemTitle>
            <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row">
              <div className="flex w-full flex-col items-center gap-2 rounded-lg border p-6">
                <ItemDescription>Valor Total</ItemDescription>
                <p className="font-bold text-2xl tabular-nums">{currencyFormat(financial.price || 0)}</p>
                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-green-500 tabular-nums dark:text-lime-400">{currencyFormat(financial.paid || 0)}</p>
                  <ItemDescription>total pago</ItemDescription>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-2 rounded-lg border p-6">
                <ItemDescription>Pagamento</ItemDescription>
                <p className="font-bold text-2xl">{financialPaymentMethod(financial.paymentMethod || 'none')}</p>
                <div className="flex items-baseline gap-2">
                  <ItemDescription>Status</ItemDescription>
                  <Status status={badgeVariant}>
                    <StatusIndicator status={badgeVariant} />
                    <StatusLabel>{statusDictionary(financial.status || 'pending')}</StatusLabel>
                  </Status>
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-2 rounded-lg border p-6">
                <ItemDescription>Data</ItemDescription>
                <p className="font-bold text-2xl tabular-nums">{extractDate(financial.createdAt, '')}</p>
                <div className="flex items-baseline gap-2">
                  <ItemDescription>Última atualização</ItemDescription>
                  <p className="font-medium text-sm tabular-nums">{extractDate(financial.updatedAt, '')}</p>
                </div>
              </div>
            </div>

            {/* Tabela de procedimentos */}
            <div className="max-w-4xl rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Procedimento</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financial.procedures?.length > 0 ? (
                    financial.procedures.map((procedure, index) => (
                      <TableRow key={`${procedure.procedure}-${index}`}>
                        <TableCell>{procedure.procedure}</TableCell>
                        <TableCell className="tabular-nums">{currencyFormat(procedure.price)}</TableCell>
                        <TableCell>{statusDictionary(procedure.status)}</TableCell>
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
            </div>
          </div>

          <Separator />

          {/* Formulário de Edição */}
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FinancialEditForm />
              <div className="flex w-full max-w-4xl gap-4 px-6 py-4 md:px-10">
                <Button variant="outline" type="button" onClick={() => navigate({ to: '/financial' })} disabled={isPending} className="w-1/4">
                  <ArrowLeft className="mr-2 size-4" />
                  Voltar
                </Button>
                <Button type="submit" disabled={isPending} className="w-3/4">
                  {isPending && <Spinner className="mr-2 size-4" />}
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
