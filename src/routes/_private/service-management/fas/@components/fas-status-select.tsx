import { Activity } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Label } from '@/components/ui/label';

import { FAS_STATUS_LIST } from '../@consts/fas.consts';

interface FasStatusSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function FasStatusSelect({ value, onChange, placeholder, className }: FasStatusSelectProps) {
  const { t } = useTranslation();
  const id = useId();

  // Simulated query object for DataMultiSelect
  const query = {
    data: FAS_STATUS_LIST,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (data: string[]) => {
    return data
      .map((key) => ({
        value: key,
        label: t(key),
        data: key,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Activity className="size-4" />
        {t('status')}
      </Label>
      <DataMultiSelect<string>
        id={id}
        placeholder={placeholder || t('status')}
        value={value || []}
        onChange={(vals) => onChange(vals as string[])}
        query={query as any}
        mapToOptions={mapToOptions}
        className={className}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
      />
    </div>
  );
}
