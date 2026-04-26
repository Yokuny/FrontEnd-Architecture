import Calender from '@/components/icons/Calender.Icon';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { cn } from '@/lib/utils/cn.util';

const DatePickerButton = ({ date, onSelect }: DatePickerButtonProps) => {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="basic" className={cn('w-full justify-between', !date && 'text-muted-foreground')}>
            <span className={cn('truncate', !date && 'text-muted-foreground')}>{date ? formatDate(date) : 'Selecione uma data'}</span>
            <Calender className="size-4 shrink-0" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <Calendar mode="single" selected={date} defaultMonth={date} onSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerButton;

interface DatePickerButtonProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}
