import { Languages } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { LANGUAGES, type LanguageOption } from '@/lib/constants/select-options';

export function LanguageFormSelect(props: LanguageFormSelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label, placeholder, value, onChange } = props;
  const id = useId();

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

  const displayLabel = label || t('language');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Languages className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<LanguageOption, LanguageOption>
        id={id}
        placeholder={placeholder || t('language')}
        value={value}
        onChange={(val) => onChange?.(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
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
