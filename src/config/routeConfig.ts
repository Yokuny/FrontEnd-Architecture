import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Bell,
  Building2,
  CalendarClock,
  CheckSquare,
  FileText,
  KeySquare,
  Mail,
  MapIcon,
  MapPin,
  MessageSquare,
  MonitorCog,
  Network,
  NotebookPen,
  Settings,
  Shield,
  Users,
  Variable,
  Wrench,
} from 'lucide-react';

// Mapeamento de ícones por segmento de rota
export const ROUTE_ICONS: Record<string, LucideIcon> = {
  permissions: KeySquare,
  'set-up-company': MonitorCog,
  maintenance: Wrench,
  register: NotebookPen,
  'fleet-manager': MapIcon,
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
  enterprises: Building2,
  alerts: Bell,
  contracts: FileText,
  'sensor-functions': Variable,
  'external-users': Users,
  'setup-chatbot': MessageSquare,
  'setup-fleet': MapPin,
  'setup-limits': Settings,
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
  alerts: 'alerts',
  contracts: 'contracts',
  'sensor-functions': 'sensor-functions',
  'external-users': 'usernames.external',
  'setup-chatbot': 'setup.chatbot',
  'setup-fleet': 'setup.fleet',
  'setup-limits': 'setup.limits',
  'fleet-manager': 'fleet.manager',
};

/**
 * Lista de rotas principais da aplicação.
 * Esta lista é derivada do FileRoutesByFullPath gerado pelo TanStack Router.
 *
 * NOTA: Mantenha sincronizado com as rotas disponíveis no projeto.
 * Novas rotas adicionadas ao projeto aparecerão em routeTree.gen.ts.
 */
export const MAIN_ROUTES = [
  '/fleet-manager/fleet',
  '/fleet-manager/wind',
  '/maintenance/list-os-done',
  '/maintenance/monitoring-plans',
  '/maintenance/monitoring-wear',
  '/permissions/roles',
  '/permissions/users',
  '/register/alerts',
  '/register/buoy',
  '/register/contracts',
  '/register/customers',
  '/register/enterprises',
  '/register/forms',
  '/register/geofences',
  '/register/machines',
  '/register/maintenance-plans',
  '/register/model-machine',
  '/register/params',
  '/register/parts',
  '/register/platform',
  '/register/sensor-functions',
  '/register/sensors',
  '/register/type-fuel',
  '/register/user-type',
  '/set-up-company/external-users',
  '/set-up-company/integration-list',
  '/set-up-company/setup-api-external',
  '/set-up-company/setup-chatbot',
  '/set-up-company/setup-email',
  '/set-up-company/setup-fleet',
  '/set-up-company/setup-limits',
] as const;

export type MainRoute = (typeof MAIN_ROUTES)[number];
