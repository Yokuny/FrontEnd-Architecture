import { Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import DefaultEmptyData from '@/components/default-empty-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { applyCpfMask } from '@/lib/masks';
import type { GuestProps, UserSyncStatus } from '../@interface/access-user.interface';

interface GuestListProps {
  guests: GuestProps[];
  syncStatuses?: UserSyncStatus[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  title: string;
}

export function GuestList({ guests, syncStatuses, onAdd, onEdit, onDelete, title }: GuestListProps) {
  const items = useMemo(
    () =>
      guests.map((guest) => {
        const id = guest._id || guest.id || '';
        const syncStatus = syncStatuses?.find((s) => s.user.id === id);
        return { ...guest, _resolvedId: id, syncStatus };
      }),
    [guests, syncStatuses],
  );

  return (
    <ItemGroup className="gap-4">
      <ItemHeader>
        <ItemTitle className="text-lg">{title}</ItemTitle>
        <ItemActions>
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </ItemActions>
      </ItemHeader>

      {items.length === 0 ? (
        <DefaultEmptyData />
      ) : (
        <ItemGroup>
          {items.map((item) => (
            <Item key={item._resolvedId} className="cursor-pointer" onClick={() => onEdit(item._resolvedId)}>
              <ItemContent>
                <ItemTitle>{item.name || '-'}</ItemTitle>
                <ItemDescription>
                  {applyCpfMask(item.cpf || '')}
                  {item.birthday && ` - ${new Date(item.birthday).toLocaleDateString('pt-BR')}`}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {item.registration_complete === true && <Badge variant="success">Cadastro completo</Badge>}
                {item.registration_complete === false && <Badge variant="warning">Cadastro pendente</Badge>}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item._resolvedId, item.name || '');
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
    </ItemGroup>
  );
}
