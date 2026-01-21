#!/usr/bin/env python3
"""
i18n Missing Keys Checker
Finds translation keys used in code that don't exist in pt.json

Usage:
    python3 src/config/translations/check_missing_keys.py
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

CODE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}


def load_valid_keys() -> Set[str]:
    """Load all valid translation keys from pt.json"""
    pt_file = TRANSLATIONS_DIR / "pt.json"
    with open(pt_file, 'r', encoding='utf-8') as f:
        return set(json.load(f).keys())


def is_valid_translation_key(key: str) -> bool:
    """Check if a string looks like a valid translation key"""
    # Skip empty or very short strings
    if not key or len(key) < 2:
        return False
    
    # Skip single characters or symbols
    if len(key) == 1:
        return False
    
    # Skip common non-translation strings
    invalid_patterns = {
        '/', '?', ',', '-', ' ', 'a', 'leaflet', 'web-vitals', 
        'content-type', 'pt-BR', 'animate', 'normal'
    }
    if key in invalid_patterns:
        return False
    
    # Valid translation keys usually:
    # 1. Contain dots (e.g., 'user.name', 'button.save')
    # 2. Are longer alphanumeric strings with underscores/hyphens (e.g., 'save_button', 'user-profile')
    # 3. Have multiple words separated by dots, underscores, or hyphens
    
    # Accept if contains dot (common pattern)
    if '.' in key:
        return True
    
    # Accept if it's a longer alphanumeric string (likely a translation key)
    # Remove underscores and hyphens for checking
    clean_key = key.replace('_', '').replace('-', '')
    if len(clean_key) >= 4 and clean_key.isalnum():
        return True
    
    return False


def find_translation_calls(content: str) -> List[tuple]:
    """Find all translation function calls in content"""
    # Pattern to match t('key'), $t('key'), i18n.t('key')
    # Using negative lookbehind to avoid matching i18n.t separately
    pattern = r"(?<!i18n\.)(?:\$t|t)\(['\"]([^'\"]+)['\"]\)"
    
    matches = []
    for match in re.finditer(pattern, content):
        key = match.group(1)
        # Only include keys that look like valid translation keys
        if is_valid_translation_key(key):
            line_num = content[:match.start()].count('\n') + 1
            matches.append((key, line_num))
    
    return matches


def check_missing_keys() -> Dict[str, List[Dict]]:
    """Check for translation keys used in code that don't exist in pt.json"""
    print("🔍 Checking for missing translation keys...\n")
    
    valid_keys = load_valid_keys()
    print(f"📚 Loaded {len(valid_keys)} valid keys from pt.json")
    
    missing_keys = defaultdict(list)
    files_checked = 0
    total_calls = 0
    
    # Scan all code files
    for ext in CODE_EXTENSIONS:
        for file_path in SRC_DIR.rglob(f"*{ext}"):
            files_checked += 1
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find all translation calls
                calls = find_translation_calls(content)
                total_calls += len(calls)
                
                # Check each key
                for key, line_num in calls:
                    if key not in valid_keys:
                        missing_keys[key].append({
                            'file': str(file_path.relative_to(PROJECT_ROOT)),
                            'line': line_num
                        })
            except Exception as e:
                pass  # Skip files that can't be read
    
    print(f"📊 Scanned {files_checked} files")
    print(f"🔎 Found {total_calls} translation calls\n")
    
    return missing_keys


def generate_report(missing_keys: Dict[str, List[Dict]], output_file: Path):
    """Generate a detailed report file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 70 + "\n")
        f.write("i18n Missing Translation Keys Report\n")
        f.write("=" * 70 + "\n\n")
        
        if not missing_keys:
            f.write("✅ All translation keys exist in pt.json!\n")
            return
        
        f.write(f"Total missing keys: {len(missing_keys)}\n\n")
        
        # Sort by number of occurrences (descending)
        sorted_keys = sorted(missing_keys.items(), key=lambda x: len(x[1]), reverse=True)
        
        for key, occurrences in sorted_keys:
            f.write(f"🔑 '{key}' - {len(occurrences)} occurrence(s)\n")
            for occ in occurrences:
                f.write(f"   └─ {occ['file']}:{occ['line']}\n")
            f.write("\n")
        
        f.write("=" * 70 + "\n")
        f.write("💡 Tip: Add these keys to pt.json, en.json, and es.json\n")


def print_results(missing_keys: Dict[str, List[Dict]]):
    """Print the results in a readable format"""
    if not missing_keys:
        print("✅ All translation keys exist in pt.json!")
        return
    
    print("=" * 70)
    print(f"❌ Found {len(missing_keys)} missing translation keys:\n")
    
    # Sort by number of occurrences (descending)
    sorted_keys = sorted(missing_keys.items(), key=lambda x: len(x[1]), reverse=True)
    
    for key, occurrences in sorted_keys[:20]:  # Show top 20
        print(f"🔑 '{key}' - {len(occurrences)} occurrence(s)")
        for occ in occurrences[:3]:  # Show first 3 occurrences
            print(f"   └─ {occ['file']}:{occ['line']}")
        if len(occurrences) > 3:
            print(f"   └─ ... and {len(occurrences) - 3} more")
        print()
    
    if len(missing_keys) > 20:
        print(f"... and {len(missing_keys) - 20} more missing keys")
    
    print("=" * 70)
    print("\n💡 Tip: Add these keys to pt.json, en.json, and es.json")


def main():
    print("🌍 i18n Missing Keys Checker\n")
    print("=" * 70)
    
    missing_keys = check_missing_keys()
    print_results(missing_keys)
    
    # Generate report file
    report_file = PROJECT_ROOT / "missing_keys_report.txt"
    generate_report(missing_keys, report_file)
    
    if missing_keys:
        print(f"\n📄 Detailed report saved to: {report_file}")
    
    # Return exit code
    return 1 if missing_keys else 0


if __name__ == "__main__":
    exit(main())
