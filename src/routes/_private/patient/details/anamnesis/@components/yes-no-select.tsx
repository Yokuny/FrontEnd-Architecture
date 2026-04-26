import { Button } from '@/components/ui/button';
import { t } from '@/lib/helpers/translate.helper';

interface YesNoSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function YesNoSelect({ value, onChange, disabled }: YesNoSelectProps) {
  return (
    <div className="flex gap-2">
      <Button type="button" variant={value === 'true' ? 'default' : 'primary'} size="sm" onClick={() => onChange('true')} disabled={disabled} className="h-8 w-12">
        {t('yes')}
      </Button>
      <Button type="button" variant={value === 'false' ? 'default' : 'primary'} size="sm" onClick={() => onChange('false')} disabled={disabled} className="h-8 w-12">
        {t('no')}
      </Button>
    </div>
  );
}
