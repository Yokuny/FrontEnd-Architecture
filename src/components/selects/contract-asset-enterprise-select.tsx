import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { type ContractAsset, mapContractAssetsToOptions, useContractAssetsAvailableSelect } from '@/hooks/use-contract-assets-api';

export function ContractAssetEnterpriseSelect(props: ContractAssetEnterpriseSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder } = props;
  const query = useContractAssetsAvailableSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione primeiro uma empresa.' : 'Nenhum ativo disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<ContractAsset>
        label={label || 'Ativo de Contrato'}
        placeholder={placeholder || 'Selecione os ativos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapContractAssetsToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar ativo..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum ativo encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<ContractAsset>
      label={label || 'Ativo de Contrato'}
      placeholder={placeholder || 'Selecione um ativo...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapContractAssetsToOptions}
      disabled={disabled}
      clearable
      searchPlaceholder="Buscar ativo..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum ativo encontrado."
      className={className}
    />
  );
}

interface ContractAssetEnterpriseSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface ContractAssetEnterpriseSelectSingleProps extends ContractAssetEnterpriseSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ContractAssetEnterpriseSelectMultiProps extends ContractAssetEnterpriseSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ContractAssetEnterpriseSelectProps = ContractAssetEnterpriseSelectSingleProps | ContractAssetEnterpriseSelectMultiProps;
