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
        <Item key={field.id} variant="outline" className="flex-col items-stretch p-0 overflow-hidden bg-muted/5 border-muted-foreground/10 mb-2">
          <ItemHeader className="p-4 bg-muted/10 border-b border-muted-foreground/10">
            <div className="md:col-span-11 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive h-8 w-8 hover:bg-destructive/10">
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
        className="text-primary hover:text-primary hover:bg-primary/10 ml-4"
        disabled={!idEnterprise}
      >
        <Plus className="size-4 mr-2" />
        {t('add.item')}
      </Button>
    </div>
  );
}
