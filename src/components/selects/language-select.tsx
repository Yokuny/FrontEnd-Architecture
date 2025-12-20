import { toast } from 'sonner';
import { DataSelect } from '@/components/ui/data-select';
import { useUpdateUserLanguage } from '@/hooks/use-languages-api';
import { type Locale, useLocale } from '@/hooks/use-locale';
import { LANGUAGES, type LanguageOption } from '@/lib/constants/select-options';

export function LanguageSelect(props: LanguageSelectProps) {
  const { isSaveLanguage = false, disabled = false, className, label, placeholder } = props;

  const { locale, setLocale } = useLocale();
  const updateMutation = useUpdateUserLanguage();

  // Simulated query object
  const query = {
    data: LANGUAGES,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (languages: LanguageOption[]) => {
    return languages.map((lang) => ({
      value: lang.value,
      label: lang.label,
      data: lang,
    }));
  };

  const handleLanguageChange = (value: string | number | undefined) => {
    if (!value) return;

    const newLocale = value as Locale;

    // Update local state
    setLocale(newLocale);

    // Optional: Save to backend
    if (isSaveLanguage) {
      updateMutation.mutate(newLocale, {
        onSuccess: () => {
          toast.success('Idioma atualizado com sucesso!');
        },
        onError: () => {
          toast.error('Falha ao salvar preferência de idioma no servidor.');
        },
      });
    }

    props.onChange?.(newLocale);
  };

  return (
    <DataSelect<LanguageOption, LanguageOption>
      label={label || 'Idioma'}
      placeholder={placeholder || 'Selecione o idioma...'}
      value={locale}
      onChange={handleLanguageChange}
      // biome-ignore lint/suspicious/noExplicitAny: static query mapping
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled || updateMutation.isPending}
      clearable={false}
      searchPlaceholder="Buscar idioma..."
      className={className}
    />
  );
}

interface LanguageSelectProps {
  /** Should the language be saved to the backend? */
  isSaveLanguage?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  onChange?: (locale: Locale) => void;
}
