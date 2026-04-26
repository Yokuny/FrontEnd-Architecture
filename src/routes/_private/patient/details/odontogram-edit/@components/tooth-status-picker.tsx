import { useState } from 'react';
import ToothNumber from '@/components/odontogram/tooth-number';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type ToothStatusType, toothStatusOptions } from '../@consts/tooth-data';

interface ToothStatusPickerProps {
  number: number;
  bottom: boolean;
  currentStatus: ToothStatusType;
  onStatusChange: (toothNumber: number, status: ToothStatusType) => void;
}

export function ToothStatusPicker({ number, bottom, currentStatus, onStatusChange }: ToothStatusPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ToothStatusType>(currentStatus);

  const handleChange = (value: string) => {
    const newStatus = value as ToothStatusType;
    setStatus(newStatus);
    onStatusChange(number, newStatus);
    setIsOpen(false);
  };

  return (
    <div className={`flex h-auto items-center justify-end gap-4 ${bottom ? 'flex-col-reverse' : 'flex-col'}`}>
      <ToothNumber toothNumber={number} status={status} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" className="border p-1" variant="basic">
            {number}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <RadioGroup value={status} onValueChange={handleChange} className="flex flex-col gap-2">
            {toothStatusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`status-${option.value}-${number}`} />
                <Label htmlFor={`status-${option.value}-${number}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}
