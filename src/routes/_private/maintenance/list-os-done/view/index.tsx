import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CheckCircle2, FileText, Printer, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

      <CardContent className="space-y-6 pb-20 max-w-5xl print:max-w-none">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="size-6" />
              </div>
              <span className="text-3xl font-semibold tracking-tighter">{data.order}</span>
            </div>
            <div className="flex items-start flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">{data.enterprise.name}</h2>
              <p className="text-muted-foreground">
                {data.enterprise.city} - {data.enterprise.state}
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid - Experience inspired */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y py-6">
          <div className="px-0 md:pr-12 space-y-2 border-b md:border-b-0 md:border-r pb-8 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('machine')}</span>
            <h3 className="text-3xl font-semibold tracking-tighter leading-tight">{data.machine.name}</h3>
          </div>
          <div className="px-0 md:px-12 space-y-2 border-b md:border-b-0 md:border-r py-8 md:py-0">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('maintenance.plan')}</span>
            <h3 className="text-3xl font-semibold tracking-tighter leading-tight">{data.maintenancePlan.description}</h3>
          </div>
          <div className="px-0 md:pl-12 space-y-2 pt-8 md:pt-0">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('done.at')}</span>
            <h3 className="text-3xl font-semibold tracking-tighter leading-tight">{data.doneAt ? format(new Date(data.doneAt), 'dd MM yyyy') : '-'}</h3>
          </div>
        </div>

        {/* Description Section */}
        {data.description && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tighter uppercase text-muted-foreground/60">{t('description')}</h3>
            <p className="text-2xl font-medium tracking-tight whitespace-pre-wrap leading-relaxed text-foreground/80">{data.description}</p>
          </div>
        )}

        {/* Checklist Section */}
        <div className="space-y-10 lg:space-y-16">
          <h2 className="text-4xl font-semibold tracking-tighter">{t('check.list')}</h2>

          <ul className="divide-y">
            {data.services.map((service, index) => (
              <li key={`${service.description}-${index}`} className="flex flex-col py-8 first:pt-0 last:pb-0 md:flex-row md:items-start gap-6 md:gap-12">
                <div className="w-16 shrink-0 md:pt-1">
                  {service.done ? (
                    <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                      <CheckCircle2 className="size-5" />
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                      <XCircle className="size-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h4 className="text-2xl font-semibold tracking-tighter leading-none">{service.description}</h4>
                    <Badge variant="secondary" className="w-fit font-medium text-xs px-3 py-1">
                      {service.groupName}
                    </Badge>
                  </div>

                  {service.typeService?.label && <p className="text-sm font-semibold text-primary/70">{service.typeService.label}</p>}

                  {service.observation && (
                    <p className="text-lg text-muted-foreground italic mt-4 border-l-4 border-primary/20 pl-6 py-2 bg-muted/20 rounded-r-lg">{service.observation}</p>
                  )}
                </div>
              </li>
            ))}
            {data.services.length === 0 && (
              <li className="py-6 border-none">
                <EmptyData />
              </li>
            )}
          </ul>
        </div>

        {/* Personnel Section */}
        <div className="flex justify-between items-center">
          <div className="space-y-6 flex flex-col w-fit items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('action.by')}</h3>
            <div className="flex flex-wrap gap-4">
              {data.usersDone.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-2.5 bg-muted/40 rounded-full border border-border/50 hover:bg-muted/60 transition-colors">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{user.name.charAt(0)}</div>
                  <span className="font-semibold tracking-tight text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('user.fill')}</h3>
              <p className="text-xl font-bold tracking-tight">{data.userFill?.name || '-'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('fill.at')}</h3>
              <p className="text-xl font-medium tracking-tight tabular-nums text-muted-foreground">{data.createAt ? format(new Date(data.createAt), 'dd MM yyyy HH:mm') : '-'}</p>
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
