import { t } from '@/lib/helpers/translate.helper';
import type { CalendarView } from '@/lib/interfaces/schedule.interface';

export const viewDictionary: Record<CalendarView, string> = {
  month: t('month'),
  week: t('week'),
  day: t('day'),
  agenda: t('agenda'),
};

export const statusOptions = [
  { value: 'pending', label: t('pending') },
  { value: 'waiting', label: t('waiting') },
  { value: 'confirmed', label: t('confirmed') },
  { value: 'completed', label: t('completed') },
  { value: 'in_progress', label: t('in.progress') },
  { value: 'no_show', label: t('no.show') },
  { value: 'canceled', label: t('cancelled') },
  { value: 'canceled_by_patient', label: t('canceled.by.patient') },
  { value: 'canceled_by_professional', label: t('canceled.by.professional') },
];
