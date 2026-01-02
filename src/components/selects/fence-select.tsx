import { MapPin } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Fence, mapFencesToOptions, useFencesSelect } from '@/hooks/use-fences-api';

export function FenceSelect(props: FenceSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, typeFence, notId, disabled = false, className, label, placeholder } = props;
  const id = useId();

  const query = useFencesSelect({
    idEnterprise,
    notId,
    typeFence,
  });

  const noOptionsMessage = !idEnterprise ? t('select.first.enterprise') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('fence.placeholder');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <MapPin className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Fence>
          id={id}
          placeholder={placeholder || t('fence.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapFencesToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('fence.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <MapPin className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Fence>
        id={id}
        placeholder={placeholder || t('fence.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapFencesToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface FenceSelectBaseProps {
  idEnterprise?: string;
  typeFence?: string;
  notId?: string[];
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FenceSelectSingleProps extends FenceSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FenceSelectMultiProps extends FenceSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FenceSelectProps = FenceSelectSingleProps | FenceSelectMultiProps;
