import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerButtonProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}

const DatePickerButton = ({ date, onSelect }: DatePickerButtonProps) => {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('w-[280px] justify-start', date && 'font-normal')}>
            <CalendarIcon className="size-5" />
            {date ? String(date.toLocaleDateString('pt-BR')) : <span>Selecione uma data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto bg-white p-0">
          <Calendar mode="single" selected={date} onSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerButton;
