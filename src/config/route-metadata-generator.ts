import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Script para extrair metadados de rotas e gerar JSON para consumo externo
 *
 * Uso: pnpm run routes:ai
 */

interface RouteSearchParam {
  name: string;
  type: 'string' | 'date' | 'number' | 'boolean' | 'array';
  description: string;
  required?: boolean;
  example?: string;
}

interface RouteRelation {
  path: string;
  relation: 'parent' | 'child' | 'sibling' | 'alternative';
  description?: string;
}

interface RouteInfo {
  path: string;
  title?: string;
  description?: string;
  tags?: string[];
  examplePrompts?: string[];
  searchParams?: RouteSearchParam[];
  relatedRoutes?: RouteRelation[];
  entities?: string[];
  capabilities?: string[];
}

const ROUTES_DIR = path.join(process.cwd(), 'src/routes/_private');
const OUTPUT_FILE = path.join(process.cwd(), 'public/ai-routes.json');

function extractStaticData(filePath: string): RouteInfo | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const pathMatch = content.match(/createFileRoute\(['"]([^'"]+)['"]\)/);
    if (!pathMatch) return null;

    const routePath = pathMatch[1];
    if (!content.includes('staticData:')) return null;

    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    const descMatch = content.match(/description:\s*['"]([^'"]+)['"]/);

    const tagsMatch = content.match(/tags:\s*\[([^\]]+)\]/);
    const tags = tagsMatch
      ? tagsMatch[1]
          .split(',')
          .map((t) => t.trim().replace(/['"]/g, ''))
          .filter(Boolean)
      : undefined;

    const promptsMatch = content.match(/examplePrompts:\s*\[([\s\S]*?)\]/);
    const examplePrompts = promptsMatch
      ? promptsMatch[1]
          .split(',')
          .map((p) => p.trim().replace(/['"]/g, '').trim())
          .filter(Boolean)
      : undefined;

    const entitiesMatch = content.match(/entities:\s*\[([^\]]+)\]/);
    const entities = entitiesMatch
      ? entitiesMatch[1]
          .split(',')
          .map((e) => e.trim().replace(/['"]/g, ''))
          .filter(Boolean)
      : undefined;

    const capsMatch = content.match(/capabilities:\s*\[([^\]]+)\]/);
    const capabilities = capsMatch
      ? capsMatch[1]
          .split(',')
          .map((c) => c.trim().replace(/['"]/g, ''))
          .filter(Boolean)
      : undefined;

    const searchParams = extractSearchParams(content);
    const relatedRoutes = extractRelatedRoutes(content);

    const routeInfo: RouteInfo = { path: routePath };

    if (titleMatch) routeInfo.title = titleMatch[1];
    if (descMatch) routeInfo.description = descMatch[1];
    if (tags?.length) routeInfo.tags = tags;
    if (examplePrompts?.length) routeInfo.examplePrompts = examplePrompts;
    if (searchParams?.length) routeInfo.searchParams = searchParams;
    if (relatedRoutes?.length) routeInfo.relatedRoutes = relatedRoutes;
    if (entities?.length) routeInfo.entities = entities;
    if (capabilities?.length) routeInfo.capabilities = capabilities;

    return routeInfo;
  } catch {
    return null;
  }
}

function extractSearchParams(content: string): RouteSearchParam[] | undefined {
  const searchParamsMatch = content.match(/searchParams:\s*\[([\s\S]*?)\],\s*(?:relatedRoutes|entities|capabilities|\})/);
  if (!searchParamsMatch) return undefined;

  const params: RouteSearchParam[] = [];
  const paramBlocks = searchParamsMatch[1].match(/\{[^}]+\}/g);

  if (paramBlocks) {
    for (const block of paramBlocks) {
      const name = block.match(/name:\s*['"]([^'"]+)['"]/)?.[1];
      const type = block.match(/type:\s*['"]([^'"]+)['"]/)?.[1] as RouteSearchParam['type'];
      const description = block.match(/description:\s*['"]([^'"]+)['"]/)?.[1];
      const example = block.match(/example:\s*['"]([^'"]+)['"]/)?.[1];
      const required = block.includes('required: true');

      if (name && type && description) {
        params.push({ name, type, description, example, required: required || undefined });
      }
    }
  }

  return params;
}

function extractRelatedRoutes(content: string): RouteRelation[] | undefined {
  const relatedMatch = content.match(/relatedRoutes:\s*\[([\s\S]*?)\],\s*(?:entities|capabilities|\})/);
  if (!relatedMatch) return undefined;

  const routes: RouteRelation[] = [];
  const routeBlocks = relatedMatch[1].match(/\{[^}]+\}/g);

  if (routeBlocks) {
    for (const block of routeBlocks) {
      const routePath = block.match(/path:\s*['"]([^'"]+)['"]/)?.[1];
      const relation = block.match(/relation:\s*['"]([^'"]+)['"]/)?.[1] as RouteRelation['relation'];
      const description = block.match(/description:\s*['"]([^'"]+)['"]/)?.[1];

      if (routePath && relation) {
        routes.push({ path: routePath, relation, description });
      }
    }
  }

  return routes;
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.isFile() && entry.name === 'index.tsx') {
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  const routeFiles = walkDir(ROUTES_DIR);
  const routes: RouteInfo[] = [];

  for (const file of routeFiles) {
    const routeInfo = extractStaticData(file);
    if (routeInfo) routes.push(routeInfo);
  }

  routes.sort((a, b) => a.path.localeCompare(b.path));

  const output = {
    generatedAt: new Date().toISOString(),
    totalRoutes: routes.length,
    routes,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  process.stdout.write(`✅ Generated ai-routes.json with ${routes.length} routes\n`);
}

main();
