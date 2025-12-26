import { useId } from 'react';
import { DataSelect } from '@/components/ui/data-select';
import { Skeleton } from '@/components/ui/skeleton';
import { type Enterprise, useEnterprisesSelect } from '@/hooks/use-enterprises-api';
import { cn } from '@/lib/utils';

export function EnterpriseFilterSelect(props: EnterpriseFilterSelectProps) {
  const { value, onChange, className, theme = 'light' } = props;
  const id = useId();
  const query = useEnterprisesSelect();

  const mapFilterToOptions = (enterprises: Enterprise[]) => {
    return enterprises
      .map((enterprise) => ({
        value: enterprise.id,
        label: `${enterprise.name} / ${enterprise.city} - ${enterprise.state}`,
        data: enterprise,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  if (query.isLoading) {
    return <Skeleton className="h-10 w-[300px]" />;
  }

  const enterprises = query.data || [];

  // Se houver apenas uma empresa, exibe apenas o logo conforme a versão original
  if (enterprises.length === 1) {
    const ent = enterprises[0];
    const imageDarkUrl = typeof ent.imageDark?.url === 'string' ? ent.imageDark.url : undefined;
    const source = theme === 'dark' && imageDarkUrl ? imageDarkUrl : ent.image?.url;

    return <div className={cn('flex items-center', className)}>{source && <img src={source} alt={ent.name} className="max-h-10 object-contain" />}</div>;
  }

  const selectedEnterprise = enterprises.find((e) => e.id === value);
  const selectedImageDarkUrl = typeof selectedEnterprise?.imageDark?.url === 'string' ? selectedEnterprise.imageDark.url : undefined;
  const logoSource = theme === 'dark' && selectedImageDarkUrl ? selectedImageDarkUrl : selectedEnterprise?.image?.url;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {logoSource && <img src={logoSource} alt={selectedEnterprise?.name || 'Logo'} className="max-h-10 max-w-[120px] object-contain hidden sm:block" />}
      <DataSelect<Enterprise>
        id={id}
        query={query}
        mapToOptions={mapFilterToOptions}
        value={value}
        onChange={(val) => onChange?.(val as string)}
        className="min-w-[200px] md:min-w-[300px]"
        placeholder="Selecionar Empresa"
        searchPlaceholder="Buscar empresa..."
        noOptionsMessage="Nenhuma empresa disponível."
        noResultsMessage="Nenhuma empresa encontrada."
      />
    </div>
  );
}

interface EnterpriseFilterSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
  theme?: 'light' | 'dark';
}
