import { format } from 'date-fns';
import { Calendar, Loader2, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { api } from '@/lib/api/client';
import type { EventScheduleEvent } from '../@interface/monitoring-plan.types';

interface EditEventScheduleDialogProps {
  children?: React.ReactNode;
  event?: EventScheduleEvent | null;
  idMachine?: string;
  idMaintenancePlan?: string;
  dateWindowEnd?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditEventScheduleDialog({
  children,
  event: initialEvent,
  idMachine,
  idMaintenancePlan,
  dateWindowEnd,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: EditEventScheduleDialogProps) {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const [event, setEvent] = useState<EventScheduleEvent | null>(initialEvent ?? null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<EventScheduleEvent>>({});

  useEffect(() => {
    setEvent(initialEvent ?? null);
  }, [initialEvent]);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      if (!initialEvent && idMachine && idMaintenancePlan && dateWindowEnd) {
        setIsFetching(true);
        try {
          const response = await api.get<EventScheduleEvent[]>(`/event-schedule?idEnterprise=${idEnterprise}&idMachine[]=${idMachine}&idMaintenancePlan[]=${idMaintenancePlan}`);

          const events = response.data;
          const foundEvent = events.find((e) => {
            const eventEnd = e.dateWindowEnd ? format(new Date(e.dateWindowEnd), 'yyyy-MM-dd') : null;
            const targetEnd = format(new Date(dateWindowEnd), 'yyyy-MM-dd');
            return eventEnd === targetEnd;
          });

          if (foundEvent) {
            setEvent(foundEvent);
            populateForm(foundEvent);
          }
        } catch {
          toast.error(t('error.fetch.event'));
        } finally {
          setIsFetching(false);
        }
      } else if (event) {
        populateForm(event);
      }
    }
  };

  const populateForm = (data: EventScheduleEvent) => {
    setFormData({
      ...data,
      dateWindowInit: data.dateWindowInit ? format(new Date(data.dateWindowInit), 'yyyy-MM-dd') : null,
      dateWindowEnd: data.dateWindowEnd ? format(new Date(data.dateWindowEnd), 'yyyy-MM-dd') : null,
      datePlanInit: data.datePlanInit ? format(new Date(data.datePlanInit), 'yyyy-MM-dd') : null,
      datePlanEnd: data.datePlanEnd ? format(new Date(data.datePlanEnd), 'yyyy-MM-dd') : null,
      dateDoneInit: data.dateDoneInit ? format(new Date(data.dateDoneInit), 'yyyy-MM-dd') : null,
      dateDoneEnd: data.dateDoneEnd ? format(new Date(data.dateDoneEnd), 'yyyy-MM-dd') : null,
    });
  };

  const handleChange = (field: keyof EventScheduleEvent, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        id: event?.id,
        eventType: event?.eventType || 'maintenance',
        idMachine: event?.idMachine || idMachine,
        idMaintenancePlan: event?.idMaintenancePlan || idMaintenancePlan,
        idEnterprise,
      };

      await api.post('/event-schedule?applyTo=none', payload);
      toast.success(t('save.successfull'));
      setOpen(false);
      onSuccess();
    } catch {
      // Error handled by api client
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event?.id) return;

    setIsLoading(true);
    try {
      await api.delete(`/event-schedule/${event.id}?applyTo=none`);
      toast.success(t('success.remove'));
      setOpen(false);
      onSuccess();
    } catch {
      // Error handled by api client
    } finally {
      setIsLoading(false);
    }
  };

  const title = event?.title || event?.machine?.name || t('edit');

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            {isFetching ? t('loading') : title}
          </DialogTitle>
          <DialogDescription>{isFetching ? t('loading') : event?.maintenancePlan?.description || t('event.maintenance')}</DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t('loading.data')}</p>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {/* Datas da Janela */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateWindowInit">{t('date.window.start')}</Label>
                <Input id="dateWindowInit" type="date" value={formData.dateWindowInit || ''} onChange={(e) => handleChange('dateWindowInit', e.target.value || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateWindowEnd">{t('date.window.end')}</Label>
                <Input id="dateWindowEnd" type="date" value={formData.dateWindowEnd || ''} onChange={(e) => handleChange('dateWindowEnd', e.target.value || null)} />
              </div>
            </div>

            {/* Datas do Planejamento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datePlanInit">{t('date.plan.start')}</Label>
                <Input id="datePlanInit" type="date" value={formData.datePlanInit || ''} onChange={(e) => handleChange('datePlanInit', e.target.value || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datePlanEnd">{t('date.plan.end')}</Label>
                <Input id="datePlanEnd" type="date" value={formData.datePlanEnd || ''} onChange={(e) => handleChange('datePlanEnd', e.target.value || null)} />
              </div>
            </div>

            {/* Datas de Conclusão */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDoneInit">{t('date.done.start')}</Label>
                <Input id="dateDoneInit" type="date" value={formData.dateDoneInit || ''} onChange={(e) => handleChange('dateDoneInit', e.target.value || null)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateDoneEnd">{t('date.done.end')}</Label>
                <Input id="dateDoneEnd" type="date" value={formData.dateDoneEnd || ''} onChange={(e) => handleChange('dateDoneEnd', e.target.value || null)} />
              </div>
            </div>

            {/* Observação */}
            <div className="space-y-2">
              <Label htmlFor="observation">{t('observation')}</Label>
              <Textarea
                id="observation"
                rows={3}
                value={formData.observation || ''}
                onChange={(e) => handleChange('observation', e.target.value || null)}
                placeholder={t('observation')}
                maxLength={150}
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {event?.id && !isFetching && (
            <Button variant="ghost" onClick={handleDelete} disabled={isLoading} className="text-destructive hover:text-destructive mr-auto">
              {isLoading ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
              {t('delete')}
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading || isFetching}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isFetching}>
            {isLoading ? <Spinner className="size-4" /> : <Save className="size-4" />}
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
