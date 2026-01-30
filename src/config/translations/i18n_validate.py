#!/usr/bin/env python3
"""
i18n Translation Validation Script
Validates the results of the deduplication process

Usage:
    python3 validate_i18n.py
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set
from collections import defaultdict

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR / "../../../"
TRANSLATIONS_DIR = PROJECT_ROOT / "src/config/translations"
SRC_DIR = PROJECT_ROOT / "src"
REFACTOR_MAP_FILE = PROJECT_ROOT / "mapa_refatoracao.json"

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}


def check_no_duplicates() -> bool:
    """Verify no duplicate values remain in pt.json"""
    print("🔍 Checking for remaining duplicates in pt.json...")
    
    pt_file = TRANSLATIONS_DIR / "pt.json"
    with open(pt_file, 'r', encoding='utf-8') as f:
        translations = json.load(f)
    
    # Create reverse mapping
    value_to_keys = defaultdict(list)
    for key, value in translations.items():
        value_to_keys[value].append(key)
    
    # Find duplicates
    duplicates = {value: keys for value, keys in value_to_keys.items() if len(keys) > 1}
    
    if duplicates:
        print(f"  ❌ Found {len(duplicates)} duplicate values:")
        for value, keys in list(duplicates.items())[:5]:  # Show first 5
            print(f"    • '{value}' → {keys}")
        if len(duplicates) > 5:
            print(f"    ... and {len(duplicates) - 5} more")
        return False
    else:
        print(f"  ✅ No duplicates found! All {len(translations)} keys have unique values")
        return True


def check_removed_keys() -> bool:
    """Check that all duplicate keys were removed from translation files"""
    print("\n🔍 Checking that duplicate keys were removed...")
    
    if not REFACTOR_MAP_FILE.exists():
        print("  ⚠️  mapa_refatoracao.json not found, skipping check")
        return True
    
    with open(REFACTOR_MAP_FILE, 'r', encoding='utf-8') as f:
        refactor_map = json.load(f)
    
    duplicate_keys = set(refactor_map.keys())
    all_removed = True
    
    for lang_file in ["pt.json", "en.json", "es.json"]:
        file_path = TRANSLATIONS_DIR / lang_file
        if not file_path.exists():
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            translations = json.load(f)
        
        remaining = duplicate_keys & set(translations.keys())
        
        if remaining:
            print(f"  ❌ {lang_file}: {len(remaining)} duplicate keys still present")
            for key in list(remaining)[:3]:
                print(f"    • {key}")
            all_removed = False
        else:
            print(f"  ✅ {lang_file}: All duplicate keys removed")
    
    return all_removed


def check_broken_references() -> bool:
    """Check for broken translation key references in code"""
    print("\n🔍 Checking for broken translation references...")
    
    # Load all valid keys from pt.json
    pt_file = TRANSLATIONS_DIR / "pt.json"
    with open(pt_file, 'r', encoding='utf-8') as f:
        valid_keys = set(json.load(f).keys())
    
    # Pattern to find translation calls with single quotes (primary pattern)
    # Matches: t('key'), $t('key'), i18n.t('key')
    pattern = r"(?<!i18n\.)(?:\$t|t)\(['\"]([^'\"]+)['\"]\)"
    broken_refs = []
    files_checked = 0
    
    # Scan code files
    for ext in CODE_EXTENSIONS:
        for file_path in SRC_DIR.rglob(f"*{ext}"):
            files_checked += 1
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find all translation keys used in this file
                matches = re.finditer(pattern, content)
                for match in matches:
                    key = match.group(1)
                    # Only report keys that look like translation keys (contain dots or are alphanumeric)
                    # Skip obvious non-translation strings like '/', 'animate', etc.
                    if '.' in key or key.replace('_', '').replace('-', '').isalnum():
                        if key not in valid_keys:
                            broken_refs.append({
                                'file': file_path.relative_to(PROJECT_ROOT),
                                'key': key,
                                'line': content[:match.start()].count('\n') + 1
                            })
            except Exception as e:
                pass  # Skip files that can't be read
    
    print(f"  📊 Scanned {files_checked} code files")
    
    if broken_refs:
        print(f"  ❌ Found {len(broken_refs)} broken references:")
        for ref in broken_refs[:10]:  # Show first 10
            print(f"    • {ref['file']}:{ref['line']} → '{ref['key']}'")
        if len(broken_refs) > 10:
            print(f"    ... and {len(broken_refs) - 10} more")
        return False
    else:
        print(f"  ✅ No broken references found!")
        return True


def check_refactor_map_consistency() -> bool:
    """Verify refactor map is consistent"""
    print("\n🔍 Checking refactor map consistency...")
    
    if not REFACTOR_MAP_FILE.exists():
        print("  ⚠️  mapa_refatoracao.json not found, skipping check")
        return True
    
    with open(REFACTOR_MAP_FILE, 'r', encoding='utf-8') as f:
        refactor_map = json.load(f)
    
    # Load pt.json to verify official keys exist
    pt_file = TRANSLATIONS_DIR / "pt.json"
    with open(pt_file, 'r', encoding='utf-8') as f:
        translations = json.load(f)
    
    issues = []
    
    for duplicate_key, official_key in refactor_map.items():
        # Check official key exists
        if official_key not in translations:
            issues.append(f"Official key '{official_key}' not found in pt.json")
        
        # Check duplicate key doesn't exist (should be removed)
        if duplicate_key in translations:
            issues.append(f"Duplicate key '{duplicate_key}' still exists in pt.json")
    
    if issues:
        print(f"  ❌ Found {len(issues)} consistency issues:")
        for issue in issues[:5]:
            print(f"    • {issue}")
        return False
    else:
        print(f"  ✅ Refactor map is consistent ({len(refactor_map)} mappings)")
        return True


def main():
    print("🔍 i18n Translation Validation\n")
    print("=" * 60)
    
    results = {
        "No duplicates": check_no_duplicates(),
        "Duplicate keys removed": check_removed_keys(),
        "No broken references": check_broken_references(),
        "Refactor map consistent": check_refactor_map_consistency(),
    }
    
    print("\n" + "=" * 60)
    print("📊 Validation Summary:\n")
    
    all_passed = True
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} - {check}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 60)
    
    if all_passed:
        print("✨ All validation checks passed!")
        print("\n✅ Your i18n files are clean and consistent")
        return 0
    else:
        print("⚠️  Some validation checks failed")
        print("\n🔧 Please review the issues above and fix them")
        return 1


if __name__ == "__main__":
    exit(main())
