import { Cpu } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptionsSimple, useMachinesByEnterpriseSelect } from '@/hooks/use-machines-api';

export function MachineEnterpriseSelect(props: MachineEnterpriseSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useMachinesByEnterpriseSelect(idEnterprise);

  const displayLabel = label || t('select.machine');
  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('select.machine'),
    query,
    mapToOptions: mapMachinesToOptionsSimple,
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
          <Cpu className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<Machine, Machine> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<Machine, Machine> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable />
      )}
    </div>
  );
}

interface MachineEnterpriseSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface MachineEnterpriseSelectSingleProps extends MachineEnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MachineEnterpriseSelectMultiProps extends MachineEnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MachineEnterpriseSelectProps = MachineEnterpriseSelectSingleProps | MachineEnterpriseSelectMultiProps;
