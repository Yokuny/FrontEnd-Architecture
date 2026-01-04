/**
 * Script para extrair rotas do routeTree.gen.ts
 *
 * Uso: npx tsx src/config/extractRoutes.ts
 *
 * Este script lê o arquivo routeTree.gen.ts e extrai as rotas privadas
 * para atualizar o MAIN_ROUTES em routeConfig.ts
 *
 * Estratégia: Extrai apenas a rota base de cada grupo e o primeiro nível de sub-rotas.
 * Exemplo: /permissions, /permissions/users, /permissions/roles
 * Ignora: /permissions/users/edit, /permissions/roles/$id
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTE_TREE_PATH = path.resolve(__dirname, '../routeTree.gen.ts');
const ROUTE_CONFIG_PATH = path.resolve(__dirname, './routeConfig.ts');

// Rotas públicas a ignorar
const PUBLIC_ROUTES = ['/', '/auth', '/auth/register', '/auth/reset-password', '/auth/unlock'];

/**
 * Extrai rotas do routeTree.gen.ts usando lógica de profundidade:
 * - Rota base do grupo (ex: /permissions)
 * - Primeiro nível de sub-rotas (ex: /permissions/users, /permissions/roles)
 * - Ignora segundo nível e rotas com parâmetros
 */
function extractRoutes(): string[] {
  const content = fs.readFileSync(ROUTE_TREE_PATH, 'utf-8');

  // Regex para extrair rotas do FileRoutesByFullPath
  const regex = /'([^']+)':\s*typeof\s+\w+;/g;
  const allRoutes: string[] = [];

  // Encontrar a seção FileRoutesByFullPath
  const sectionMatch = content.match(/export interface FileRoutesByFullPath \{([\s\S]*?)\}/);
  if (!sectionMatch) {
    return [];
  }

  const section = sectionMatch[1];

  // Extrair todas as rotas primeiro
  for (const match of section.matchAll(regex)) {
    const route = match[1];

    // Ignorar rotas públicas
    if (PUBLIC_ROUTES.includes(route)) continue;

    // Ignorar rotas com parâmetros ($id, $slug, etc)
    if (/\$\w+/.test(route)) continue;

    allRoutes.push(route);
  }

  // Agrupar rotas por segmento base
  const routeGroups = new Map<string, string[]>();

  for (const route of allRoutes) {
    const segments = route.split('/').filter(Boolean);
    if (segments.length === 0) continue;

    const baseSegment = segments[0];

    if (!routeGroups.has(baseSegment)) {
      routeGroups.set(baseSegment, []);
    }
    routeGroups.get(baseSegment)?.push(route);
  }

  // Extrair rotas válidas para a sidebar
  const filteredRoutes: string[] = [];

  for (const [baseSegment, routes] of routeGroups) {
    // Se a rota base é a única no grupo, incluí-la (ex: /fleet-manager)
    if (routes.length === 1 && routes[0] === `/${baseSegment}`) {
      filteredRoutes.push(routes[0]);
      continue;
    }

    // Se houver mais rotas, incluir apenas as de primeiro nível (ex: /permissions/users)
    for (const route of routes) {
      const segments = route.split('/').filter(Boolean);

      // Apenas primeiro nível de sub-rotas (2 segmentos)
      if (segments.length === 2) {
        filteredRoutes.push(route);
      }
    }
  }

  return filteredRoutes.sort();
}

function updateRouteConfig(routes: string[]): void {
  let content = fs.readFileSync(ROUTE_CONFIG_PATH, 'utf-8');

  // Gerar o novo array de rotas
  const routesArray = routes.map((r) => `  '${r}'`).join(',\n');
  const newMainRoutes = `export const MAIN_ROUTES = [\n${routesArray},\n] as const;`;

  // Substituir o MAIN_ROUTES existente
  const regex = /export const MAIN_ROUTES = \[[\s\S]*?\] as const;/;

  if (regex.test(content)) {
    content = content.replace(regex, newMainRoutes);
  } else {
    content += `\n\n${newMainRoutes}\n`;
  }

  fs.writeFileSync(ROUTE_CONFIG_PATH, content);
}

const routes = extractRoutes();

if (routes.length > 0) {
  updateRouteConfig(routes);
  // biome-ignore lint: CLI script output
  console.log('✓ MAIN_ROUTES atualizado com', routes.length, 'rotas:');
  for (const r of routes) {
    // biome-ignore lint: CLI script output
    console.log('  -', r);
  }
} else {
  // biome-ignore lint: CLI script output
  console.log('✗ Nenhuma rota encontrada');
}
