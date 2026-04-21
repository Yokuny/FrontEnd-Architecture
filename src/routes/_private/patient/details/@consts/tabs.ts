import Calender from '@/components/icons/Calender.Icon';
import Dental from '@/components/icons/Dental.Icon';
import Dollar from '@/components/icons/Dollar.Icon';
import Face from '@/components/icons/Face.Icon';
import Pulse from '@/components/icons/Pulse.Icon';
import Service from '@/components/icons/Service.Icon';
import User from '@/components/icons/User.Icon';
import { t } from '@/lib/helpers/translate.helper';

export const tabValues = ['profile', 'anamnesis', 'intraoral', 'odontogram', 'schedule', 'financial', 'medicalrecord'] as const;

export const tabs = [
  { value: 'profile', label: t('overview'), icon: User },
  { value: 'anamnesis', label: t('medical.anamnesis'), icon: Pulse },
  { value: 'intraoral', label: t('intraoral'), icon: Face },
  { value: 'odontogram', label: t('odontogram'), icon: Dental },
  { value: 'schedule', label: t('schedule'), icon: Calender },
  { value: 'financial', label: t('financial'), icon: Dollar },
  { value: 'medicalrecord', label: t('medical.record'), icon: Service },
] as const;
