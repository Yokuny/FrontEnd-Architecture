import { User } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type FasPlanner, mapFasPlannersToOptions, useFasPlannersSelect } from '@/hooks/use-fas-planners-api';

export function FasPlannerSelect(props: FasPlannerSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useFasPlannersSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('select.option');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <User className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<FasPlanner>
          id={id}
          placeholder={placeholder || t('select.option')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapFasPlannersToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('select.option');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <User className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<FasPlanner>
        id={id}
        placeholder={placeholder || t('select.option')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapFasPlannersToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface FasPlannerSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FasPlannerSelectSingleProps extends FasPlannerSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FasPlannerSelectMultiProps extends FasPlannerSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FasPlannerSelectProps = FasPlannerSelectSingleProps | FasPlannerSelectMultiProps;
