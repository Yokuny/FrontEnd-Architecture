import type { LucideIcon } from 'lucide-react';
import { Building2, KeySquare, Mail, MonitorCog, Network, Shield, Users } from 'lucide-react';

// Mapeamento de ícones por segmento de rota
export const ROUTE_ICONS: Record<string, LucideIcon> = {
  permissions: KeySquare,
  'set-up-company': MonitorCog,
};

// Ícones para sub-rotas específicas
export const SUB_ROUTE_ICONS: Record<string, LucideIcon> = {
  users: Users,
  roles: Shield,
  'setup-email': Mail,
  'setup-api-external': Network,
  'integration-list': Building2,
};

// Chaves i18n para tradução de rotas
export const ROUTE_LABELS: Record<string, string> = {
  permissions: 'permissions',
  'set-up-company': 'setup.company',
  users: 'users',
  roles: 'role',
  'setup-email': 'setup.email',
  'setup-api-external': 'setup.api.external',
  'integration-list': 'integration',
};

/**
 * Lista de rotas principais da aplicação.
 * Esta lista é derivada do FileRoutesByFullPath gerado pelo TanStack Router.
 *
 * NOTA: Mantenha sincronizado com as rotas disponíveis no projeto.
 * Novas rotas adicionadas ao projeto aparecerão em routeTree.gen.ts.
 */
export const MAIN_ROUTES = [
  '/permissions/roles',
  '/permissions/users',
  '/set-up-company/integration-list',
  '/set-up-company/setup-api-external',
  '/set-up-company/setup-email',
] as const;

export type MainRoute = (typeof MAIN_ROUTES)[number];
