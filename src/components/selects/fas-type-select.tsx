import { Tag } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { FAS_REGULARIZATION_TYPES, FAS_TYPES, type IdNameOption } from '@/lib/constants/select-options';

export function FasTypeSelect(props: FasTypeSelectProps) {
  const { t } = useTranslation();
  const { mode, noRegularization = false, disabled = false, className, label, placeholder } = props;
  const id = useId();

  const allOptions = [...FAS_TYPES];
  if (!noRegularization) {
    allOptions.push(...FAS_REGULARIZATION_TYPES);
  }

  const query = {
    data: allOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: IdNameOption[]) => {
    return options.map((opt) => ({
      value: opt.id,
      label: opt.name,
      data: opt,
    }));
  };

  const displayLabel = label || t('select.option');
  const sharedProps = {
    id,
    placeholder: placeholder || t('select.option'),
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
          <Tag className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<IdNameOption, IdNameOption> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<IdNameOption, IdNameOption> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable />
      )}
    </div>
  );
}

interface FasTypeSelectBaseProps {
  noRegularization?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FasTypeSelectSingleProps extends FasTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FasTypeSelectMultiProps extends FasTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FasTypeSelectProps = FasTypeSelectSingleProps | FasTypeSelectMultiProps;
