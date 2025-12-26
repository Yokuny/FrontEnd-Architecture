import { format } from 'date-fns';
import { CheckCircle2, Eye, FileText, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { OrderServiceDone } from '../@interface/list-os-done.types';

interface OsDoneItemProps {
  item: OrderServiceDone;
  hasViewPermission: boolean;
}

export function OsDoneItem({ item, hasViewPermission }: OsDoneItemProps) {
  const { t } = useTranslation();

  const handleViewDetails = () => {
    // TODO: Implementar navegação para detalhes da OS quando a rota existir
    console.log('Ver detalhes da OS:', item.id);
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors group">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <FileText className="size-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base truncate">
          {item.order} - {item.maintenancePlan?.description} - {item.machine?.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">{item.enterprise?.name}</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center gap-1.5 text-green-600">
          <CheckCircle2 className="size-4" />
          <span className="text-[10px] font-medium leading-none">
            {t('done.at')} {item.doneAt ? format(new Date(item.doneAt), 'dd/MM/yyyy') : '-'}
          </span>
        </div>
      </div>

      {hasViewPermission && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 size-4" />
              {t('view.os')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
