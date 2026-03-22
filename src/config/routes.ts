export const ROUTE_ICONS: Record<string, React.ReactNode> = {};
export const SUB_ROUTE_ICONS: Record<string, React.ReactNode> = {};

export const MAIN_ROUTES = [
  '/financial',
  '/financial/add',
  '/financial/details',
  '/odontogram',
  '/odontogram/add',
  '/odontogram/details',
  '/patient',
  '/patient/add',
  '/patient/details',
  '/reminders',
  '/reminders/add',
  '/schedule',
  '/schedule/details',
  '/settings/access',
  '/settings/clinic',
  '/settings/invite',
  '/settings/permissions',
  '/settings/procedures',
  '/settings/profile',
] as const;

export type MainRoute = (typeof MAIN_ROUTES)[number];
