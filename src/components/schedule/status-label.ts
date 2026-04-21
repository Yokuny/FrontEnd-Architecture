import { t } from '@/lib/helpers/translate.helper';

const STATUS_TO_KEY: Record<string, string> = {
  pending: 'pending',
  waiting: 'waiting',
  confirmed: 'confirmed',
  completed: 'completed',
  in_progress: 'in.progress',
  no_show: 'no.show',
  noshow: 'no.show',
  canceled: 'cancelled',
  canceled_by_patient: 'canceled.by.patient',
  canceled_by_professional: 'canceled.by.professional',
  partial: 'partial',
  paid: 'paid',
  refund: 'refund',
};

export function translatedStatusLabel(status: string): string {
  const key = STATUS_TO_KEY[status];
  return key ? t(key) : status;
}
