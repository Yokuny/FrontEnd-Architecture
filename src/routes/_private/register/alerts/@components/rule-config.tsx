import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ConditionSelect } from '@/components/selects/condition-select';
import { LevelSelect } from '@/components/selects/level-select';
import { SensorByEnterpriseSelect } from '@/components/selects/sensor-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AlertFormData } from '../@interface/alert';

export function RuleConfig() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<AlertFormData>();
  const idEnterprise = watch('idEnterprise');

  const {
    fields: andFields,
    append: appendAnd,
    remove: removeAnd,
  } = useFieldArray({
    control,
    name: 'rule.and',
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 border-b pb-6 md:grid-cols-2">
        <FormField
          control={control}
          name="rule.then.message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('message')} *</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('message')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="rule.then.level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('scale.level')} *</FormLabel>
                <FormControl>
                  <LevelSelect mode="single" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="rule.inMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('condition.how.long')}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder={t('minutes')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {andFields.map((field, index) => (
          <RuleGroup key={field.id} andIndex={index} idEnterprise={idEnterprise} onRemove={() => removeAnd(index)} canRemove={andFields.length > 1} />
        ))}

        <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => appendAnd({ or: [{ sensor: null, condition: null, value: '' }] })}>
          {t('new.condition.and')}
        </Button>
      </div>
    </div>
  );
}

function RuleGroup({ andIndex, idEnterprise, onRemove, canRemove }: { andIndex: number; idEnterprise: string; onRemove: () => void; canRemove: boolean }) {
  const { t } = useTranslation();
  const { control } = useFormContext<AlertFormData>();

  const {
    fields: orFields,
    append: appendOr,
    remove: removeOr,
  } = useFieldArray({
    control,
    name: `rule.and.${andIndex}.or` as any,
  });

  return (
    <Card className="group relative overflow-hidden border-muted-foreground/20">
      {canRemove && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 size-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
      <CardContent className="space-y-4 pt-6">
        {orFields.map((field, index) => (
          <div key={field.id} className="relative">
            {index > 0 && (
              <div className="my-2 flex justify-center">
                <span className="rounded bg-muted px-2 py-1 font-bold text-muted-foreground text-xs uppercase">{t('condition.or')}</span>
              </div>
            )}
            <div className="grid grid-cols-1 items-end gap-4 rounded-lg border border-accent bg-accent/30 p-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <FormField
                  control={control}
                  name={`rule.and.${andIndex}.or.${index}.sensor` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sensor')} *</FormLabel>
                      <FormControl>
                        <SensorByEnterpriseSelect
                          idEnterprise={idEnterprise}
                          value={field.value?.value || field.value}
                          onChange={(val) => field.onChange(val)}
                          placeholder="sensor"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-3">
                <FormField
                  control={control}
                  name={`rule.and.${andIndex}.or.${index}.condition` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('condition')} *</FormLabel>
                      <FormControl>
                        <ConditionSelect mode="single" value={field.value} onChange={field.onChange} placeholder="condition" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:col-span-4">
                <FormField
                  control={control}
                  name={`rule.and.${andIndex}.or.${index}.value` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('value')} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('value')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end md:col-span-1">
                {orFields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeOr(index)}>
                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="secondary" size="sm" className="w-full" onClick={() => appendOr({ sensor: null, condition: null, value: '' })}>
          {t('new.condition.or')}
        </Button>
      </CardContent>
    </Card>
  );
}
