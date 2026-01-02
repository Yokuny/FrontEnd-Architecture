import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLocale } from '@/hooks/use-locale';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { LANGUAGE_NAMES, LANGUAGES } from '@/lib/constants/select-options';

const availableLocales = LANGUAGES.map((l) => l.value);

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const { setMenuOpen } = useSidebarToggle();

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Languages className="size-5 text-muted-foreground" />
          <span className="sr-only">{t('login.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLocales.map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => setLocale(lang)} className={locale === lang ? 'bg-accent' : ''}>
            {LANGUAGE_NAMES[lang]}
            {locale === lang && ' ✓'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
