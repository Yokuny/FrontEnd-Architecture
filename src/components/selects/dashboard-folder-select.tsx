import { useQuery } from '@tanstack/react-query';
import { Layers } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api/client';

export function DashboardFolderSelect(props: DashboardFolderSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  const query = useQuery({
    queryKey: ['dashboards', 'folders', idEnterprise],
    queryFn: async () => {
      if (!idEnterprise) return [];
      const response = await api.get<any[]>(`/dashboard/list/onlyfolder?idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!idEnterprise,
  });

  const mapToOptions = (data: any[]) => {
    return data
      .map((folder) => ({
        value: folder.id,
        label: folder.description,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const displayLabel = label || t('folder');

  const sharedProps = {
    id,
    placeholder: placeholder || t('folder'),
    query,
    mapToOptions,
    disabled,
    className,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage: !idEnterprise ? t('select.first.enterprise') : t('nooptions.message'),
    noResultsMessage: t('not.found'),
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Layers className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
    </div>
  );
}

interface DashboardFolderSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface DashboardFolderSelectSingleProps extends DashboardFolderSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface DashboardFolderSelectMultiProps extends DashboardFolderSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type DashboardFolderSelectProps = DashboardFolderSelectSingleProps | DashboardFolderSelectMultiProps;
