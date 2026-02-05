import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Item, ItemContent, ItemFooter } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import { DialogEvent } from './dialog-event';

export function AddGroup({ events, onChange, disabled }: GroupCardProps) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const newEvents = [...events];
    newEvents.splice(index, 1);
    onChange(newEvents);
  };

  const handleSaveEvent = (eventData: any) => {
    if (editingIndex !== null) {
      const newEvents = [...events];
      newEvents[editingIndex] = eventData;
      onChange(newEvents);
    } else {
      onChange([...events, eventData]);
    }
    setModalOpen(false);
  };

  return (
    <Item className="w-full flex-col items-stretch">
      <ItemContent>
        {events && events.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">
                  {t('speed')} ({t('kn')})
                </TableHead>
                <TableHead className="text-right">{t('engine.rpm.bb')}</TableHead>
                <TableHead className="text-right">{t('engine.rpm.be')}</TableHead>
                <TableHead className="text-right">{t('machine.supplies.consumption.oil')}</TableHead>
                <TableHead className="text-right">{t('machine.supplies.consumption.potable.water')}</TableHead>
                <TableHead>{t('observation')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event, index) => (
                <TableRow key={`${index}${event}`}>
                  <TableCell>{event.datetime ? formatDate(event.datetime, 'dd MM yyyy HH:mm') : '-'}</TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell className="text-right">{event.speed}</TableCell>
                  <TableCell className="text-right">{event.engine?.rpmBB}</TableCell>
                  <TableCell className="text-right">{event.engine?.rpmBE}</TableCell>
                  <TableCell className="text-right">
                    {event.stock?.oil?.value} {event.stock?.oil?.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    {event.stock?.water?.value} {event.stock?.water?.unit}
                  </TableCell>
                  <TableCell>{event.observation}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(index)} disabled={disabled}>
                        <Edit2 className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(index)} disabled={disabled}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ItemContent>
      <ItemFooter className="justify-center pt-2">
        <Button variant="outline" type="button" onClick={handleAdd} disabled={disabled}>
          <Plus className="mr-2 size-4" />
          {t('add.event')}
        </Button>
      </ItemFooter>

      {modalOpen && <DialogEvent open={modalOpen} onOpenChange={setModalOpen} data={editingIndex !== null ? events[editingIndex] : undefined} onSave={handleSaveEvent} />}
    </Item>
  );
}

interface GroupCardProps {
  events: any[];
  onChange: (events: any[]) => void;
  disabled?: boolean;
}
