import IconCalendar from '@/components/icons/Calender.Icon';
import IconDental from '@/components/icons/Dental.Icon';
import IconGear from '@/components/icons/Gear.Icon';
import IconNotification from '@/components/icons/Notification.Icon';
import IconPatients from '@/components/icons/Patients.Icon';
import IconWallet from '@/components/icons/Wallet.Icon';

export const ROUTE_ICONS: Record<string, React.ReactNode> = {
  financial: <IconWallet />,
  odontogram: <IconDental />,
  patient: <IconPatients />,
  reminders: <IconNotification />,
  schedule: <IconCalendar />,
  settings: <IconGear />,
};

export const SUB_ROUTE_ICONS: Record<string, React.ReactNode> = {};

export const MAIN_ROUTES = [
  '/financial',
  '/financial/add',
  '/odontogram',
  '/odontogram/add',
  '/patient',
  '/patient/add',
  '/reminders',
  '/reminders/add',
  '/schedule',
  '/schedule/add',
  '/settings',
  '/settings/access',
  '/settings/clinic',
  '/settings/invite',
  '/settings/permissions',
  '/settings/procedures',
  '/settings/profile',
] as const;

export type MainRoute = (typeof MAIN_ROUTES)[number];
