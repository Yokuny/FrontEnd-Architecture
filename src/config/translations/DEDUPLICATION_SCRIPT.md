# Scripts de Gerenciamento de Traduções i18n

Este diretório contém três scripts Python para gerenciar e validar as traduções do projeto.

---

## 📚 Scripts Disponíveis

### 1. `deduplicate_i18n.py` - Deduplicação de Traduções

**Propósito**: Remove chaves de tradução duplicadas e atualiza as referências no código.

**Como funciona**:
1. Analisa `pt.json` e identifica valores duplicados
2. Para cada valor duplicado, mantém a primeira chave encontrada como "oficial"
3. Cria `mapa_refatoracao.json` com o mapeamento de chaves duplicadas → chave oficial
4. Remove as chaves duplicadas de `pt.json`, `en.json` e `es.json`
5. Atualiza automaticamente todas as referências no código (arquivos `.ts`, `.tsx`, `.js`, `.jsx`)

**Uso**:
```bash
# Preview (não modifica arquivos)
python3 src/config/translations/deduplicate_i18n.py --dry-run

# Executar deduplicação
python3 src/config/translations/deduplicate_i18n.py
```

**Arquivos gerados**:
- `mapa_refatoracao.json` - Mapeamento de chaves duplicadas
- `refactoring_log.txt` - Log detalhado de todas as substituições

---

### 2. `validate_i18n.py` - Validação de Traduções

**Propósito**: Valida a consistência dos arquivos de tradução após a deduplicação.

**Como funciona**:
1. ✅ Verifica se não há valores duplicados em `pt.json`
2. ✅ Confirma que todas as chaves duplicadas foram removidas
3. ✅ Verifica se o `mapa_refatoracao.json` está consistente
4. ⚠️ Busca por referências quebradas no código (chaves que não existem mais)

**Uso**:
```bash
python3 src/config/translations/validate_i18n.py
```

**Nota**: Este script pode reportar falsos positivos para strings literais como `'animate'`, `'normal'`, `'/'` que são usadas em outros contextos (não são chaves de tradução).

---

### 3. `check_missing_keys.py` - Verificação de Chaves Faltantes

**Propósito**: Encontra chaves de tradução usadas no código que não existem em `pt.json`.

**Como funciona**:
1. Carrega todas as chaves válidas de `pt.json`
2. Escaneia todos os arquivos do projeto (`.ts`, `.tsx`, `.js`, `.jsx`)
3. Busca por chamadas de tradução: `t('key')`, `$t('key')`
4. Lista todas as chaves usadas que não existem nos arquivos de tradução
5. Mostra os arquivos e linhas onde cada chave faltante é usada

**Uso**:
```bash
python3 src/config/translations/check_missing_keys.py
```