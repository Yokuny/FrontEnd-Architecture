import { FileText } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapOperationsByAssetToOptions, type OperationByAsset, useOperationsByAssetSelect } from '@/hooks/use-contract-assets-api';

export function OperationsContractSelect(props: OperationsContractSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, idMachine, disabled = false, className, label, placeholder } = props;
  const id = useId();
  const query = useOperationsByAssetSelect(idEnterprise, idMachine);

  const noOptionsMessage = !idEnterprise ? t('select.first.enterprise') : !idMachine ? t('select.machine.first') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('machine.placeholder');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <FileText className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<OperationByAsset, OperationByAsset>
          id={id}
          placeholder={placeholder || t('machine.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapOperationsByAssetToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
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
          <FileText className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<OperationByAsset, OperationByAsset>
        id={id}
        placeholder={placeholder || t('machine.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapOperationsByAssetToOptions}
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

interface OperationsContractSelectBaseProps {
  idEnterprise?: string;
  idMachine?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface OperationsContractSelectSingleProps extends OperationsContractSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface OperationsContractSelectMultiProps extends OperationsContractSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type OperationsContractSelectProps = OperationsContractSelectSingleProps | OperationsContractSelectMultiProps;
