#!/usr/bin/env python3
"""
Analisa o uso dos componentes Select no projeto.
Percorre src/components/selects/ e busca por usos em todo o codebase.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Diretório raiz do projeto
PROJECT_ROOT = Path(__file__).parent.parent
SELECTS_DIR = PROJECT_ROOT / "src" / "components" / "selects"
SRC_DIR = PROJECT_ROOT / "src"

# Extensões de arquivo para buscar
EXTENSIONS = {".tsx", ".ts", ".jsx", ".js"}

# Arquivos/pastas para ignorar
IGNORE_PATTERNS = {"node_modules", ".git", "dist", "build", "__tests__", ".test.", ".spec."}


def get_select_components():
    """Extrai os nomes dos componentes Select exportados."""
    selects = {}

    for file_path in SELECTS_DIR.glob("*.tsx"):
        if file_path.name == "index.ts" or file_path.name.endswith(".md"):
            continue

        content = file_path.read_text(encoding="utf-8")

        # Busca por exports de funções (export function ComponentName)
        matches = re.findall(r"export\s+function\s+(\w+Select)\s*\(", content)
        for match in matches:
            selects[match] = {
                "file": file_path.name,
                "usages": [],
                "count": 0
            }

    return selects


def should_ignore(path: Path) -> bool:
    """Verifica se o arquivo deve ser ignorado."""
    path_str = str(path)
    return any(pattern in path_str for pattern in IGNORE_PATTERNS)


def find_usages(selects: dict):
    """Busca por usos de cada Select no codebase."""

    for file_path in SRC_DIR.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in EXTENSIONS:
            continue
        if should_ignore(file_path):
            continue
        # Ignora os próprios arquivos de definição dos selects
        if SELECTS_DIR in file_path.parents or file_path.parent == SELECTS_DIR:
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
        except Exception:
            continue

        relative_path = file_path.relative_to(PROJECT_ROOT)

        for select_name in selects:
            # Busca por uso do componente (como tag JSX ou import)
            # Pattern: <SelectName ou import { SelectName
            pattern = rf"<{select_name}[\s/>]|import\s*\{{[^}}]*\b{select_name}\b"
            matches = re.findall(pattern, content)

            if matches:
                # Conta apenas usos como componente JSX, não imports
                jsx_pattern = rf"<{select_name}[\s/>]"
                jsx_matches = re.findall(jsx_pattern, content)
                usage_count = len(jsx_matches)

                if usage_count > 0:
                    selects[select_name]["usages"].append({
                        "file": str(relative_path),
                        "count": usage_count
                    })
                    selects[select_name]["count"] += usage_count


def print_report(selects: dict):
    """Imprime o relatório de uso."""

    # Ordena por contagem de uso (decrescente)
    sorted_selects = sorted(selects.items(), key=lambda x: x[1]["count"], reverse=True)

    used = [(name, data) for name, data in sorted_selects if data["count"] > 0]
    unused = [(name, data) for name, data in sorted_selects if data["count"] == 0]

    print("=" * 60)
    print("📊 RELATÓRIO DE USO DOS COMPONENTES SELECT")
    print("=" * 60)

    print(f"\n📈 Total de Selects: {len(selects)}")
    print(f"✅ Em uso: {len(used)}")
    print(f"⚠️  Sem uso: {len(unused)}")

    # Selects mais usados
    print("\n" + "-" * 60)
    print("🏆 TOP 10 MAIS USADOS")
    print("-" * 60)

    for i, (name, data) in enumerate(used[:10], 1):
        print(f"{i:2}. {name:<40} ({data['count']} usos)")

    # Todos os selects em uso
    print("\n" + "-" * 60)
    print("✅ SELECTS EM USO (ordenado por uso)")
    print("-" * 60)

    for name, data in used:
        print(f"\n{name} ({data['count']} usos) - {data['file']}")
        for usage in data["usages"][:5]:  # Mostra até 5 arquivos
            print(f"   └─ {usage['file']} ({usage['count']}x)")
        if len(data["usages"]) > 5:
            print(f"   └─ ... e mais {len(data['usages']) - 5} arquivos")

    # Selects não usados
    print("\n" + "-" * 60)
    print("⚠️  SELECTS SEM USO (candidatos a remoção)")
    print("-" * 60)

    if unused:
        for name, data in unused:
            print(f"   • {name:<40} ({data['file']})")
    else:
        print("   Nenhum select sem uso! 🎉")

    # Resumo final
    print("\n" + "=" * 60)
    print("📋 RESUMO")
    print("=" * 60)
    print(f"Total de componentes Select: {len(selects)}")
    print(f"Em uso: {len(used)} ({len(used)/len(selects)*100:.1f}%)")
    print(f"Sem uso: {len(unused)} ({len(unused)/len(selects)*100:.1f}%)")

    if unused:
        print(f"\n💡 Considere remover os {len(unused)} selects não utilizados.")


def export_csv(selects: dict):
    """Exporta os dados para CSV."""
    csv_path = PROJECT_ROOT / "scripts" / "selects-usage-report.csv"

    with open(csv_path, "w", encoding="utf-8") as f:
        f.write("Component,File,UsageCount,UsedInFiles\n")

        for name, data in sorted(selects.items(), key=lambda x: x[1]["count"], reverse=True):
            files = "; ".join([u["file"] for u in data["usages"]])
            f.write(f"{name},{data['file']},{data['count']},\"{files}\"\n")

    print(f"\n📄 Relatório CSV exportado: {csv_path}")


def main():
    print("🔍 Analisando uso dos componentes Select...\n")

    # Coleta os selects
    selects = get_select_components()
    print(f"Encontrados {len(selects)} componentes Select em {SELECTS_DIR.relative_to(PROJECT_ROOT)}")

    # Busca usos
    print("Buscando usos no codebase...")
    find_usages(selects)

    # Imprime relatório
    print_report(selects)

    # Exporta CSV
    export_csv(selects)


if __name__ == "__main__":
    main()
