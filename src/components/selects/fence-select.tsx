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

  const displayLabel = label || t('fence.placeholder');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('fence.placeholder'),
    query,
    mapToOptions: mapFencesToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <MapPin className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<Fence> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<Fence> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable />
      )}
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
