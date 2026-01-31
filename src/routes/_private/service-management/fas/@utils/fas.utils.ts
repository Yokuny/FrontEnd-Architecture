import i18n from '@/config/i18n';
import { api } from '@/lib/api/client';
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

export const maskOsName = (value: string) => {
  // 1. Remove everything that is not alphanumeric and convert to uppercase
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  let res = '';

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    // AAA (0, 1, 2)
    if (res.length < 3) {
      if (/[A-Z]/.test(char)) {
        res += char;
      }
    }
    // 9999 (3, 4, 5, 6)
    else if (res.length < 7) {
      if (/[0-9]/.test(char)) {
        res += char;
      }
    }
    // -99 (7 is '-', 8, 9)
    else if (res.length >= 7 && res.length < 10) {
      if (/[0-9]/.test(char)) {
        if (res.length === 7) {
          res += '-';
        }
        res += char;
      }
    }
    // /X (10 is '/', 11)
    else if (res.length >= 10 && res.length < 12) {
      if (/[A-Z0-9]/.test(char)) {
        if (res.length === 10) {
          res += '/';
        }
        res += char;
      }
    }

    if (res.length >= 12) break;
  }

  return res;
};

export const maskJobName = (value: string) => {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let res = '';
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (res.length < 3) {
      if (/[A-Z]/.test(char)) res += char;
    } else if (res.length < 15) {
      if (/[0-9]/.test(char)) res += char;
    }
  }
  return res;
};

export const isDockingHeader = (type?: string) => {
  return ['Docagem - Normal', 'Docagem - Emergencial', 'Docagem - Regularizacao'].includes(type || '');
};

export const isRegularizationHeader = (type?: string) => {
  return ['Docagem - Regularizacao', 'Regularizacao'].includes(type || '');
};

export const isDockingRegularizationHeader = (type?: string) => {
  return isDockingHeader(type) && isRegularizationHeader(type);
};

export const preUploadAttachments = async ({ files, supplierCanView = false }: { files: any[]; supplierCanView?: boolean }) => {
  if (!files?.length) {
    return [];
  }

  const fileForm = new FormData();
  files.forEach((file) => fileForm.append('files', file));
  fileForm.append('supplierCanView', String(supplierCanView));
  fileForm.append('status', 'awaiting.create.confirm');

  try {
    const response = await api.post<{ files: any[] }>('/fas/add-attachment', fileForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return response.data.files;
    }
  } catch (_error) {
    // Error handled by caller
  }

  return [];
};
