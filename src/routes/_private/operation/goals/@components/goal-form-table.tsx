import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { GoalFormData } from '../@interface/goals.schema';

export function GoalFormTable() {
  const { t } = useTranslation();
  const { control, register } = useFormContext<GoalFormData>();
  const { fields, remove } = useFieldArray({
    control,
    name: 'rows',
  });

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  if (fields.length === 0) return null;

  return (
    <div className="mb-6 overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-36 bg-background">{t('machine')}</TableHead>
            {months.map((month) => (
              <TableHead key={month} className="w-[100px] px-1 text-center">
                {t(month)}
              </TableHead>
            ))}
            <TableHead className="w-[100px] px-1 text-center font-bold">{t('total.year')}</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">{field.isFleet ? t('fleet') : field.machineName}</TableCell>
              {months.map((_, monthIndex) => (
                <TableCell key={`${field.id}-${monthIndex}`} className="px-1">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 px-1 text-center"
                    {...register(`rows.${index}.months.${monthIndex}.value` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </TableCell>
              ))}
              <TableCell className="px-1">
                <Input
                  type="number"
                  step="0.01"
                  className="h-8 bg-muted/30 px-1 text-center font-bold"
                  {...register(`rows.${index}.months.12.value` as const, {
                    valueAsNumber: true,
                  })}
                />
              </TableCell>
              <TableCell>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
