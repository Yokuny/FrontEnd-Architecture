import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2, FileText, Printer, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
        <div className="flex flex-col justify-between gap-8 pt-6 md:flex-row md:items-end">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="size-6" />
              </div>
              <span className="font-semibold text-3xl tracking-tighter">{data.order}</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <h2 className="font-bold text-2xl tracking-tight">{data.enterprise.name}</h2>
              <p className="text-muted-foreground">
                {data.enterprise.city} - {data.enterprise.state}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid - Experience inspired */}
        <div className="grid grid-cols-1 gap-0 border-y py-6 md:grid-cols-3">
          <div className="space-y-2 border-b px-0 pb-8 md:border-r md:border-b-0 md:pr-12 md:pb-0">
            <span className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">{t('machine')}</span>
            <h3 className="font-semibold text-3xl leading-tight tracking-tighter">{data.machine.name}</h3>
          </div>
          <div className="space-y-2 border-b px-0 py-8 md:border-r md:border-b-0 md:px-12 md:py-0">
            <span className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">{t('maintenance.plan')}</span>
            <h3 className="font-semibold text-3xl leading-tight tracking-tighter">{data.maintenancePlan.description}</h3>
          </div>
          <div className="space-y-2 px-0 pt-8 md:pt-0 md:pl-12">
            <span className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">{t('done.at')}</span>
            <h3 className="font-semibold text-3xl leading-tight tracking-tighter">{data.doneAt ? formatDate(data.doneAt, 'dd MM yyyy') : '-'}</h3>
          </div>
        </div>

        {/* Description Section */}
        {data.description && (
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground/60 text-xl uppercase tracking-tighter">{t('description')}</h3>
            <p className="whitespace-pre-wrap font-medium text-2xl text-foreground/80 leading-relaxed tracking-tight">{data.description}</p>
          </div>
        )}

        {/* Checklist Section */}
        <div className="space-y-10 lg:space-y-16">
          <h2 className="font-semibold text-4xl tracking-tighter">{t('check.list')}</h2>

          <ul className="divide-y">
            {data.services.map((service, index) => (
              <li key={`${service.description}-${index}`} className="flex flex-col gap-6 py-8 first:pt-0 last:pb-0 md:flex-row md:items-start md:gap-12">
                <div className="w-16 shrink-0 md:pt-1">
                  {service.done ? (
                    <div className="flex size-10 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-600">
                      <CheckCircle2 className="size-5" />
                    </div>
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
                      <XCircle className="size-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <h4 className="font-semibold text-2xl leading-none tracking-tighter">{service.description}</h4>
                    <Badge variant="secondary" className="w-fit px-3 py-1 font-medium text-xs">
                      {service.groupName}
                    </Badge>
                  </div>

                  {service.typeService?.label && <p className="font-semibold text-primary/70 text-sm">{service.typeService.label}</p>}

                  {service.observation && (
                    <p className="mt-4 rounded-r-lg border-primary/20 border-l-4 bg-muted/20 py-2 pl-6 text-lg text-muted-foreground italic">{service.observation}</p>
                  )}
                </div>
              </li>
            ))}
            {data.services.length === 0 && (
              <li className="border-none py-6">
                <EmptyData />
              </li>
            )}
          </ul>
        </div>

        {/* Personnel Section */}
        <div className="flex items-center justify-between">
          <div className="flex w-fit flex-col items-center space-y-6">
            <h3 className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">{t('action.by')}</h3>
            <div className="flex flex-wrap gap-4">
              {data.usersDone.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-full border border-border/50 bg-muted/40 px-5 py-2.5 transition-colors hover:bg-muted/60">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs">{user.name.charAt(0)}</div>
                  <span className="font-semibold text-sm tracking-tight">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12">
            <div className="space-y-2">
              <h3 className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">{t('user.fill')}</h3>
              <p className="font-bold text-xl tracking-tight">{data.userFill?.name || '-'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-muted-foreground/60 text-xs uppercase tracking-widest">{t('fill.at')}</h3>
              <p className="font-medium text-muted-foreground text-xl tabular-nums tracking-tight">{data.createAt ? formatDate(data.createAt, 'dd MM yyyy HH:mm') : '-'}</p>
            </div>
          </div>
        </div>
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
          
          /* Forçar bordas e shadows para sumirem no Card */
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
