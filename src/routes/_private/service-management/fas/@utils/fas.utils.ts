import i18n from '@/config/i18n';
import { formatDate } from '@/lib/formatDate';
import type { Fas, FasOrder } from '../@interface/fas.schema';

export const mountFasCode = (item: Fas) => {
  const vesselName = item.vessel?.name?.toUpperCase().replace('CBO', '').replaceAll(' ', '').slice(0, 3) || '';
  const date = formatDate(item.serviceDate, 'yyyyMMdd');
  const type = item.type?.slice(0, 1) || '';
  return `${type}-${vesselName} ${date}`;
};

export const getLighthouseStatus = (sla?: number): 'success' | 'warning' | 'error' | 'neutral' => {
  switch (sla) {
    case 1:
      return 'success';
    case 2:
      return 'warning';
    case 3:
      return 'error';
    default:
      return 'neutral';
  }
};

export const getOrderSupplier = (order: FasOrder) => {
  if (order.supplierData && Object.keys(order.supplierData).length > 0 && !order.supplierData.cancelled) {
    return order.supplierData.razao;
  }
  return order.recommendedSupplier ? `${order.recommendedSupplier} (${i18n.t('suggested')})` : 'N/A';
};
