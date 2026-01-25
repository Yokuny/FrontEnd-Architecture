import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';

interface CompositionCardProps {
  compositionAsset: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function CompositionCard({ compositionAsset, onChange, disabled }: CompositionCardProps) {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange([...compositionAsset, '']);
  };

  const handleRemove = (index: number) => {
    const newComposition = [...compositionAsset];
    newComposition.splice(index, 1);
    onChange(newComposition);
  };

  const handleChange = (index: number, value: string) => {
    const newComposition = [...compositionAsset];
    newComposition[index] = value;
    onChange(newComposition);
  };

  return (
    <Item className="w-full items-stretch">
      <ItemHeader>
        <ItemTitle>{t('composition')}</ItemTitle>
      </ItemHeader>
      <ItemContent className="space-y-4">
        {compositionAsset.map((item, index) => (
          <div key={`${index}-${item}`} className="flex items-center gap-4">
            <div className="flex-1">
              <ItemTitle>{t('machine')}</ItemTitle>
              <Input value={item} onChange={(e) => handleChange(index, e.target.value)} placeholder={`${t('composition')} ${t('machine')}`} disabled={disabled} />
            </div>
            <Button variant="ghost" size="icon" className="mt-6 text-destructive" onClick={() => handleRemove(index)} disabled={disabled}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </ItemContent>
      <ItemFooter className="justify-center">
        <Button variant="outline" type="button" onClick={handleAdd} disabled={disabled}>
          {t('add.composition')}
        </Button>
      </ItemFooter>
    </Item>
  );
}
