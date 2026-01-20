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
    <div className="border rounded-md overflow-x-auto mb-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] sticky left-0 bg-background z-10">{t('machine')}</TableHead>
            {months.map((month) => (
              <TableHead key={month} className="w-[100px] text-center px-1">
                {t(month)}
              </TableHead>
            ))}
            <TableHead className="w-[100px] text-center px-1 font-bold">{t('total.year')}</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium sticky left-0 bg-background z-10">{field.isFleet ? t('fleet') : field.machineName}</TableCell>
              {months.map((_, monthIndex) => (
                <TableCell key={`${field.id}-${monthIndex}`} className="px-1">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 text-center px-1"
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
                  className="h-8 text-center px-1 font-bold bg-muted/30"
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
