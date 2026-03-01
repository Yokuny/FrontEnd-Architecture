import { CalendarCheck, Check, MoreVertical, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { extractDate } from '@/lib/helpers/formatter.helper';
import type { DbReminder } from '@/lib/interfaces';
import { cn } from '@/lib/utils';
import { useCheckReminders } from '@/query/reminders';

const openWhatsApp = (phoneNumber: string) => {
  const phone = phoneNumber.replace(/\D/g, '');
  window.open(`https://wa.me/+55${phone}`, '_blank');
};

export function RemindersList({ reminders }: { reminders: DbReminder[] }) {
  const checkReminders = useCheckReminders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(reminders.map((r) => r._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkCheck = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos um lembrete');
      return;
    }

    try {
      await checkReminders.mutateAsync({ ids: selectedIds, status: 'done' });
      toast.success(`${selectedIds.length} lembrete${selectedIds.length > 1 ? 's' : ''} concluído${selectedIds.length > 1 ? 's' : ''}`);
      setSelectedIds([]);
    } catch (e: any) {
      toast.error(e.message || 'Erro ao concluir lembretes');
    }
  };

  if (reminders.length === 0) {
    return <DefaultEmptyData />;
  }

  const allSelected = selectedIds.length === reminders.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < reminders.length;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 px-4 pb-2">
        <div className="flex items-center gap-2">
          <Checkbox id="select-all" checked={allSelected ? true : someSelected ? 'indeterminate' : false} onCheckedChange={handleSelectAll} />
          <label htmlFor="select-all" className="cursor-pointer font-medium text-sm">
            {allSelected ? 'Desmarcar todos' : someSelected ? `${selectedIds.length} selecionado${selectedIds.length > 1 ? 's' : ''}` : 'Selecionar todos'}
          </label>
        </div>

        <Button onClick={handleBulkCheck} disabled={checkReminders.isPending || selectedIds.length === 0} size="sm" className="gap-2">
          Concluir <Check className="size-4" />
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full px-4">
        <ItemGroup>
          {reminders.map((reminder) => {
            const isSelected = selectedIds.includes(reminder._id);
            return (
              <Item
                key={reminder._id}
                variant="outline"
                className={cn('relative cursor-pointer overflow-hidden', isSelected && 'border-primary', reminder.status === 'done' && 'opacity-60')}
                onClick={() => handleSelectOne(reminder._id, !isSelected)}
              >
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="icon" className={isSelected ? 'bg-primary/20 text-primary' : ''}>
                    <CalendarCheck className="size-5" />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle className="text-base">{reminder.Patient.name}</ItemTitle>
                    <ItemDescription>{reminder.description}</ItemDescription>
                    <span className="mt-1 text-muted-foreground text-xs">Retorno em: {extractDate(reminder.scheduledDate, 'short')}</span>
                  </ItemContent>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {reminder.Patient.phone?.[0] && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openWhatsApp(reminder.Patient.phone?.[0]?.number || '');
                        }}
                      >
                        <Phone className="mr-2 size-4" />
                        Conversar (WhatsApp)
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await checkReminders.mutateAsync({ ids: [reminder._id], status: 'done' });
                          toast.success('Concluído');
                        } catch (e: any) {
                          toast.error(e.message || 'Erro');
                        }
                      }}
                    >
                      <Check className="mr-2 size-4" />
                      Marcar como concluído
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Item>
            );
          })}
        </ItemGroup>
      </ScrollArea>
    </div>
  );
}
