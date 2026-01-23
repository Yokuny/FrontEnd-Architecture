import { Star } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import {
  mapUserEnterprisesPreferredToOptions,
  type UserEnterprisePreference,
  useUpdateUserEnterprisePreferred,
  useUserEnterprisesPreferredSelect,
} from '@/hooks/use-user-enterprises-api';

export function EnterprisePreferredSelect(props: EnterprisePreferredSelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label } = props;
  const id = useId();
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
          toast.success(t('enterprise.preferred.updated'));
          props.onChange?.(stringValue);
        },
        onError: () => {
          toast.error(t('enterprise.preferred.failed'));
        },
      });
    } else {
      props.onChange?.(undefined);
    }
  };

  const displayLabel = label || t('machine.idEnterprise.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Star className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<UserEnterprisePreference>
        id={id}
        placeholder={t('machine.idEnterprise.placeholder')}
        value={selectedValue}
        onChange={handleChange}
        query={query}
        mapToOptions={mapUserEnterprisesPreferredToOptions}
        disabled={disabled || updateMutation.isPending}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface EnterprisePreferredSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}
