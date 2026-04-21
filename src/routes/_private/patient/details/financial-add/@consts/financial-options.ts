import { t } from '@/lib/helpers/translate.helper';

export const FINANCIAL_STATUS_OPTIONS = [
  { value: 'pending', label: t('pending') },
  { value: 'partial', label: t('partial') },
  { value: 'paid', label: t('paid') },
  { value: 'canceled', label: t('cancelled') },
  { value: 'refund', label: t('refunded') },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'none', label: t('payment.method.none') },
  { value: 'cash', label: t('payment.method.cash') },
  { value: 'card', label: t('payment.method.card') },
  { value: 'pix', label: t('payment.method.pix') },
  { value: 'transfer', label: t('payment.method.transfer') },
  { value: 'boleto', label: t('payment.method.boleto') },
] as const;
