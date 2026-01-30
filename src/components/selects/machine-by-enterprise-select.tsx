import { Cpu } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptions, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

export function MachineByEnterpriseSelect(props: MachineByEnterpriseSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('select.machine');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Cpu className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<Machine>
          id={id}
          placeholder={placeholder || t('select.machine')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMachinesToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('select.machine');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Cpu className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<Machine>
        id={id}
        placeholder={placeholder || t('select.machine')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMachinesToOptions}
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

interface MachineByEnterpriseSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface MachineByEnterpriseSelectSingleProps extends MachineByEnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MachineByEnterpriseSelectMultiProps extends MachineByEnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MachineByEnterpriseSelectProps = MachineByEnterpriseSelectSingleProps | MachineByEnterpriseSelectMultiProps;
