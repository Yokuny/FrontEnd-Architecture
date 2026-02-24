import { Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import DefaultEmptyData from '@/components/default-empty-data';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { GuestProps, UserSyncStatus } from '../@interface/access-user.interface';
import { applyCpfMask } from '../@utils/masks';

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {items.length === 0 ? (
        <DefaultEmptyData />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Item key={item._resolvedId} className="cursor-pointer" onClick={() => onEdit(item._resolvedId)}>
              <ItemContent>
                <ItemTitle>{item.name || '-'}</ItemTitle>
                <ItemDescription>
                  {applyCpfMask(item.cpf || '')}
                  {item.birthday && ` - ${new Date(item.birthday).toLocaleDateString('pt-BR')}`}
                </ItemDescription>
              </ItemContent>
              <div className="flex items-center gap-2">
                {item.registration_complete === true && <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs">Cadastro completo</span>}
                {item.registration_complete === false && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Cadastro pendente</span>}
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
              </div>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
}
