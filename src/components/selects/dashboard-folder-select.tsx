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

  if (mode === 'multi') {
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Layers className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder || t('folder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapToOptions}
          disabled={disabled}
          className={className}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={!idEnterprise ? t('select.first.enterprise') : t('nooptions.message')}
          noResultsMessage={t('not.found')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Layers className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder || t('folder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        className={className}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={!idEnterprise ? t('select.first.enterprise') : t('nooptions.message')}
        noResultsMessage={t('not.found')}
      />
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
