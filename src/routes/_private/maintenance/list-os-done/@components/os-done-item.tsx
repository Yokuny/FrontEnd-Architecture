import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CheckCircle2, Eye, FileText, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { OrderServiceDone } from '../@interface/list-os-done.types';

interface OsDoneItemProps {
  item: OrderServiceDone;
  hasViewPermission: boolean;
}

export function OsDoneItem({ item, hasViewPermission }: OsDoneItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({
      to: '/maintenance/list-os-done/view',
      search: { id: item.id },
    } as any);
  };

  return (
    <Item variant="outline" className="group">
      <ItemMedia variant="icon" className="size-11 rounded-full border-red-100 bg-red-50 text-red-600">
        <FileText className="size-5" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-base">
          {item.order} - {item.maintenancePlan?.description} - {item.machine?.name}
        </ItemTitle>
        <ItemDescription>{item.enterprise?.name}</ItemDescription>
      </ItemContent>

      <div className="flex flex-col items-end gap-1 px-4">
        <div className="flex items-center gap-1.5 rounded-md border border-green-100 bg-green-50 px-2 py-1 text-green-600">
          <CheckCircle2 className="size-3.5" />
          <span className="font-bold text-[11px] uppercase tracking-tight">
            {t('done.at')} {item.doneAt ? format(new Date(item.doneAt), 'dd/MM/yyyy') : '-'}
          </span>
        </div>
      </div>

      <ItemActions>
        {hasViewPermission && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 rounded-full transition-colors group-hover:bg-primary/10">
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
      </ItemActions>
    </Item>
  );
}
