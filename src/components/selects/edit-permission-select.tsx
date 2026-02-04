import { ShieldAlert } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { EDIT_PERMISSION_OPTIONS, type SelectOptionWithKey } from '@/lib/constants/select-options';

export function EditPermissionSelect(props: EditPermissionSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  const query = {
    data: EDIT_PERMISSION_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: SelectOptionWithKey[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
      data: opt,
    }));
  };

  const displayLabel = label || t('edit.permission.owner');

  const sharedProps = {
    id,
    placeholder: placeholder || t('all'),
    query: query as any,
    mapToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: t('nooptions.message'),
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ShieldAlert className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<SelectOptionWithKey, SelectOptionWithKey> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<SelectOptionWithKey, SelectOptionWithKey> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={false} />
      )}
    </div>
  );
}

interface EditPermissionSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface EditPermissionSelectSingleProps extends EditPermissionSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface EditPermissionSelectMultiProps extends EditPermissionSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type EditPermissionSelectProps = EditPermissionSelectSingleProps | EditPermissionSelectMultiProps;
