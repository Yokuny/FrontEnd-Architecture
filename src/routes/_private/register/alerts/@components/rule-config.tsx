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
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="rule.then.level" // Note: Schema might need current 'level' field
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('scale.level')} *</FormLabel>
                    <FormControl>
                      {/* Assuming LevelSelect handles value mapping */}
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
                      <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder={t('minutes')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
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
    name: `rule.and.${andIndex}.or` as any, // Recursive type issue with helper, casting to any
  });

  return (
    <Card className="relative group">
      {canRemove && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute right-2 top-2 z-10 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
      <CardContent className="pt-6 space-y-4">
        {orFields.map((field, index) => (
          <div key={field.id} className="relative">
            {index > 0 && (
              <div className="flex justify-center my-2">
                <span className="bg-muted px-2 py-1 text-xs rounded uppercase font-bold text-muted-foreground">{t('condition.or')}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-muted/20 p-4 rounded-lg border">
              <div className="md:col-span-4">
                <FormField
                  control={control}
                  name={`rule.and.${andIndex}.or.${index}.sensor` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sensor')} *</FormLabel>
                      <FormControl>
                        {/* Legacy maps object { value, label } to sensor field? Or just value ID?
                                 Schema says Record<any>. Legacy passes object. 
                                 SensorByEnterpriseSelect usually returns ID string.
                                 Let's assume ID. */}
                        <SensorByEnterpriseSelect
                          idEnterprise={idEnterprise}
                          value={field.value?.value || field.value} // Handle both obj and string if legacy data exists
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

              <div className="md:col-span-1 flex justify-end">
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
