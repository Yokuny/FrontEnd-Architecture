#!/bin/bash

# Script para verificar progresso da documentação de páginas
# Uso: ./scripts/check-static-data.sh

echo "🔍 Verificando documentação de páginas (staticData)..."
echo ""

TOTAL=0
DOCUMENTED=0
MISSING=0

MISSING_FILES=()

for file in $(find src/routes/_private -type f -name "index.tsx" | sort); do
  TOTAL=$((TOTAL + 1))
  if grep -q "staticData:" "$file"; then
    DOCUMENTED=$((DOCUMENTED + 1))
    # echo "✓ $file"
  else
    MISSING=$((MISSING + 1))
    MISSING_FILES+=("$file")
  fi
done

PERCENTAGE=$(echo "scale=1; ($DOCUMENTED * 100) / $TOTAL" | bc)

echo "📊 Estatísticas:"
echo "   Total de páginas: $TOTAL"
echo "   Documentadas: $DOCUMENTED ($PERCENTAGE%)"
echo "   Faltantes: $MISSING"
echo ""

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
  echo "📝 Páginas sem documentação:"
  for file in "${MISSING_FILES[@]}"; do
    # Remove o prefixo src/routes/_private/ para facilitar leitura
    SHORT_PATH=$(echo "$file" | sed 's|src/routes/_private/||')
    echo "   ✗ $SHORT_PATH"
  done
  echo ""
fi

# Progresso visual
FILLED=$((DOCUMENTED * 50 / TOTAL))
EMPTY=$((50 - FILLED))
BAR=$(printf '█%.0s' $(seq 1 $FILLED))$(printf '░%.0s' $(seq 1 $EMPTY))

echo "📈 Progresso: [$BAR] $PERCENTAGE%"
echo ""

# Exit code baseado no status
if [ $MISSING -eq 0 ]; then
  echo "✅ Todas as páginas estão documentadas!"
  exit 0
else
  echo "⚠️  Ainda há $MISSING páginas para documentar."
  exit 1
fi
