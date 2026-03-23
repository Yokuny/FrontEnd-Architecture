import Calender from '@/components/icons/Calender.Icon';
import Dental from '@/components/icons/Dental.Icon';
import Dollar from '@/components/icons/Dollar.Icon';
import Face from '@/components/icons/Face.Icon';
import Pulse from '@/components/icons/Pulse.Icon';
import Service from '@/components/icons/Service.Icon';
import User from '@/components/icons/User.Icon';

export const tabValues = ['profile', 'anamnesis', 'intraoral', 'odontogram', 'schedule', 'financial', 'medicalrecord'] as const;

export const tabs = [
  { value: 'profile', label: 'Visão Geral', icon: User },
  { value: 'anamnesis', label: 'Anamnese', icon: Pulse },
  { value: 'intraoral', label: 'Intraoral', icon: Face },
  { value: 'odontogram', label: 'Odontograma', icon: Dental },
  { value: 'schedule', label: 'Agendamentos', icon: Calender },
  { value: 'financial', label: 'Financeiro', icon: Dollar },
  { value: 'medicalrecord', label: 'Prontuário', icon: Service },
] as const;
