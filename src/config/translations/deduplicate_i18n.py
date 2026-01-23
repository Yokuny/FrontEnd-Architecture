#!/usr/bin/env python3
"""
i18n Translation Deduplication Script
Removes duplicate translation keys and updates code references

Usage:
    python3 deduplicate_i18n.py              # Run full deduplication
    python3 deduplicate_i18n.py --dry-run    # Preview changes without modifying files
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict
import argparse

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR  / "../../../"
TRANSLATIONS_DIR = PROJECT_ROOT / "src/config/translations"
SRC_DIR = PROJECT_ROOT / "src"
REFACTOR_MAP_FILE = PROJECT_ROOT / "mapa_refatoracao.json"
REPLACEMENT_LOG_FILE = PROJECT_ROOT / "refactoring_log.txt"

# File extensions to search for code refactoring
CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}

# Translation function patterns to search for
TRANSLATION_PATTERNS = [
    r"t\(['\"]({key})['\"]\)",           # t('key') or t("key")
    r"\$t\(['\"]({key})['\"]\)",         # $t('key') or $t("key")
    r"i18n\.t\(['\"]({key})['\"]\)",     # i18n.t('key') or i18n.t("key")
]


def analyze_duplicates(reference_file: Path) -> Dict[str, str]:
    """
    Analyze pt.json and create refactoring map
    Returns: { duplicate_key: official_key }
    """
    print(f"  📖 Reading {reference_file.name}...")
    
    with open(reference_file, 'r', encoding='utf-8') as f:
        translations = json.load(f)
    
    # Create reverse mapping: value -> [keys]
    value_to_keys = defaultdict(list)
    for key, value in translations.items():
        value_to_keys[value].append(key)
    
    # Find duplicates and create refactoring map
    refactor_map = {}
    duplicate_count = 0
    
    for value, keys in value_to_keys.items():
        if len(keys) > 1:
            # First key is the official one
            official_key = keys[0]
            
            # All others are duplicates
            for duplicate_key in keys[1:]:
                refactor_map[duplicate_key] = official_key
                duplicate_count += 1
    
    print(f"  ✅ Found {len(value_to_keys)} unique values")
    print(f"  ✅ Identified {duplicate_count} duplicate keys")
    print(f"  ✅ Created {len(refactor_map)} refactoring mappings")
    
    return refactor_map


def clean_translation_files(refactor_map: Dict[str, str], dry_run: bool = False) -> None:
    """Remove duplicate keys from all translation files"""
    translation_files = [
        TRANSLATIONS_DIR / "pt.json",
        TRANSLATIONS_DIR / "en.json",
        TRANSLATIONS_DIR / "es.json",
    ]
    
    for file_path in translation_files:
        if not file_path.exists():
            print(f"  ⚠️  {file_path.name} not found, skipping...")
            continue
        
        print(f"  📝 Processing {file_path.name}...")
        
        # Read current content
        with open(file_path, 'r', encoding='utf-8') as f:
            translations = json.load(f)
        
        original_count = len(translations)
        
        # Remove duplicate keys
        keys_to_remove = [key for key in refactor_map.keys() if key in translations]
        for key in keys_to_remove:
            del translations[key]
        
        removed_count = len(keys_to_remove)
        final_count = len(translations)
        
        print(f"    • Original keys: {original_count}")
        print(f"    • Removed: {removed_count}")
        print(f"    • Final keys: {final_count}")
        
        if not dry_run:
            # Write back with proper formatting
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(translations, f, ensure_ascii=False, indent=2, sort_keys=True)
            print(f"    ✅ Saved {file_path.name}")
        else:
            print(f"    🔍 [DRY RUN] Would save {file_path.name}")


def refactor_code_references(refactor_map: Dict[str, str], dry_run: bool = False) -> Tuple[int, int]:
    """
    Replace duplicate keys in code with official keys
    Returns: (files_modified, total_replacements)
    """
    files_modified = 0
    total_replacements = 0
    replacement_log = []
    
    # Find all code files
    code_files = []
    for ext in CODE_EXTENSIONS:
        code_files.extend(SRC_DIR.rglob(f"*{ext}"))
    
    print(f"  🔍 Scanning {len(code_files)} code files...")
    
    for file_path in code_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            file_replacements = 0
            
            # Process each duplicate key
            for duplicate_key, official_key in refactor_map.items():
                # Escape special regex characters in keys
                escaped_duplicate = re.escape(duplicate_key)
                
                # Try each translation pattern
                for pattern_template in TRANSLATION_PATTERNS:
                    pattern = pattern_template.replace("{key}", escaped_duplicate)
                    
                    # Find all matches
                    matches = list(re.finditer(pattern, content))
                    
                    if matches:
                        for match in matches:
                            # Preserve the quote style
                            original_call = match.group(0)
                            quote_char = "'" if "'" in original_call else '"'
                            
                            # Determine the function prefix
                            if original_call.startswith('$t'):
                                replacement = f'$t({quote_char}{official_key}{quote_char})'
                            elif original_call.startswith('i18n.t'):
                                replacement = f'i18n.t({quote_char}{official_key}{quote_char})'
                            else:
                                replacement = f't({quote_char}{official_key}{quote_char})'
                            
                            # Replace
                            content = content.replace(original_call, replacement, 1)
                            file_replacements += 1
                            
                            # Log the replacement
                            relative_path = file_path.relative_to(PROJECT_ROOT)
                            replacement_log.append(
                                f"{relative_path}:{match.start()} | {original_call} → {replacement}"
                            )
            
            # Save file if modified
            if content != original_content:
                files_modified += 1
                total_replacements += file_replacements
                
                if not dry_run:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"    ✅ {file_path.relative_to(PROJECT_ROOT)} ({file_replacements} replacements)")
                else:
                    print(f"    🔍 [DRY RUN] Would modify {file_path.relative_to(PROJECT_ROOT)} ({file_replacements} replacements)")
        
        except Exception as e:
            print(f"    ⚠️  Error processing {file_path.relative_to(PROJECT_ROOT)}: {e}")
    
    # Save replacement log
    if replacement_log and not dry_run:
        with open(REPLACEMENT_LOG_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(replacement_log))
        print(f"  📄 Replacement log saved to {REPLACEMENT_LOG_FILE.name}")
    
    return files_modified, total_replacements


def main():
    parser = argparse.ArgumentParser(description='Deduplicate i18n translation keys')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without modifying files')
    args = parser.parse_args()
    
    dry_run = args.dry_run
    
    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")
    
    print("🚀 Starting i18n deduplication process...\n")
    
    # Step 1: Analyze duplicates
    print("📊 Step 1: Analyzing duplicates in pt.json...")
    reference_file = TRANSLATIONS_DIR / "pt.json"
    
    if not reference_file.exists():
        print(f"❌ Error: {reference_file} not found!")
        sys.exit(1)
    
    refactor_map = analyze_duplicates(reference_file)
    
    if not refactor_map:
        print("\n✨ No duplicates found! Translation files are already clean.")
        sys.exit(0)
    
    # Save refactor map
    with open(REFACTOR_MAP_FILE, 'w', encoding='utf-8') as f:
        json.dump(refactor_map, f, ensure_ascii=False, indent=2, sort_keys=True)
    
    print(f"\n✅ Created refactoring map: {REFACTOR_MAP_FILE.name}")
    print(f"   Total duplicate keys to remove: {len(refactor_map)}\n")
    
    # Step 2: Clean translation files
    print("🧹 Step 2: Cleaning translation files...")
    clean_translation_files(refactor_map, dry_run)
    print()
    
    # Step 3: Refactor code
    print("🔧 Step 3: Refactoring code references...")
    files_modified, total_replacements = refactor_code_references(refactor_map, dry_run)
    
    print(f"\n  ✅ Modified {files_modified} files")
    print(f"  ✅ Made {total_replacements} replacements")
    print()

    # Summary
    print("=" * 60)
    if dry_run:
        print("🔍 DRY RUN COMPLETE - No files were modified")
        print("\nTo apply these changes, run:")
        print("  python deduplicate_i18n.py")
    else:
        print("✨ Deduplication process completed successfully!")
        print(f"\n📄 Review the refactoring map: {REFACTOR_MAP_FILE.name}")
        print(f"📄 Review the replacement log: {REPLACEMENT_LOG_FILE.name}")
        print("\n⚠️  Next steps:")
        print("  1. Review the changes with: git diff")
        print("  2. Test the application: pnpm run dev")
        print("  3. Commit if everything works correctly")
        print("  4. Run: python3 src/config/translations/validate_i18n.py")

    print("=" * 60)


if __name__ == "__main__":
    main()
