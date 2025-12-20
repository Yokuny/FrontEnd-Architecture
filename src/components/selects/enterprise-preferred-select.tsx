import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DataSelect } from '@/components/ui/data-select';
import {
  mapUserEnterprisesPreferredToOptions,
  type UserEnterprisePreference,
  useUpdateUserEnterprisePreferred,
  useUserEnterprisesPreferredSelect,
} from '@/hooks/use-user-enterprises-api';

export function EnterprisePreferredSelect(props: EnterprisePreferredSelectProps) {
  const { disabled = false, className, label } = props;
  const query = useUserEnterprisesPreferredSelect();
  const updateMutation = useUpdateUserEnterprisePreferred();

  const [selectedValue, setSelectedValue] = useState<string | undefined>(props.value);

  // Sync with preferred value from API if props.value is not provided
  useEffect(() => {
    if (query.data && !selectedValue) {
      const preferred = query.data.find((item) => item.preferred);
      if (preferred) {
        setSelectedValue(preferred.enterprise.id);
      }
    }
  }, [query.data, selectedValue]);

  // Handle local change and API update
  const handleChange = (value: string | number | undefined) => {
    const stringValue = value as string;
    setSelectedValue(stringValue);

    if (stringValue) {
      updateMutation.mutate(stringValue, {
        onSuccess: () => {
          toast.success('Empresa preferencial atualizada!');
          props.onChange?.(stringValue);
        },
        onError: () => {
          toast.error('Falha ao atualizar empresa preferencial.');
        },
      });
    } else {
      props.onChange?.(undefined);
    }
  };

  return (
    <DataSelect<UserEnterprisePreference>
      label={label || 'Empresa Preferencial'}
      placeholder="Selecione sua empresa..."
      value={selectedValue}
      onChange={handleChange}
      query={query}
      mapToOptions={mapUserEnterprisesPreferredToOptions}
      disabled={disabled || updateMutation.isPending}
      clearable={false}
      searchPlaceholder="Buscar empresa..."
      noOptionsMessage="Nenhuma empresa disponível."
      noResultsMessage="Nenhuma empresa encontrada."
      className={className}
    />
  );
}

interface EnterprisePreferredSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}
