import { Globe } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Locale, useLocale } from "@/hooks/use-locale";

const languageNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

const availableLocales: Locale[] = ["en", "es", "pt"];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="sr-only">
            <FormattedMessage id="login.language" defaultMessage="Change language" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLocales.map((lang) => (
          <DropdownMenuItem key={lang} onClick={() => setLocale(lang)} className={locale === lang ? "bg-accent" : ""}>
            {languageNames[lang]}
            {locale === lang && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
