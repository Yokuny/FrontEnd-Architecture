#!/usr/bin/env python3
"""
i18n Missing Keys Checker
Finds translation keys used in code that don't exist in pt.json.
Generates a report file "Chaves de tradução faltando.txt".
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR / "../../../"
TRANSLATIONS_DIR = PROJECT_ROOT / "src/config/translations"
SRC_DIR = PROJECT_ROOT / "src"
REPORT_FILE = PROJECT_ROOT / "Chaves de tradução faltando.txt"

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}

# Consistent pattern with other scripts
TRANSLATION_PATTERN = r"(?<!i18n\.)(?:\$t|t)\(['\"]([^'\"]+)['\"]\)"

# Keys to ignore (false positives)
IGNORED_KEYS = {
    'animate', 'normal', ',', '/', 'a', ' ', 'T', '?', 'leaflet', 
    'index', 'close', 'pt-BR', 'leaflet-draw', '\n', 'web-vitals', 
    '-', 'content-type', 'OPERATIONAL', 'm³', ':', 'admin', 
    '#3366ff', 'eof'
}


def is_valid_translation_key(key: str) -> bool:
    """Check if a string looks like a valid translation key"""
    if not key or len(key) < 2: return False
    # Basic rudimentary filtering
    if ' ' in key and len(key.split()) < 2: return False # Single word with space? unlikely
    return True


def check_missing_keys():
    print("🔍 Checking for missing translation keys...\n")
    
    # Load valid keys
    pt_file = TRANSLATIONS_DIR / "pt.json"
    if not pt_file.exists():
        print("❌ pt.json not found!")
        return

    with open(pt_file, 'r', encoding='utf-8') as f:
        valid_keys = set(json.load(f).keys())
    
    print(f"🚫 Ignoring {len(IGNORED_KEYS)} known false positives")
    print(f"📚 Loaded {len(valid_keys)} valid keys from pt.json")
    
    missing_occurrences = defaultdict(list)
    files_checked = 0
    
    # Scan code
    for ext in CODE_EXTENSIONS:
        for file_path in SRC_DIR.rglob(f"*{ext}"):
            files_checked += 1
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find occurrences
                matches = list(re.finditer(TRANSLATION_PATTERN, content))
                for match in matches:
                    key = match.group(1)
                    if key not in valid_keys and key not in IGNORED_KEYS:
                        line = content[:match.start()].count('\n') + 1
                        missing_occurrences[key].append(
                            f"{file_path.relative_to(PROJECT_ROOT)}:{line}"
                        )
            except Exception:
                pass

    print(f"📊 Scanned {files_checked} code files")
    
    # Generate Report
    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write("=" * 60 + "\n")
        f.write("RELATÓRIO DE CHAVES DE TRADUÇÃO FALTANDO\n")
        f.write(f"Base de comparação: pt.json\n")
        f.write("=" * 60 + "\n\n")
        
        if not missing_occurrences:
            f.write("✅ Nenhuma chave faltando! Tudo sincronizado.\n")
            print("\n✨ No missing keys found!")
        else:
            f.write(f"Total de chaves faltando: {len(missing_occurrences)}\n\n")
            
            # Sort by number of occurrences
            sorted_missing = sorted(missing_occurrences.items(), key=lambda x: len(x[1]), reverse=True)
            
            for key, locs in sorted_missing:
                f.write(f"🔑 '{key}' ({len(locs)} usos)\n")
                for loc in locs[:5]: # Cap at 5 examples per key in file to avoid huge files
                    f.write(f"   └─ {loc}\n")
                if len(locs) > 5:
                    f.write(f"   └─ ... e mais {len(locs)-5}\n")
                f.write("\n")
            
            print(f"\n❌ Found {len(missing_occurrences)} missing keys.")
            print(f"📄 Report saved to: {REPORT_FILE.name}")


if __name__ == "__main__":
    check_missing_keys()
