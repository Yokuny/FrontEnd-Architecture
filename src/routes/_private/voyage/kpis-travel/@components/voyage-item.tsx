import { format, isValid } from 'date-fns';
import { ArrowRight, Building2, Clock, Flag, MapPin, MoreVertical, Pencil, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export function VoyageItem({ voyage }: VoyageItemProps) {
  const { t } = useTranslation();

  const formatDateSafely = (date: any, formatStr: string) => {
    if (!date) return '-';
    const d = new Date(date);
    if (!isValid(d)) return '-';
    return format(d, formatStr);
  };

  const portFinal = voyage?.portPointDestiny || voyage?.portPointEnd;
  const isFinished = !!voyage?.dateTimeEnd;

  return (
    <Item variant="outline">
      <div className="flex flex-1 items-center gap-4">
        <ItemMedia variant="image">
          {voyage.machine?.image?.url ? <img src={voyage.machine.image.url} alt={voyage.machine?.name || ''} className="size-full object-cover" /> : <Ship className="size-5" />}
        </ItemMedia>
        <ItemContent className="gap-0">
          <ItemTitle className="text-base">{voyage.code}</ItemTitle>
          <ItemDescription className="flex items-center gap-2">
            <Building2 className="size-3 shrink-0 text-muted-foreground" />
            {voyage.machine?.name}
            {voyage.machine?.code && ` / ${voyage.machine.code}`}
          </ItemDescription>
        </ItemContent>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={isFinished ? 'default' : 'secondary'} className="h-5 px-1.5 text-xs uppercase tracking-wider">
          {isFinished ? t('finished') : t('in.progress')}
        </Badge>
        {voyage.travel && <div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{voyage.travel.code}</div>}
      </div>

      <ItemContent>
        {(voyage?.portPointStart || portFinal) && (
          <div className="flex items-center justify-between gap-4">
            <ItemContent className="flex-none gap-0">
              <ItemTitle className="truncate text-xs">{voyage.portPointStart?.code || '-'}</ItemTitle>
              <ItemDescription className="truncate text-xs">{voyage.portPointStart?.description}</ItemDescription>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="size-3" />
                <ItemDescription className="text-xs tabular-nums">{formatDateSafely(voyage.metadata?.dateTimeArrival || voyage.dateTimeStart, 'HH:mm, dd MMM')}</ItemDescription>
              </div>
            </ItemContent>

            <ItemContent className="items-center gap-0">
              <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
              {voyage?.metadata?.eta && (
                <ItemContent className="items-center gap-0">
                  <ItemTitle className="text-xs">
                    <Flag className="size-3" /> ETA:
                  </ItemTitle>
                  <ItemDescription className="text-xs tabular-nums">{formatDateSafely(voyage.metadata.eta, 'HH:mm, dd MMM')}</ItemDescription>
                </ItemContent>
              )}
            </ItemContent>

            <ItemContent className="flex-none items-end gap-0">
              <ItemTitle className="truncate text-xs">{portFinal?.code || '-'}</ItemTitle>
              <ItemDescription className="truncate text-xs">{portFinal?.description}</ItemDescription>
              {(voyage?.metadata?.dateTimeArrival || voyage.dateTimeEnd) && (
                <div className="flex items-center gap-2 font-medium text-green-600 text-xs">
                  <Clock className="size-3" />
                  <ItemDescription className="text-xs tabular-nums">{formatDateSafely(voyage.metadata?.dateTimeArrival || voyage.dateTimeEnd, 'HH:mm, dd MMM')}</ItemDescription>
                </div>
              )}
            </ItemContent>
          </div>
        )}
      </ItemContent>

      <ItemActions className="border-l pl-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                // Ação de editar aqui se necessário
              }}
            >
              <Pencil className="mr-2 size-4" />
              {t('edit')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

interface VoyageItemProps {
  voyage: any;
}
