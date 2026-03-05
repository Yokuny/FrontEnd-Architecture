export const ROUTE_ICONS: Record<string, React.ReactNode> = {};
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
  '/settings',
  '/settings/access',
  '/settings/clinic',
  '/settings/invite',
  '/settings/permissions',
  '/settings/procedures',
  '/settings/profile',
] as const;

export type MainRoute = (typeof MAIN_ROUTES)[number];
