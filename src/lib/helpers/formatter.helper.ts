import type { PartialPatient, ProcedureData, ProcedureSheet, ProfessionalList } from '@/lib/interfaces';
import type { EventColor } from '@/lib/interfaces/schedule';

const padStart = (value: number) => String(value).padStart(2, '0');
export const numClean = (value: string | number) => String(value).replace(/[^0-9]/g, '');
export const stringToDate = (data: Date | string) => new Date(data);

export const capitalizeString = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const handleCopy = (value: any) => navigator.clipboard.writeText(value);

export const valueAndLabel = (value: string, label: string) => ({ value, label });

export type Combobox = { value: string; label: string };
export type ComboboxWithImg = Combobox & { image: string };
export const comboboxWithImgFormat = (register: PartialPatient[] | ProfessionalList[]): ComboboxWithImg[] => {
  if (!register.length) return [{ value: '', label: 'Nenhum registro encontrado', image: '' }];
  return register.map((data) => ({
    value: data._id,
    label: data.name.trim(),
    image: data.image || undefined,
  }));
};

export const procedureSheetDataFormat = (procedures: ProcedureData[]): ProcedureSheet[] => {
  if (!procedures.length)
    return [
      {
        groupName: '',
        procedures: [{ procedure: '', group: '', costPrice: 0, suggestedPrice: 0, savedPrice: 0, periodicity: undefined }],
      },
    ];

  const group = procedures.reduce(
    (acc, data) => {
      const group = data.group || 'Sem grupo';
      if (!acc[group]) acc[group] = [];
      acc[group].push(data);
      return acc;
    },
    {} as { [key: string]: ProcedureData[] },
  );

  return Object.entries(group).map(([groupName, procedures]) => ({
    groupName,
    procedures,
  }));
};

export const formatCpfCnpj = (value: string | undefined | null) => {
  if (!value) return '';
  const num = numClean(value);

  const cnpjCheck = num.length === 14;
  if (cnpjCheck) return `${num.slice(0, 2)}.${num.slice(2, 5)}.${num.slice(5, 8)}/${num.slice(8, 12)}-${num.slice(12)}`;

  return num
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
};

export const formatRg = (value: string | undefined | null) => {
  if (!value) return '';
  const cleaned = value.replace(/[^0-9A-Za-z]/g, '');

  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }

  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4)}`;
  }

  return cleaned;
};

export const detectPhoneType = (value: string): 'brazilian' | 'english' | 'unknown' => {
  const num = numClean(value);

  if (num.length === 11 && /^[1-9]{2}9[0-9]{8}$/.test(num)) return 'brazilian';
  if (num.length === 10 && /^[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}$/.test(num)) return 'english';

  return 'unknown';
};

export const formatPhone = (value: string | undefined | null): string => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  const type = detectPhoneType(cleaned);

  switch (type) {
    case 'brazilian':
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    case 'english':
      if (cleaned.length <= 3) return `(${cleaned}`;
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    default:
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
      if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
};

export const formatCep = (value: string | undefined | null) => {
  if (!value) return '';
  const num = numClean(value);
  return num.replace(/(\d{5})(\d)/, '$1-$2');
};

export const formatDate = (value: string | undefined | null) => {
  if (!value) return '';
  const num = numClean(value);
  return num
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
    .slice(0, 10);
};

export const stringPriceClean = (value: string | number): number => {
  if (typeof value === 'number') {
    if (value >= 0) return value;
    throw new Error('Valor não pode ser negativo');
  }

  if (typeof value === 'string') {
    const sanitized = value.replace(/[^\d.]/g, '');
    const parts = sanitized.split('.');
    const cleaned = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    const parsed = parseFloat(cleaned);
    if (Number.isNaN(parsed) || parsed < 0) {
      throw new Error('Erro no valor informado ou valor não pode ser negativo');
    }
    return parsed;
  }

  throw new Error('Tipo de valor não suportado');
};

export const currencyFormat = (price: number | string | undefined | null) => {
  if (!price) return price;
  if (typeof price === 'string') price = parseFloat(price);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
};

export const extractDate = (data: Date | string | undefined | null, format: 'hour' | 'full' | 'default' | 'short' | '') => {
  if (!data) return '';
  const date = stringToDate(data);

  const hour = padStart(date.getHours());
  const minute = padStart(date.getMinutes());
  const day = padStart(date.getDate());
  const month = padStart(date.getMonth() + 1);

  const hourAndMinute = `${hour}:${minute}`;

  switch (format) {
    case 'hour':
      return `${hourAndMinute}`;
    case 'full':
      return `${day} ${month} ${date.getFullYear()} ${hourAndMinute}`;
    case 'default':
      return `${day}/${month} ${hourAndMinute}`;
    case 'short':
      return `${day}/${month}`;
    default:
      return `${day} ${month} ${date.getFullYear()}`;
  }
};

export const statusDictionary = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: 'Pendente',
    partial: 'Parcial',
    waiting: 'Aguardando',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    in_progress: 'Em andamento',
    no_show: 'Não compareceu',
    canceled: 'Cancelado',
    canceled_by_patient: 'Cancelado pelo paciente',
    canceled_by_professional: 'Cancelado pelo profissional',
    paid: 'Pago',
    refund: 'Reembolsado',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-500',
    waiting: 'bg-sky-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-green-500',
    in_progress: 'bg-indigo-500',
    no_show: 'bg-red-500',
    canceled: 'bg-slate-500',
    canceled_by_patient: 'bg-orange-500',
    canceled_by_professional: 'bg-amber-500',

    partial: 'bg-lime-500',
    paid: 'bg-teal-500',
    refund: 'bg-cyan-500',
  };
  return colors[status as keyof typeof colors] || 'bg-stone-500';
};

export const financialPaymentMethod = (method: string): string => {
  const financialPaymentMethodMap: { [key: string]: string } = {
    cash: 'Dinheiro',
    card: 'Cartão',
    pix: 'Pix',
    transfer: 'Transferência',
    boleto: 'Boleto',
    none: 'Não informado',
  };
  return financialPaymentMethodMap[method] || method;
};

export const calculateAge = (birthdate: string | Date | undefined | null): number => {
  if (!birthdate) return 0;
  const today = new Date();
  const birthDate = new Date(birthdate);

  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    return today.getFullYear() - birthDate.getFullYear() - 1;
  }

  return today.getFullYear() - birthDate.getFullYear();
};

export const getEventColorByStatus = (status: string): EventColor => {
  const statusColorMap: { [key: string]: EventColor } = {
    pending: 'yellow',
    waiting: 'sky',
    confirmed: 'emerald',
    completed: 'green',
    in_progress: 'indigo',
    no_show: 'red',
    canceled: 'slate',
    canceled_by_patient: 'orange',
    canceled_by_professional: 'amber',
    partial: 'lime',
    paid: 'teal',
    refund: 'cyan',
  };
  return statusColorMap[status] || 'stone';
};

export const getEventColorByProfessional = (professionalId: string, getProfessionalColor: (id: string) => EventColor | null, status: string): EventColor => {
  if (['canceled', 'canceled_by_patient', 'canceled_by_professional'].includes(status)) {
    return 'muted';
  }

  if (!professionalId) return 'sky';
  const professionalColor = getProfessionalColor(professionalId);
  if (professionalColor) return professionalColor;
  return getEventColorByStatus(status);
};
