import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface OsRefusalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  isPending?: boolean;
  onConfirm: (reason: string) => void;
}

const refusalSchema = z.object({
  reason: z.string().min(10, 'Motivo deve ter pelo menos 10 caracteres'),
});

type RefusalFormData = z.infer<typeof refusalSchema>;

export function OsRefusalDialog({ open, onOpenChange, title, description, isPending, onConfirm }: OsRefusalDialogProps) {
  const { t } = useTranslation();

  const form = useForm<RefusalFormData>({
    resolver: zodResolver(refusalSchema),
    defaultValues: {
      reason: '',
    },
  });

  const handleSubmit = (data: RefusalFormData) => {
    onConfirm(data.reason);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {description && <p className="text-muted-foreground text-sm">{description}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('refusal.reason')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('fas.refusal.placeholder')} rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? t('sending') : t('confirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
