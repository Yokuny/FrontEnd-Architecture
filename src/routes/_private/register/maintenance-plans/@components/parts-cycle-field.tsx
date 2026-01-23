import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PartSelect, TypeServiceMaintenanceSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemHeader } from '@/components/ui/item';
import type { MaintenancePlanFormData } from '../@interface/maintenance-plan';

export function PartsCycleField() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<MaintenancePlanFormData>();
  const idEnterprise = watch('idEnterprise');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'partsCycle',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Item key={field.id} variant="outline" className="mb-2 flex-col items-stretch overflow-hidden border-muted-foreground/10 bg-muted/5 p-0">
          <ItemHeader className="border-muted-foreground/10 border-b bg-muted/10 p-4">
            <div className="grid w-full grid-cols-1 gap-4 md:col-span-11 md:grid-cols-3">
              <FormField
                control={control}
                name={`partsCycle.${index}.part`}
                render={({ field: fieldPart }) => (
                  <FormItem>
                    <FormLabel>{t('part')}</FormLabel>
                    <FormControl>
                      <PartSelect idEnterprise={idEnterprise} value={fieldPart.value} onChange={fieldPart.onChange} label={undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`partsCycle.${index}.typeService`}
                render={({ field: fieldService }) => (
                  <FormItem>
                    <FormLabel>{t('type.service')}</FormLabel>
                    <FormControl>
                      <TypeServiceMaintenanceSelect value={fieldService.value} onChange={fieldService.onChange} label={undefined} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`partsCycle.${index}.observation`}
                render={({ field: fieldObs }) => (
                  <FormItem>
                    <FormLabel>{t('observation')}</FormLabel>
                    <FormControl>
                      <Input {...fieldObs} placeholder={t('observation.optional')} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ItemActions className="pt-6">
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="size-4" />
              </Button>
            </ItemActions>
          </ItemHeader>
        </Item>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => append({ part: undefined, typeService: undefined, observation: '' })}
        className="ml-4 text-primary hover:bg-primary/10 hover:text-primary"
        disabled={!idEnterprise}
      >
        <Plus className="mr-2 size-4" />
        {t('add.item')}
      </Button>
    </div>
  );
}
