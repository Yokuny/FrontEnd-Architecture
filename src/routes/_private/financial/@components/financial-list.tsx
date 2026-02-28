import { useNavigate } from '@tanstack/react-router';
import { MoreVertical } from 'lucide-react';

import { Badge, Status, StatusIndicator, StatusLabel } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { currencyFormat, extractDate, handleCopy, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { PartialFinancial } from '@/lib/interfaces/financial';
import { STATUS_TO_BADGE_VARIANT } from '../@consts/financial.consts';
import { FinancialView } from './financial-view';

type FinancialListItemProps = {
  financial: PartialFinancial;
};

export function FinancialListItem({ financial }: FinancialListItemProps) {
  const navigate = useNavigate();
  const badgeVariant = STATUS_TO_BADGE_VARIANT[financial.status] || 'neutral';

  return (
    <Item variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/financial/$id', params: { id: financial._id } })}>
      <ItemContent className="gap-0">
        <ItemTitle className="text-base">{financial.patient}</ItemTitle>
        <ItemDescription>{extractDate(financial.updatedAt, '')}</ItemDescription>
      </ItemContent>

      <div className="flex items-center gap-3">
        <Badge variant="info" className="hidden tabular-nums md:flex">
          {currencyFormat(financial.price)}
        </Badge>
        <Status status={badgeVariant}>
          <StatusIndicator status={badgeVariant} />
          <StatusLabel>{statusDictionary(financial.status)}</StatusLabel>
        </Status>
      </div>

      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <FinancialView id={financial._id} />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: '/financial/$id', params: { id: financial._id } });
              }}
            >
              Editar financeiro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(financial.price.toString());
              }}
            >
              Copiar preço
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(financial.patient);
              }}
            >
              Copiar nome do paciente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </Item>
  );
}
