import { DataSelect } from '@/components/ui/data-select';
import { LANGUAGES, type LanguageOption } from '@/lib/constants/select-options';

export function LanguageFormSelect(props: LanguageFormSelectProps) {
  const { disabled = false, className, label, placeholder, value, onChange } = props;

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

  return (
    <DataSelect<LanguageOption, LanguageOption>
      label={label || 'Idioma'}
      placeholder={placeholder || 'Selecione o idioma...'}
      value={value}
      onChange={(val) => onChange?.(val as string)}
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled}
      clearable={false}
      searchPlaceholder="Buscar idioma..."
      className={className}
    />
  );
}

interface LanguageFormSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
