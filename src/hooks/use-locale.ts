import { useIntl } from "react-intl";

/**
 * Hook to manage language/locale changes
 * @returns Object with current locale and function to change it
 */
export function useLocale() {
  const intl = useIntl();

  const changeLocale = (newLocale: string) => {
    const availableLocales = ["en", "es", "pt"];

    if (availableLocales.includes(newLocale)) {
      localStorage.setItem("language", newLocale);
      // Trigger storage event for cross-tab communication
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "language",
          newValue: newLocale,
        }),
      );
      // Reload to apply new locale
      window.location.reload();
    } else {
      console.warn(`Locale "${newLocale}" is not available. Available locales: ${availableLocales.join(", ")}`);
    }
  };

  return {
    locale: intl.locale,
    changeLocale,
    availableLocales: ["en", "es", "pt"] as const,
  };
}
