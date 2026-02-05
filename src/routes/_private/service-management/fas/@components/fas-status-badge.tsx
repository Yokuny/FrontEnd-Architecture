import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface FasStatusBadgeProps {
  status: string;
}

export function FasStatusBadge({ status }: FasStatusBadgeProps) {
  const { t } = useTranslation();

  let variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'outline';

  switch (status) {
    case 'fas.closed':
    case 'not.approved':
    case 'cancelled':
      variant = 'secondary';
      break;
    case 'awaiting.create.confirm':
    case 'awaiting.bms':
    case 'bms.refused':
    case 'invoice.rejected':
    case 'not.realized':
      variant = 'warning';
      break;
    case 'awaiting.request':
    case 'awaiting.payment':
    case 'false': // Valid
      variant = 'success';
      break;
    case 'supplier.canceled':
    case 'awaiting.collaborators':
    case 'awaiting.bms.confirm':
    case 'awaiting.contract.validation':
    case 'awaiting.rating':
    case 'awaiting.buy.request':
    case 'awaiting.sap':
    case 'true': // Invalid
      variant = 'error';
      break;
    case 'awaiting.invoice':
      variant = 'info';
      break;
    default:
      variant = 'outline';
  }

  const labelId = status === 'true' ? 'invalid' : status === 'false' ? 'valid' : status;

  return <Badge variant={variant}>{t(labelId)}</Badge>;
}
