import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, FileText, Printer, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import { useOsDetails } from './@hooks/use-os-details-api';
import { osDetailsSearchSchema } from './@interface/os-details.types';

export const Route = createFileRoute('/_private/maintenance/list-os-done/view/')({
  validateSearch: (search) => osDetailsSearchSchema.parse(search),
  component: OsDetailsPage,
});

function OsDetailsPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const { data, isLoading } = useOsDetails(id);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('done.os')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader title={t('done.os')} />
        <CardContent className="p-12">
          <EmptyData />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="print:border-none">
      <CardHeader title={t('done.os')} className="print:hidden">
        <Button onClick={handlePrint} className="font-semibold">
          {t('print')} <Printer className="ml-2 size-4" />
        </Button>
      </CardHeader>

      <CardContent className="max-w-5xl space-y-6 pb-20 print:max-w-none">
        {/* Header Section */}
        <Item className="justify-between p-0">
          <div className="flex flex-col gap-1">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('order')}</ItemDescription>
            <ItemTitle className="font-semibold text-2xl tracking-tighter">{data.order}</ItemTitle>
          </div>
          <div className="flex flex-col gap-1">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('enterprise')}</ItemDescription>
            <div className="items-baseline-last flex gap-4">
              <ItemTitle className="font-semibold text-2xl tracking-tighter">{data.enterprise.name}</ItemTitle>
              <ItemDescription>
                {data.enterprise.city} - {data.enterprise.state}
              </ItemDescription>
            </div>
          </div>
        </Item>

        {/* Info Grid */}
        <Item className="grid grid-cols-1 rounded-none border-y border-y-border py-6 md:grid-cols-3">
          <ItemContent className="md:border-r">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('machine')}</ItemDescription>
            <ItemTitle className="text-2xl leading-none">{data.machine.name}</ItemTitle>
          </ItemContent>

          <ItemContent className="md:border-r md:px-8">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('maintenance.plan')}</ItemDescription>
            <ItemTitle className="text-2xl leading-none">{data.maintenancePlan.description}</ItemTitle>
          </ItemContent>

          <ItemContent className="md:px-8">
            <ItemDescription className="font-medium text-xs uppercase tracking-widest">{t('done.at')}</ItemDescription>
            <ItemTitle className="text-2xl leading-none">{data.doneAt ? formatDate(data.doneAt, 'dd MM yyyy') : '-'}</ItemTitle>
          </ItemContent>
        </Item>

        {/* Details Section */}
        <div className="overflow-hidden bg-card">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="bg-muted/50 py-4 align-top font-medium">
                  <ItemTitle>{t('action.by')}</ItemTitle>
                </TableCell>
                <TableCell className="py-4 align-top">
                  <div className="flex flex-wrap gap-2">
                    {data.usersDone.map((user) => (
                      <div key={user.id} className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1.5">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-bold text-[10px] text-primary">{user.name.charAt(0)}</div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-muted/50 py-4 align-top font-medium">
                  <ItemTitle>{t('user.fill')}</ItemTitle>
                </TableCell>
                <TableCell className="py-4 align-top">
                  <ItemTitle>{data.userFill?.name || '-'}</ItemTitle>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="bg-muted/50 py-4 align-top font-medium">
                  <ItemTitle>{t('fill.at')}</ItemTitle>
                </TableCell>
                <TableCell className="py-4 align-top">
                  <ItemTitle className="tabular-nums">{data.createAt ? formatDate(data.createAt, 'dd MM yyyy HH:mm') : '-'}</ItemTitle>
                </TableCell>
              </TableRow>
              {data.description && (
                <TableRow>
                  <TableCell className="bg-muted/50 py-4 align-top font-medium">
                    <div className="flex items-center gap-1">
                      <ItemMedia variant="icon">
                        <FileText className="size-4" />
                      </ItemMedia>
                      <ItemTitle>{t('description')}</ItemTitle>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 align-top">
                    <div className="whitespace-pre-wrap">{data.description}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Checklist Section */}

        {data.services.length !== 0 && (
          <div className="space-y-6">
            <ItemTitle className="text-2xl">{t('check.list')}</ItemTitle>

            <div className="overflow-hidden bg-card">
              <Table>
                <TableBody>
                  {data.services.map((service, index) => (
                    <TableRow key={`${service.description}-${index}`}>
                      <TableCell className="w-16 py-4 align-top">
                        {service.done ? (
                          <div className="flex size-8 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-600">
                            <CheckCircle2 className="size-4" />
                          </div>
                        ) : (
                          <div className="flex size-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
                            <XCircle className="size-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <ItemDescription>{t('service')}</ItemDescription>
                          <ItemTitle>{service.description}</ItemTitle>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <ItemDescription>{t('group')}</ItemDescription>
                          <Badge variant="secondary" className="w-fit">
                            {service.groupName}
                          </Badge>
                        </div>
                      </TableCell>
                      {service.typeService?.label && (
                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <ItemDescription>{t('type')}</ItemDescription>
                            <ItemTitle className="text-primary/70">{service.typeService.label}</ItemTitle>
                          </div>
                        </TableCell>
                      )}
                      {service.observation && (
                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <ItemDescription>{t('observation')}</ItemDescription>
                            <ItemDescription className="italic">{service.observation}</ItemDescription>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      <style>{`
        @media print {
          /* Esconder elementos de layout do sistema */
          [data-sidebar="sidebar"], 
          header, 
          .no-print { 
            display: none !important; 
          }
          
          /* Ajustar container principal para ocupar a tela toda */
          main, 
          div[data-radix-scroll-area-viewport] {
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }

          .min-h-screen { padding: 0 !important; }
          .pb-20, .py-6, .pt-12 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .space-y-12 { margin-top: 0 !important; margin-bottom: 0 !important; }
          
          .card, .border { 
            border: none !important; 
            box-shadow: none !important; 
          }
          
          body { 
            background: white !important; 
            width: 100% !important;
          }

          /* Garantir que o Card ocupe toda a largura do papel */
          .max-w-5xl { 
            max-width: none !important; 
            margin: 0 !important;
          }
        }
      `}</style>
    </Card>
  );
}
