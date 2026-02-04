import { Monitor } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPlatformsToOptions, type Platform, usePlatformsSelect } from '@/hooks/use-platforms-api';

export function PlatformEnterpriseSelect(props: PlatformEnterpriseSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = usePlatformsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const displayLabel = label || t('platforms.select.placeholder');

  const sharedProps = {
    id,
    placeholder: placeholder || t('platforms.select.placeholder'),
    query,
    mapToOptions: mapPlatformsToOptions,
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
          <Monitor className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<Platform, Platform> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<Platform, Platform> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
    </div>
  );
}

interface PlatformEnterpriseSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface PlatformEnterpriseSelectSingleProps extends PlatformEnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface PlatformEnterpriseSelectMultiProps extends PlatformEnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type PlatformEnterpriseSelectProps = PlatformEnterpriseSelectSingleProps | PlatformEnterpriseSelectMultiProps;
