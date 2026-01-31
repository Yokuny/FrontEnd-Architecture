import { Activity, AlertTriangle, Calendar, CheckCircle, Edit2, Search } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { CmmsActivitiesResponse, CmmsActivityItem } from '../@interface/filled-form.schema';

interface KPIProps {
  data: CmmsActivitiesResponse;
  onFilter: (value: string, type: 'status' | 'tipoManutencao') => void;
  activeFilters: {
    status?: string;
    tipoManutencao?: string;
  };
}

export function KPI({ data, onFilter, activeFilters }: KPIProps) {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Diagnóstico':
      case 'Diagnostico': // Handle potential variations
        return <Search className="size-5 text-blue-500" />;
      case 'Programação':
        return <Calendar className="size-5 text-primary" />;
      case 'Executado':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'Monitoramento':
        return <Activity className="size-5 text-amber-500" />;
      case 'Planejamento':
        return <Edit2 className="size-5 text-blue-400" />;
      default:
        return <AlertTriangle className="size-5 text-destructive" />;
    }
  };

  const processDataGroup = (items: CmmsActivityItem[] = []) => {
    // Logic from legacy: separate 'undefined' from defined and put it at the end
    if (!Array.isArray(items)) return [];

    const { defined, undefinedItem } = items.reduce(
      (acc, item) => {
        if (!item.text || item.text.trim() === '') {
          return {
            ...acc,
            undefinedItem: {
              text: t('undefined'), // or whatever key handles 'undefined' from backend
              total: (acc.undefinedItem.total || 0) + (item.total || 0),
            },
          };
        }
        acc.defined.push(item); // Refactored to push instead of spread
        return acc;
      },
      { defined: [] as CmmsActivityItem[], undefinedItem: { text: t('undefined'), total: 0 } },
    );

    return undefinedItem.total > 0 ? [...defined, undefinedItem] : defined;
  };

  const statusItems = useMemo(() => processDataGroup(data?.status), [data, processDataGroup]);
  const maintenanceItems = useMemo(() => processDataGroup(data?.typeMaintenance), [data, processDataGroup]);

  const isActive = (itemText: string, type: 'status' | 'tipoManutencao') => {
    const activeValue = activeFilters[type];
    // Legacy logic checked for 'empty' when text was 'undefined' but let's stick to simple value matching first
    // Assuming parent handles the 'undefined' -> 'empty' translation if needed
    return activeValue === itemText;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Status Row */}
      {statusItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">{t('status')}</h3>
          <div className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-${Math.min(statusItems.length, 6)}`}>
            {statusItems.map((item, index) => (
              <Item
                key={`${index}-${item.text}`}
                className={cn('cursor-pointer flex-col rounded-none border-0 transition-colors hover:bg-muted/50', isActive(item.text, 'status') && 'bg-muted')}
                onClick={() => onFilter(item.text, 'status')}
              >
                <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
                  {getStatusIcon(item.text)}
                  <ItemDescription className="max-w-[120px] truncate text-right font-medium" title={item.text}>
                    {item.text}
                  </ItemDescription>
                </ItemContent>
                <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{item.total}</ItemTitle>
              </Item>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Type Row */}
      {maintenanceItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">{t('activities')}</h3>
          <div className={`grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-${Math.min(maintenanceItems.length, 6)}`}>
            {maintenanceItems.map((item, index) => (
              <Item
                key={`${index}-${item.text}`}
                className={cn('cursor-pointer flex-col rounded-none border-0 transition-colors hover:bg-muted/50', isActive(item.text, 'tipoManutencao') && 'bg-muted')}
                onClick={() => onFilter(item.text, 'tipoManutencao')}
              >
                <ItemContent className="flex w-full flex-row items-center justify-end gap-2">
                  {/* No specific icon logic for maintenance types in legacy, so just text */}
                  <ItemDescription className="truncate text-right font-medium" title={item.text}>
                    {item.text}
                  </ItemDescription>
                </ItemContent>
                <ItemTitle className="w-full text-right font-bold text-2xl tracking-tight">{item.total}</ItemTitle>
              </Item>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
