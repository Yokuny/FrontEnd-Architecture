import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TypeServiceMaintenanceSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Textarea } from '@/components/ui/textarea';
import type { MaintenancePlanFormData } from '../@interface/maintenance-plan';

export function ServicesGroupedField() {
  const { t } = useTranslation();
  const { control } = useFormContext<MaintenancePlanFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'servicesGrouped',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('services.grouped')}</h3>
        <Button type="button" onClick={() => append({ groupName: '', itens: [] })}>
          <Plus className="size-4 mr-2" />
          {t('add.group')}
        </Button>
      </div>

      <div className="grid gap-6">
        {fields.map((field, index) => (
          <GroupItem key={field.id} index={index} onRemove={() => remove(index)} />
        ))}
      </div>
    </div>
  );
}

function GroupItem({ index, onRemove }: { index: number; onRemove: () => void }) {
  const { t } = useTranslation();
  const { control } = useFormContext<MaintenancePlanFormData>();

  return (
    <Item variant="outline" className="flex p-0 overflow-auto bg-secondary">
      <ItemHeader className="px-4 py-2 border-b flex items-center">
        <ItemTitle className="uppercase tracking-wider">
          {t('group')} {index + 1}
        </ItemTitle>
        <ItemActions>
          <Button type="button" size="icon" onClick={onRemove} className="text-destructive">
            <Trash2 className="size-4" />
          </Button>
        </ItemActions>
      </ItemHeader>
      <div className="p-4 space-y-4 w-full">
        <FormField
          control={control}
          name={`servicesGrouped.${index}.groupName`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name.group')} *</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('name.group')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-2 border-t">
          <ServiceItemsField groupIndex={index} />
        </div>
      </div>
    </Item>
  );
}

function ServiceItemsField({ groupIndex }: { groupIndex: number }) {
  const { t } = useTranslation();
  const { control } = useFormContext<MaintenancePlanFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `servicesGrouped.${groupIndex}.itens`,
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-1 w-full gap-4 border-l pl-4 py-4 relative">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={control}
              name={`servicesGrouped.${groupIndex}.itens.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')} *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('description')} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: DEPRECATED ?????? */}
            <FormField
              control={control}
              name={`servicesGrouped.${groupIndex}.itens.${index}.typeService`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TypeServiceMaintenanceSelect value={field.value} onChange={field.onChange} label={undefined} placeholder={t('type.service')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`servicesGrouped.${groupIndex}.itens.${index}.observation`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('observation')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={t('observation.optional')} rows={2} className="bg-background min-h-[60px] resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" onClick={() => append({ description: '', observation: '', typeService: undefined })}>
        <Plus className="size-4 mr-2" />
        {t('add.service')}
      </Button>
    </div>
  );
}
