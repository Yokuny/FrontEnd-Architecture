import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DialogItinerary } from './dialog-itinerary';

export function AddItinerary({ itinerary, onChange, disabled, idEnterprise }: ItineraryCardProps) {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange([...itinerary, { onShowModal: true }]);
  };

  const handleChangeItem = (index: number, data: any) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], ...data };
    onChange(newItinerary);
  };

  const handleDelete = (index: number) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);
    onChange(newItinerary);
  };

  const idsFences = itinerary.map((item) => item.idFence).filter(Boolean);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{t('itinerary')}</h3>
      <div className="grid gap-4">
        {itinerary.map((item, index) => (
          <DialogItinerary
            key={`${index}-${item?.id}`}
            index={index}
            data={item}
            onChangeData={(data) => handleChangeItem(index, data)}
            onDelete={() => handleDelete(index)}
            disabled={disabled}
            idEnterprise={idEnterprise}
            idsFences={idsFences}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" type="button" onClick={handleAdd} disabled={disabled}>
          <Plus className="mr-2 size-4" />
          {t('add')} {t(itinerary.length ? 'destiny.port' : 'source')}
        </Button>
      </div>
    </div>
  );
}

interface ItineraryCardProps {
  itinerary: any[];
  onChange: (value: any[]) => void;
  idEnterprise?: string;
  disabled?: boolean;
}
