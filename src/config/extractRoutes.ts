/**
 * Script para extrair rotas do routeTree.gen.ts
 *
 * Uso: npx tsx src/config/extract-routes.ts
 *
 * Este script lê o arquivo routeTree.gen.ts e extrai as rotas privadas
 * para atualizar o MAIN_ROUTES em routeConfig.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTE_TREE_PATH = path.resolve(__dirname, '../routeTree.gen.ts');
const ROUTE_CONFIG_PATH = path.resolve(__dirname, './routeConfig.ts');

// Padrões de rotas a ignorar (edição, parâmetros, etc)
const IGNORED_PATTERNS = [
  /\/add$/,
  /\/\$\w+$/, // Rotas com parâmetros ($id, $slug, etc)
  /\/edit\//,
  /\/password\//,
  /\/enterprises\//,
  /\/users\/\$id/,
  /\/permissions\/add$/,
];

// Rotas públicas a ignorar
const PUBLIC_ROUTES = ['/', '/auth', '/auth/register', '/auth/reset-password', '/auth/unlock'];

function extractRoutes(): string[] {
  // Ler o arquivo routeTree.gen.ts
  const content = fs.readFileSync(ROUTE_TREE_PATH, 'utf-8');

  // Regex para extrair rotas do FileRoutesByFullPath
  const regex = /'([^']+)':\s*typeof\s+\w+;/g;
  const routes: string[] = [];

  // Encontrar a seção FileRoutesByFullPath
  const sectionMatch = content.match(/export interface FileRoutesByFullPath \{([\s\S]*?)\}/);
  if (!sectionMatch) {
    console.error('❌ Não foi possível encontrar FileRoutesByFullPath');
    return [];
  }

  const section = sectionMatch[1];

  // Extrair cada rota usando matchAll (evita assignment em expressão)
  for (const match of section.matchAll(regex)) {
    const route = match[1];

    // Ignorar rotas públicas
    if (PUBLIC_ROUTES.includes(route)) continue;

    // Ignorar rotas que matcham os padrões ignorados
    if (IGNORED_PATTERNS.some((pattern) => pattern.test(route))) continue;

    routes.push(route);
  }

  return routes.sort();
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
    // Se não existir, adiciona no final
    content += `\n\n${newMainRoutes}\n`;
  }

  fs.writeFileSync(ROUTE_CONFIG_PATH, content);
  console.log('✅ routeConfig.ts atualizado com sucesso!');
  console.log(`📍 ${routes.length} rotas extraídas:`);
  routes.forEach((r) => {
    console.log(`   ${r}`);
  });
}

// Executar
console.log('🔍 Extraindo rotas de routeTree.gen.ts...\n');
const routes = extractRoutes();

if (routes.length > 0) {
  updateRouteConfig(routes);
} else {
  console.error('❌ Nenhuma rota encontrada');
}
