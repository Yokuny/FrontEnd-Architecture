import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Mail, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type UnlockMethodFormValues, type UnlockOption, unlockMethodSchema } from '../@interface/unlock.types';

interface SelectMethodStepProps {
  options: UnlockOption[];
  onSubmit: (data: UnlockMethodFormValues) => void;
  onBack: () => void;
}

export function SelectMethodStep({ options, onSubmit, onBack }: SelectMethodStepProps) {
  const { t } = useTranslation();
  const form = useForm<UnlockMethodFormValues>({
    resolver: zodResolver(unlockMethodSchema),
    defaultValues: {
      method: 'email',
    },
  });

  return (
    <FieldGroup className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="mx-auto mb-4 bg-amber-500/10 p-4 rounded-2xl w-fit border border-amber-500/20">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">{t('unlock.title')}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t('unlock.subtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{t('unlock.method.label')}</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                    {options.map((option) => (
                      <Field key={option.type} orientation="horizontal" className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group">
                        <RadioGroupItem value={option.type} id={option.type} className="border-2" />
                        <Label htmlFor={option.type} className="flex-1 cursor-pointer font-normal">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                              {option.type === 'email' ? <Mail className="size-5" /> : <Shield className="size-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{option.type === 'email' ? t('email') : t('sms')}</p>
                              <p className="text-muted-foreground text-sm">{option.destination}</p>
                            </div>
                          </div>
                        </Label>
                      </Field>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="blue" className="w-full mt-4 font-semibold text-base" size="lg">
            {t('unlock.send-code')}
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </form>
      </Form>

      <Button variant="ghost" size="sm" onClick={onBack} className="w-full text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 size-4" />
        {t('back.login')}
      </Button>
    </FieldGroup>
  );
}
