#!/usr/bin/env python3
"""
i18n Translation Deduplication Script
Removes duplicate translation keys from pt.json and updates code references.
Uses pt.json as the source of truth.

Usage:
    python3 src/config/translations/i18n_deduplicate.py              # Run full deduplication
    python3 src/config/translations/i18n_deduplicate.py --dry-run    # Preview changes
"""

import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple
from collections import defaultdict
import argparse

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR / "../../../"
TRANSLATIONS_DIR = PROJECT_ROOT / "src/config/translations"
SRC_DIR = PROJECT_ROOT / "src"
REFACTOR_MAP_FILE = PROJECT_ROOT / "mapa_refatoracao.json"
REPLACEMENT_LOG_FILE = PROJECT_ROOT / "refactoring_log.txt"

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}

TRANSLATION_PATTERNS = [
    r"t\(['\"]({key})['\"]\)",           # t('key')
    r"\$t\(['\"]({key})['\"]\)",         # $t('key')
    r"i18n\.t\(['\"]({key})['\"]\)",     # i18n.t('key')
]


def analyze_duplicates() -> Dict[str, str]:
    """
    Analyze pt.json to find keys with identical values.
    Returns: { duplicate_key: official_key }
    """
    pt_file = TRANSLATIONS_DIR / "pt.json"
    print(f"  📖 Reading {pt_file.name}...")
    
    with open(pt_file, 'r', encoding='utf-8') as f:
        translations = json.load(f)
    
    # Reverse mapping: value -> [keys]
    value_to_keys = defaultdict(list)
    for key, value in translations.items():
        value_to_keys[value].append(key)
    
    refactor_map = {}
    duplicate_count = 0
    
    # Technical/False positive keys that should never be the 'official' key
    # or should even be forbidden from deduplication.
    TECHNICAL_KEYS = {'\\n', 'index', 'normal', 'alert', 'close'}

    for value, keys in value_to_keys.items():
        # NEVER deduplicate placeholder values
        if not value or value.strip() == "" or value == "TODO":
            continue

        if len(keys) > 1:
            # Filter out technical keys from being candidates for official_key
            candidates = [k for k in keys if k not in TECHNICAL_KEYS]
            if not candidates:
                # All keys for this value are technical? Just skip.
                continue

            # Sort keys to ensure deterministic selection (shortest key first)
            sorted_keys = sorted(candidates, key=lambda k: (len(k), k.lower()))
            
            official_key = sorted_keys[0]
            # All other keys (including technical ones if they happened to have this value)
            duplicates = [k for k in keys if k != official_key]
            
            for dup in duplicates:
                refactor_map[dup] = official_key
                duplicate_count += 1
                
    print(f"  ✅ Found {len(value_to_keys)} unique values in pt.json")
    print(f"  ✅ Identified {duplicate_count} duplicate keys to merge")
    
    return refactor_map


def clean_pt_json(refactor_map: Dict[str, str], dry_run: bool = False) -> None:
    """Remove duplicate keys ONLY from pt.json"""
    pt_file = TRANSLATIONS_DIR / "pt.json"
    
    print(f"  📝 Processing {pt_file.name}...")
    
    with open(pt_file, 'r', encoding='utf-8') as f:
        translations = json.load(f)
    
    original_count = len(translations)
    
    # Remove duplicates
    keys_to_remove = [key for key in refactor_map.keys() if key in translations]
    for key in keys_to_remove:
        del translations[key]
    
    # Sort (maintain order)
    sorted_keys = sorted(translations.keys(), key=lambda k: (len(k), k.lower()))
    sorted_translations = {k: translations[k] for k in sorted_keys}
    
    final_count = len(sorted_translations)
    
    print(f"    • Original keys: {original_count}")
    print(f"    • Removed: {len(keys_to_remove)}")
    print(f"    • Final keys: {final_count}")
    
    if not dry_run:
        with open(pt_file, 'w', encoding='utf-8') as f:
            json.dump(sorted_translations, f, ensure_ascii=False, indent=2)
        print(f"    ✅ Saved {pt_file.name}")
    else:
        print(f"    🔍 [DRY RUN] Would save {pt_file.name}")


def refactor_code_references(refactor_map: Dict[str, str], dry_run: bool = False) -> Tuple[int, int]:
    """Replace duplicate keys in code"""
    files_modified = 0
    total_replacements = 0
    replacement_log = []
    
    print(f"  🔍 Scanning code files in {SRC_DIR.relative_to(PROJECT_ROOT)}...")
    
    for ext in CODE_EXTENSIONS:
        for file_path in SRC_DIR.rglob(f"*{ext}"):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                file_replacements = 0
                
                # Check each duplicate key
                # Optimization: Check if file contains any interesting strings first?
                # For now, just iterate.
                
                for duplicate_key, official_key in refactor_map.items():
                    # Escape for regex
                    escaped_dup = re.escape(duplicate_key)
                    
                    for pattern_tmpl in TRANSLATION_PATTERNS:
                        pattern = pattern_tmpl.replace("{key}", escaped_dup)
                        
                        matches = list(re.finditer(pattern, content))
                        for match in matches:
                            original_call = match.group(0)
                            
                            # Determine replacement string
                            quote = "'" if "'" in original_call else '"'
                            
                            if '$t' in original_call:
                                replacement = f"$t({quote}{official_key}{quote})"
                            elif 'i18n.t' in original_call:
                                replacement = f"i18n.t({quote}{official_key}{quote})"
                            else:
                                replacement = f"t({quote}{official_key}{quote})"
                            
                            content = content.replace(original_call, replacement, 1)
                            file_replacements += 1
                            
                            replacement_log.append(
                                f"{file_path.relative_to(PROJECT_ROOT)}: {original_call} -> {replacement}"
                            )
                
                if content != original_content:
                    files_modified += 1
                    total_replacements += file_replacements
                    if not dry_run:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        # print(f"    ✅ Modified {file_path.name}")
            
            except Exception as e:
                print(f"    ⚠️  Error processing {file_path}: {e}")

    if replacement_log and not dry_run:
        with open(REPLACEMENT_LOG_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(replacement_log))
            
    return files_modified, total_replacements


def main():
    parser = argparse.ArgumentParser(description='Deduplicate i18n keys based on pt.json')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes')
    args = parser.parse_args()
    
    print("🚀 Starting i18n deduplication (Master: pt.json)...\n")
    
    # 1. Analyze
    refactor_map = analyze_duplicates()
    if not refactor_map:
        print("\n✨ No duplicates found in pt.json.")
        return

    # 2. Clean pt.json
    print("\n🧹 Cleaning pt.json...")
    clean_pt_json(refactor_map, args.dry_run)
    
    # 3. Refactor Code
    print("\n🔧 Refactoring code references...")
    files, replacements = refactor_code_references(refactor_map, args.dry_run)
    
    print(f"\n  ✅ Modified {files} files")
    print(f"  ✅ Made {replacements} replacements")
    
    if args.dry_run:
        print("\n🔍 DRY RUN COMPLETE")
    else:
        print("\n✨ Deduplication complete!")


if __name__ == "__main__":
    main()
