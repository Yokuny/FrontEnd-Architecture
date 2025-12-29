import { ShieldAlert } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { EDIT_PERMISSION_OPTIONS, type EditPermissionOption } from '@/lib/constants/select-options';

export function EditPermissionSelect(props: EditPermissionSelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label, placeholder, value, onChange } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: EDIT_PERMISSION_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: EditPermissionOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
      data: opt,
    }));
  };

  const displayLabel = label || t('edit.permission.owner');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ShieldAlert className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<EditPermissionOption, EditPermissionOption>
        id={id}
        placeholder={placeholder || t('edit.permission.all')}
        value={value}
        onChange={(val) => onChange?.(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface EditPermissionSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
