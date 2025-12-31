import type { LucideIcon } from 'lucide-react';
import { Activity, Building2, CalendarClock, CheckSquare, KeySquare, Mail, MonitorCog, Network, NotebookPen, Shield, Users, Wrench } from 'lucide-react';

// Mapeamento de ícones por segmento de rota
export const ROUTE_ICONS: Record<string, LucideIcon> = {
  permissions: KeySquare,
  'set-up-company': MonitorCog,
  maintenance: Wrench,
  register: NotebookPen,
};

// Ícones para sub-rotas específicas
export const SUB_ROUTE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  roles: Shield,
  'setup-email': Mail,
  'setup-api-external': Network,
  'integration-list': Building2,
  'monitoring-plans': CalendarClock,
  'monitoring-wear': Activity,
  'list-os-done': CheckSquare,
  sensors: Activity,
};

// Chaves i18n para tradução de rotas
export const ROUTE_LABELS: Record<string, string> = {
  permissions: 'permissions',
  'set-up-company': 'setup.company',
  maintenance: 'maintenance',
  users: 'users',
  roles: 'role',
  'setup-email': 'setup.email',
  'setup-api-external': 'setup.api.external',
  'integration-list': 'integration',
  'monitoring-plans': 'monitoring.plan.maintenance',
  'monitoring-wear': 'monitoring.wear.part',
  'list-os-done': 'done.os',
};

/**
 * Lista de rotas principais da aplicação.
 * Esta lista é derivada do FileRoutesByFullPath gerado pelo TanStack Router.
 *
 * NOTA: Mantenha sincronizado com as rotas disponíveis no projeto.
 * Novas rotas adicionadas ao projeto aparecerão em routeTree.gen.ts.
 */
export const MAIN_ROUTES = [
  '/maintenance/list-os-done',
  '/maintenance/monitoring-plans',
  '/maintenance/monitoring-wear',
  '/permissions/roles',
  '/permissions/users',
  '/register/buoy',
  '/register/maintenance-plans',
  '/register/params',
  '/register/parts',
  '/register/platform',
  '/register/sensors',
  '/register/type-fuel',
  '/register/user-type',
  '/set-up-company/integration-list',
  '/set-up-company/setup-api-external',
  '/set-up-company/setup-email',
] as const;

export type MainRoute = (typeof MAIN_ROUTES)[number];
