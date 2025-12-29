import { Cpu } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type Machine, mapMachinesToOptions, useMachinesByEnterpriseSelect, useMachinesSelect } from '@/hooks/use-machines-api';

export function MachineSelect(props: MachineSelectProps) {
  const { t } = useTranslation();
  const { mode, oneBlocked = false, disabled = false, className, label, placeholder, filterQuery, idEnterprise } = props;
  const id = useId();

  // Use idEnterprise specific hook if provided, otherwise generic filterQuery
  const enterpriseQuery = useMachinesByEnterpriseSelect(idEnterprise);
  const genericQuery = useMachinesSelect(filterQuery);
  const query = idEnterprise ? enterpriseQuery : genericQuery;

  if (mode === 'multi') {
    const displayLabel = label || t('machine.placeholder');
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
          placeholder={placeholder || t('machine.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMachinesToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('machine.placeholder');
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
        placeholder={placeholder || t('machine.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMachinesToOptions}
        oneBlocked={oneBlocked}
        disabled={disabled}
        clearable
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface MachineSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  filterQuery?: string;
  idEnterprise?: string;
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
