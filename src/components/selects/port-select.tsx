import { Anchor } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPortsToOptions, type Port, usePortsSelect } from '@/hooks/use-ports-api';

/**
 * PortSelect Component
 *
 * Fetches and displays ports.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function PortSelect(props: PortSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = usePortsSelect();

  if (mode === 'multi') {
    const displayLabel = label || t('port.placeholder');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Anchor className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Port, Port>
          id={id}
          placeholder={placeholder || t('port.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapPortsToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('port.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Anchor className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Port, Port>
        id={id}
        placeholder={placeholder || t('port.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapPortsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface PortSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface PortSelectSingleProps extends PortSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface PortSelectMultiProps extends PortSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type PortSelectProps = PortSelectSingleProps | PortSelectMultiProps;
