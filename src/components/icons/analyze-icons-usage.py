#!/usr/bin/env python3
"""
Analisa o uso dos Ícones no projeto.
Percorre src/components/icons/ e busca por usos de cada ícone em todo o codebase.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Diretório raiz do projeto (ajustado para src/components/icons/)
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
ICONS_DIR = PROJECT_ROOT / "src" / "components" / "icons"
SRC_DIR = PROJECT_ROOT / "src"

# Extensões de arquivo para buscar
EXTENSIONS = {".tsx", ".ts", ".jsx", ".js"}

# Arquivos/pastas para ignorar
IGNORE_PATTERNS = {"node_modules", ".git", "dist", "build", "__tests__", ".test.", ".spec."}


def get_icons():
    """Coleta todos os arquivos de ícones e seus nomes de export."""
    icons = {}

    for file_path in ICONS_DIR.glob("*.Icon.tsx"):
        if file_path.name.startswith("_"):
            continue

        icon_filename = file_path.name
        # O nome do ícone usado no projeto geralmente é o prefixo antes do .Icon
        # Ex: Back.Icon.tsx -> Back
        icon_name = icon_filename.replace(".Icon.tsx", "")
        
        content = file_path.read_text(encoding="utf-8")
        
        # Busca pelo nome interno do componente (ex: const IconBack = ...)
        # e pelo export default
        internal_match = re.search(r"const\s+(\w+)\s*=", content)
        internal_name = internal_match.group(1) if internal_match else None
        
        default_match = re.search(r"export default (\w+);", content)
        default_export_name = default_match.group(1) if default_match else None

        # Vamos monitorar ambos: o nome do arquivo (como costuma ser importado) 
        # e o nome do export real
        icons[icon_name] = {
            "file": icon_filename,
            "internal_names": list(set(filter(None, [icon_name, internal_name, default_export_name]))),
            "usages": [],
            "count": 0
        }

    return icons


def should_ignore(path: Path) -> bool:
    """Verifica se o arquivo deve ser ignorado."""
    path_str = str(path)
    return any(pattern in path_str for pattern in IGNORE_PATTERNS)


def find_usages(icons: dict):
    """Busca por usos de cada ícone no codebase."""

    for file_path in SRC_DIR.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix not in EXTENSIONS:
            continue
        if should_ignore(file_path):
            continue
        # Ignora os próprios arquivos da pasta de ícones
        if file_path.parent == ICONS_DIR:
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
        except Exception:
            continue

        relative_path = file_path.relative_to(PROJECT_ROOT)

        for icon_key, data in icons.items():
            found_in_file = 0
            
            # Verifica se o ícone é importado neste arquivo
            # Import patterns: 
            # import Name from '@/components/icons/Name.Icon'
            # import { Name } from ...
            # import Name from '../icons/Name.Icon'
            import_pattern = rf"from\s+['\"].*\/icons\/{icon_key}(?:\.Icon)?['\"]"
            if not re.search(import_pattern, content):
                continue

            # Se for importado, buscamos os usos dos nomes possíveis
            for name in data["internal_names"]:
                # Busca por uso como componente JSX: <Name ou </Name
                jsx_pattern = rf"<{name}[\s/>]|</{name}>"
                # Busca por uso em objetos ou variáveis: { icon: Name }
                var_pattern = rf"\b{name}\b"
                
                # Para evitar contar o próprio import como uso de JSX, usamos uma abordagem cautelosa
                jsx_matches = re.findall(jsx_pattern, content)
                
                # Se não houver JSX, procuramos por uso como variável (ex: icon={Back})
                if not jsx_matches:
                    # Filtra o nome se ele aparecer apenas no import
                    # Buscamos palavras isoladas que não sejam parte do 'import ... from'
                    all_refs = re.findall(var_pattern, content)
                    # Subtrai 1 se o nome estiver no 'import Name from'
                    import_name_pattern = rf"import\s+({name}|\{{[^}}]*\b{name}\b[^}}]*\}})\s+from"
                    if re.search(import_name_pattern, content):
                        found_in_file += max(0, len(all_refs) - 1)
                else:
                    found_in_file += len(jsx_matches)

            if found_in_file > 0:
                icons[icon_key]["usages"].append({
                    "file": str(relative_path),
                    "count": found_in_file
                })
                icons[icon_key]["count"] += found_in_file


def print_report(icons: dict):
    """Imprime o relatório de uso."""

    all_items = sorted(icons.items(), key=lambda x: x[1]["count"], reverse=True)
    used = [(name, data) for name, data in all_items if data["count"] > 0]
    unused = [(name, data) for name, data in all_items if data["count"] == 0]

    print("=" * 70)
    print("📊 RELATÓRIO DE USO DOS ÍCONES")
    print("=" * 70)

    print(f"\n📈 Total de Ícones: {len(icons)}")
    print(f"✅ Em uso: {len(used)}")
    print(f"⚠️  Sem uso: {len(unused)}")

    # Top 20 mais usados
    print("\n" + "-" * 70)
    print("🏆 TOP 20 ÍCONES MAIS USADOS")
    print("-" * 70)

    for i, (name, data) in enumerate(used[:20], 1):
        print(f"{i:2}. {name:<35} {data['count']:>4} usos  ({data['file']})")

    # Ícones sem uso
    print("\n" + "-" * 70)
    print(f"⚠️  ÍCONES SEM USO ({len(unused)})")
    print("-" * 70)

    if unused:
        # Agrupa por ordem alfabética
        unused_names = sorted([data['file'] for name, data in unused])
        for i in range(0, len(unused_names), 3):
            print("   " + ", ".join(unused_names[i:i+3]))

    # Resumo final
    print("\n" + "=" * 70)
    print("📋 RESUMO")
    print("=" * 70)
    if len(icons) > 0:
        print(f"Total ícones: {len(icons)}")
        print(f"Em uso: {len(used)} ({len(used)/len(icons)*100:.1f}%)")
        print(f"Sem uso: {len(unused)} ({len(unused)/len(icons)*100:.1f}%)")


def export_csv(icons: dict):
    """Exporta os dados para CSV."""
    csv_path = ICONS_DIR / "icons-usage-report.csv"

    with open(csv_path, "w", encoding="utf-8") as f:
        f.write("Icon,File,UsageCount,UsedInFiles\n")

        for name, data in sorted(icons.items(), key=lambda x: x[1]["count"], reverse=True):
            files = "; ".join([u["file"] for u in data["usages"][:10]])
            if len(data["usages"]) > 10:
                files += f"; ... +{len(data['usages']) - 10} more"
            f.write(f"{name},{data['file']},{data['count']},\"{files}\"\n")

    print(f"\n📄 Relatório CSV exportado: {csv_path.relative_to(PROJECT_ROOT)}")


def main():
    print("🔍 Analisando uso dos ícones...\n")

    # Coleta os ícones
    icons = get_icons()
    print(f"Encontrados {len(icons)} arquivos de ícones em {ICONS_DIR.relative_to(PROJECT_ROOT)}")

    # Busca usos
    print("Buscando usos no codebase...")
    find_usages(icons)

    # Imprime relatório
    print_report(icons)

    # Exporta CSV
    export_csv(icons)


if __name__ == "__main__":
    main()
