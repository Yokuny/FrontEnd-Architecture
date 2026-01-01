import { Zap } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptionsSimple, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

interface MachineSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface MachineSelectSingleProps extends MachineSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MachineSelectMultiProps extends MachineSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MachineSelectProps = MachineSelectSingleProps | MachineSelectMultiProps;

export function MachineSelect(props: MachineSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Only fetch if idEnterprise is provided
  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const isDisabled = disabled || !idEnterprise;

  if (mode === 'multi') {
    const displayLabel = label; // || t('machine'); // Optional default label
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Zap className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Machine>
          id={id}
          placeholder={placeholder || t('select.machines')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMachinesToOptionsSimple}
          disabled={isDisabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={!idEnterprise ? t('select.enterprise.first') : t('nooptions.message')}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label; // || t('machine');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Zap className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Machine>
        id={id}
        placeholder={placeholder || t('select.machine')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMachinesToOptionsSimple}
        disabled={isDisabled}
        clearable={true}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={!idEnterprise ? t('select.enterprise.first') : t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}
