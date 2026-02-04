import { FileText } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { FORM_TYPE_OPTIONS, type SelectOptionWithKey } from '@/lib/constants/select-options';

export function FormTypeSelect(props: FormTypeSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  const query = {
    data: FORM_TYPE_OPTIONS,
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

  const displayLabel = label === undefined ? t('type.form') : label;
  const sharedProps = {
    id,
    placeholder: placeholder || t('type.form'),
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
          <FileText className="size-4" />
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

interface FormTypeSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FormTypeSelectSingleProps extends FormTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FormTypeSelectMultiProps extends FormTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FormTypeSelectProps = FormTypeSelectSingleProps | FormTypeSelectMultiProps;
