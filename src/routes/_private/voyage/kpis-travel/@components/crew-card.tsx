import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';

interface CrewCardProps {
  crew: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function CrewCard({ crew, onChange, disabled }: CrewCardProps) {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange([...crew, '']);
  };

  const handleRemove = (index: number) => {
    const newCrew = [...crew];
    newCrew.splice(index, 1);
    onChange(newCrew);
  };

  const handleChange = (index: number, value: string) => {
    const newCrew = [...crew];
    newCrew[index] = value;
    onChange(newCrew);
  };

  return (
    <Item className="w-full items-stretch">
      <ItemHeader>
        <ItemTitle>{t('crew')}</ItemTitle>
      </ItemHeader>
      <ItemContent className="space-y-4">
        {crew.map((member, index) => (
          <div key={`${index}-${member}`} className="flex items-center gap-4">
            <div className="flex-1">
              <ItemTitle>{t('name')}</ItemTitle>
              <Input value={member} onChange={(e) => handleChange(index, e.target.value)} placeholder={t('name')} disabled={disabled} />
            </div>
            <Button variant="ghost" size="icon" className="mt-6 text-destructive" onClick={() => handleRemove(index)} disabled={disabled}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </ItemContent>
      <ItemFooter className="justify-center">
        <Button variant="outline" type="button" onClick={handleAdd} disabled={disabled}>
          {t('add.crew')}
        </Button>
      </ItemFooter>
    </Item>
  );
}
