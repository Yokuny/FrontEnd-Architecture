import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/formatDate';
import { useCotation } from '../@hooks/use-cotation';
import { usePtaxForm } from '../@hooks/use-ptax-form';
import type { PtaxFormData } from '../@interface/ptax.schema';

interface PtaxModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PtaxFormData;
}

export function PtaxModal({ open, onOpenChange, initialData }: PtaxModalProps) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading } = usePtaxForm(initialData, () => onOpenChange(false));

  const dateValue = form.watch('date');
  const amountValue = form.watch('value');

  const { cotationDate, cotation } = useCotation({ date: dateValue, value: amountValue });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          date: new Date().toISOString(),
          value: 0,
        });
      }
    }
  }, [open, initialData, form]);

  // Apply suggested cotation if field is empty/zero
  useEffect(() => {
    if (cotation.value && !amountValue) {
      form.setValue('value', Number(cotation.value));
    }
  }, [cotation.value, amountValue, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData?.id ? t('ptax.edit') : t('ptax.new')}</DialogTitle>
          <DialogDescription>{t('operation.ptax.description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('date')}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? formatDate(field.value, 'yyyy-MM-dd') : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('value')}</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.0001" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  {cotationDate && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      {t('quote.day')} {formatDate(cotationDate, 'dd MMM yyyy')}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
