import { Anchor } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Label } from '@/components/ui/label';
import { useMinMaxVessels } from '@/hooks/use-alerts-api';

interface MinMaxVesselSelectProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MinMaxVesselSelect({ idEnterprise, disabled, className, value, onChange, placeholder }: MinMaxVesselSelectProps) {
  const { t } = useTranslation();
  const id = useId();
  const query = useMinMaxVessels(idEnterprise);

  const mapToOptions = (data: any[]) => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        value: item.id,
        label: item.vesselName || item.name || item.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        <Anchor className="size-4" />
        {t('min.max')}
      </Label>
      <DataMultiSelect
        id={id}
        placeholder={placeholder || t('minmax.select.placeholder')}
        value={value}
        onChange={(vals) => onChange(vals as string[])}
        query={query}
        mapToOptions={mapToOptions}
        disabled={disabled || !idEnterprise}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={!idEnterprise ? t('select.enterprise.first') : t('minmax.no.vessels')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}
