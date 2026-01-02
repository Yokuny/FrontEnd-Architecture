import { Ruler } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapScalesToOptions, type Scale, useScalesSelect } from '@/hooks/use-scales-api';

export function ScaleSelect(props: ScaleSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useScalesSelect();

  const noOptionsMessage = t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('scale');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Ruler className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Scale, Scale>
          id={id}
          placeholder={placeholder || t('scale')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapScalesToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('scale');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Ruler className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Scale, Scale>
        id={id}
        placeholder={placeholder || t('scale')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapScalesToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface ScaleSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface ScaleSelectSingleProps extends ScaleSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ScaleSelectMultiProps extends ScaleSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ScaleSelectProps = ScaleSelectSingleProps | ScaleSelectMultiProps;
