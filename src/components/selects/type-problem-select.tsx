import { AlertCircle } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapTypeProblemsToOptions, type TypeProblem, useTypeProblemsSelect } from '@/hooks/use-type-problems-api';

export function TypeProblemSelect(props: TypeProblemSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useTypeProblemsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('support.typeProblem.placeholder');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <AlertCircle className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<TypeProblem, TypeProblem>
          id={id}
          placeholder={placeholder || t('support.typeProblem.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapTypeProblemsToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('support.typeProblem.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <AlertCircle className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<TypeProblem, TypeProblem>
        id={id}
        placeholder={placeholder || t('support.typeProblem.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapTypeProblemsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface TypeProblemSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface TypeProblemSelectSingleProps extends TypeProblemSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface TypeProblemSelectMultiProps extends TypeProblemSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type TypeProblemSelectProps = TypeProblemSelectSingleProps | TypeProblemSelectMultiProps;
