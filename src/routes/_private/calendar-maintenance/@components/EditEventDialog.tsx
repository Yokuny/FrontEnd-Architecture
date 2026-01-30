'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { MachineManagerSelect } from '@/components/selects/machine-manager-select';
import { MaintenancePlanSelect } from '@/components/selects/maintenance-plan-select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api/client';
import type { EventType, PartialSchedule } from '../@interface/schedule';

interface EditEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Partial<PartialSchedule> | null;
  idEnterprise: string;
}

export function EditEventDialog({ isOpen, onOpenChange, event, idEnterprise }: EditEventDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<PartialSchedule>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const rawEventType = formData.eventType;
  const eventTypeValue = typeof rawEventType === 'object' ? rawEventType.value : rawEventType;
  const eventType = eventTypeValue as EventType;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        idEnterprise,
        eventType: eventType,
      };

      if (formData.id && formData.id !== '0') {
        const id = formData._id || formData.id;
        await api.post(`/event-schedule?applyTo=none`, { ...payload, id });
        toast.success(t('success.update'));
      } else {
        await api.post(`/event-schedule`, payload);
        toast.success(t('edit.event'));
      }

      queryClient.invalidateQueries({ queryKey: ['event-schedule'] });
      onOpenChange(false);
    } catch {
      toast.error(t('error.save'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = formData._id || formData.id;
    if (!id || id === '0') return;

    setIsLoading(true);
    try {
      await api.delete(`/event-schedule/${id}?applyTo=none`);
      toast.success(t('success.remove'));
      queryClient.invalidateQueries({ queryKey: ['event-schedule'] });
      onOpenChange(false);
    } catch {
      toast.error(t('error.delete'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{formData.id && formData.id !== '0' ? t('edit.event') : t('new.event')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="eventType">{t('type.event')}</Label>
              <Select value={eventType || 'maintenance'} onValueChange={(val) => setFormData((prev) => ({ ...prev, eventType: val as EventType }))} disabled={formData.id !== '0'}>
                <SelectTrigger>
                  <SelectValue placeholder={t('type.event')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
                  <SelectItem value="teamChange">{t('event.team.change')}</SelectItem>
                  <SelectItem value="event">{t('event')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {eventType === 'teamChange' && (
              <div className="grid gap-2">
                <Label>{t('event.qlp')}</Label>
                <Select value={formData.qlp?.value} onValueChange={(val) => setFormData((prev) => ({ ...prev, qlp: { value: val, label: val } }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('event.qlp')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QLP1">QLP 1</SelectItem>
                    <SelectItem value="QLP2">QLP 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MachineByEnterpriseSelect
              idEnterprise={idEnterprise}
              mode="single"
              value={formData.idMachine}
              onChange={(val) => setFormData((prev) => ({ ...prev, idMachine: val, machine: { id: val || '', name: '' } }))}
            />
            {eventType === 'maintenance' && (
              <MaintenancePlanSelect
                idEnterprise={idEnterprise}
                mode="single"
                value={formData.idMaintenancePlan}
                onChange={(val) => setFormData((prev) => ({ ...prev, idMaintenancePlan: val }))}
              />
            )}
          </div>

          {eventType === 'maintenance' ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t('date.window.start')}</Label>
                <Input
                  type="date"
                  value={formData.dateWindowInit ? formData.dateWindowInit.split('T')[0] : ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateWindowInit: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t('date.window.end')}</Label>
                <Input
                  type="date"
                  value={formData.dateWindowEnd ? formData.dateWindowEnd.split('T')[0] : ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateWindowEnd: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>{t('date')}</Label>
              <Input
                type="date"
                value={formData.date ? (typeof formData.date === 'string' ? formData.date.split('T')[0] : formData.date.toISOString().split('T')[0]) : ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
          )}

          {(eventType === 'teamChange' || eventType === 'event') && (
            <div className="grid gap-2">
              <Label>{t('users')}</Label>
              <MachineManagerSelect idEnterprise={idEnterprise} mode="multi" value={formData.users || []} onChange={(vals) => setFormData((prev) => ({ ...prev, users: vals }))} />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="observation">{t('observation')}</Label>
            <Textarea id="observation" value={formData.observation || ''} onChange={(e) => setFormData((prev) => ({ ...prev, observation: e.target.value }))} />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {formData.id && formData.id !== '0' && (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {t('delete')}
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {t('save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
