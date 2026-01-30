#!/usr/bin/env python3
"""
i18n Unused Keys Cleaner
Finds translation keys that are not used in the source code and removes them.

Usage:
    python3 remove_unused_i18n.py              # Remove unused keys
    python3 remove_unused_i18n.py --dry-run    # Preview keys to be removed
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set
from collections import defaultdict
import argparse

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR / "../../../"
TRANSLATIONS_DIR = PROJECT_ROOT / "src/config/translations"
SRC_DIR = PROJECT_ROOT / "src"

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}
TRANSLATION_FILES = ["pt.json", "en.json", "es.json"]

# Pattern to match t('key'), $t('key'), i18n.t('key')
# This is consistent with check_missing_keys.py
TRANSLATION_PATTERN = r"(?<!i18n\.)(?:\$t|t)\(['\"]([^'\"]+)['\"]\)"


def get_all_translation_keys() -> Set[str]:
    """Get the union of all keys from all translation files"""
    all_keys = set()
    for lang_file in TRANSLATION_FILES:
        file_path = TRANSLATIONS_DIR / lang_file
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    if isinstance(data, dict):
                        all_keys.update(data.keys())
                except Exception as e:
                    print(f"  ❌ Error reading {lang_file}: {e}")
    return all_keys


def find_used_keys_in_code() -> Set[str]:
    """Scan source code to find which keys are actually being used"""
    used_keys = set()
    files_checked = 0
    
    print(f"  🔍 Scanning source code in {SRC_DIR.relative_to(PROJECT_ROOT)}...")
    
    for ext in CODE_EXTENSIONS:
        for file_path in SRC_DIR.rglob(f"*{ext}"):
            files_checked += 1
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find all translation calls
                matches = re.findall(TRANSLATION_PATTERN, content)
                for key in matches:
                    used_keys.add(key)
                    
                # Also check for literal strings that might be keys but not in t()
                # (Optional: this could be too aggressive, but let's stick to the t() pattern 
                # as it's the standard in this project)
                
            except Exception:
                pass  # Skip files that can't be read
                
    print(f"  📊 Scanned {files_checked} code files")
    print(f"  🔎 Found {len(used_keys)} unique keys used in code")
    return used_keys


def remove_unused_keys(unused_keys: Set[str], dry_run: bool = False):
    """Remove unused keys from all translation files"""
    for lang_file in TRANSLATION_FILES:
        file_path = TRANSLATIONS_DIR / lang_file
        if not file_path.exists():
            continue
            
        print(f"  📝 Processing {lang_file}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            translations = json.load(f)
            
        original_count = len(translations)
        
        # Remove keys
        keys_to_remove = [k for k in unused_keys if k in translations]
        for k in keys_to_remove:
            del translations[k]
            
        removed_count = len(keys_to_remove)
        
        if removed_count > 0:
            if not dry_run:
                # Use alphabetical + length sort (as established in sort_i18n.py)
                sorted_keys = sorted(translations.keys(), key=lambda k: (len(k), k.lower()))
                sorted_translations = {k: translations[k] for k in sorted_keys}
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(sorted_translations, f, ensure_ascii=False, indent=2)
                print(f"    ✅ Removed {removed_count} unused keys (Remaining: {len(translations)})")
            else:
                print(f"    🔍 [DRY RUN] Would remove {removed_count} keys")
        else:
            print(f"    ✅ No unused keys found in this file")


def main():
    parser = argparse.ArgumentParser(description='Remove unused i18n translation keys')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without modifying files')
    args = parser.parse_args()
    
    dry_run = args.dry_run
    
    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")
        
    print("🚀 Starting i18n cleanup process...\n")
    
    # 1. Get all existing keys
    all_keys = get_all_translation_keys()
    print(f"📚 Total keys found in JSON files: {len(all_keys)}")
    
    if not all_keys:
        print("❌ No keys found in translation files. Exiting.")
        return
        
    # 2. Find which ones are used
    used_keys = find_used_keys_in_code()
    
    # 3. Identify unused keys
    unused_keys = all_keys - used_keys
    
    print(f"🗑️  Identified {len(unused_keys)} unused keys")
    if unused_keys:
        print("  📋 Examples of unused keys:")
        for k in sorted(list(unused_keys))[:20]:
            print(f"    • {k}")
    
    if not unused_keys:
        print("\n✨ Clean! All translation keys are in use.")
        return

    # 4. Remove them
    remove_unused_keys(unused_keys, dry_run)
    
    print("\n" + "=" * 60)
    if dry_run:
        print(f"🔍 DRY RUN COMPLETE - {len(unused_keys)} keys listed for removal")
    else:
        print(f"✨ Cleanup completed! Removed {len(unused_keys)} unused keys across files.")
        print("💡 Note: Keys were also re-sorted by length and alphabet.")
    print("=" * 60)


if __name__ == "__main__":
    main()
