# 📝 Páginas Faltantes (26 páginas)

## Status: 76/102 documentadas (74.5%)

## 🔴 Páginas sem staticData

### CMMS (3 páginas)
1. ✗ `src/routes/_private/cmms/diagram-list/index.tsx`
2. ✗ `src/routes/_private/cmms/filled-form-cmms/index.tsx`
3. ✗ `src/routes/_private/cmms/kpis-cmms/index.tsx` (redirect page)

### Contracts (5 páginas)
1. ✗ `src/routes/_private/contracts/contract-list/index.tsx`
2. ✗ `src/routes/_private/contracts/dashboard-rve-rdo/index.tsx`
3. ✗ `src/routes/_private/contracts/dashboard-rve-sounding/index.tsx`
4. ✗ `src/routes/_private/contracts/dashboard-rve/index.tsx`
5. ✗ `src/routes/_private/contracts/index.tsx` (hub)

### Statistics (6 páginas)
1. ✗ `src/routes/_private/statistics/index.tsx` (hub)
2. ✗ `src/routes/_private/statistics/integration/index.tsx`
3. ✗ `src/routes/_private/statistics/kpis-cmms/index.tsx`
4. ✗ `src/routes/_private/statistics/rve-dashboard/index.tsx`
5. ✗ `src/routes/_private/statistics/time-operation/index.tsx`
6. ✗ `src/routes/_private/statistics/tracking-activity/index.tsx`

### Telemetry (12 páginas)
1. ✗ `src/routes/_private/telemetry/buoys-dwell-time/index.tsx`
2. ✗ `src/routes/_private/telemetry/datalogger/index.tsx`
3. ✗ `src/routes/_private/telemetry/diagram-list/index.tsx`
4. ✗ `src/routes/_private/telemetry/download-data-asset-request/index.tsx`
5. ✗ `src/routes/_private/telemetry/fleet-panel/index.tsx`
6. ✗ `src/routes/_private/telemetry/heatmap-fleet/index.tsx`
7. ✗ `src/routes/_private/telemetry/heatmap-panel/index.tsx`
8. ✗ `src/routes/_private/telemetry/index.tsx` (hub)
9. ✗ `src/routes/_private/telemetry/list-dashboard/index.tsx`
10. ✗ `src/routes/_private/telemetry/performance/index.tsx`
11. ✗ `src/routes/_private/telemetry/remote-ihm/index.tsx`
12. ✗ `src/routes/_private/telemetry/sensor-min-max/index.tsx`

## 💡 Estratégia para Completar

### Opção 1: Aguardar Reset do Rate Limit
- Rate limit reseta às **3am (America/Sao_Paulo)**
- Depois executar novos agentes para Telemetry e Statistics

### Opção 2: Documentação Manual
Use o snippet VSCode e o guia rápido:

```bash
# 1. Abrir arquivo no VSCode
# 2. Digitar: staticData + Tab
# 3. Preencher template
# 4. Formatar: pnpm run format
```

### Opção 3: Híbrida (Recomendado)
1. Documentar manualmente as páginas mais simples (CMMS, Contracts hub)
2. Aguardar reset para Telemetry e Statistics (módulos maiores)

## 📋 Template Rápido

```typescript
export const Route = createFileRoute('/_private/module/page/')({
  staticData: {
    title: 'module.page',
    description: 'Descrição em português da funcionalidade',
    tags: ['tag-pt', 'tag-en', 'category'],
    examplePrompts: [
      'Exemplo 1',
      'Exemplo 2',
      'Exemplo 3',
    ],
    relatedRoutes: [
      { path: '/_private/module', relation: 'parent', description: 'Hub do módulo' },
    ],
    entities: ['Entity1'],
    capabilities: ['Funcionalidade 1', 'Funcionalidade 2'],
  },
  component: ComponentName,
});
```

## ⏱️ Estimativa de Tempo

- **CMMS** (3): ~15 minutos
- **Contracts** (5): ~25 minutos
- **Statistics** (6): ~30 minutos
- **Telemetry** (12): ~60 minutos

**Total manual**: ~2 horas para completar 100%

## 🎯 Prioridade Sugerida

1. **Alta**: Contracts (hub comercial importante)
2. **Média**: CMMS (poucas páginas, rápido)
3. **Baixa**: Statistics e Telemetry (aguardar rate limit)
