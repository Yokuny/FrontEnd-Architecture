import type { StatusVariant } from '@/components/ui/badge';

export const FINANCIAL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'partial', label: 'Parcial' },
  { value: 'paid', label: 'Pago' },
  { value: 'canceled', label: 'Cancelado' },
  { value: 'refund', label: 'Reembolsado' },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'none', label: 'Nenhum' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'card', label: 'Cartão' },
  { value: 'pix', label: 'Pix' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'boleto', label: 'Boleto' },
] as const;

export const STATUS_TO_BADGE_VARIANT: Record<string, StatusVariant> = {
  pending: 'warning',
  partial: 'warning',
  paid: 'success',
  canceled: 'canceled',
  refund: 'error',
};
