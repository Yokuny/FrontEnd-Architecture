import { Edit2, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ParamFormData, ParamOption } from '../@interface/param';
import ItemParamsModal from './item-params-modal';

export function ParamForm() {
  const { t } = useTranslation();
  const { control } = useFormContext<ParamFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'options',
  });

  const [showModal, setShowModal] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

  const handleAddOption = () => {
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleEditOption = (index: number) => {
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSaveOption = (data: ParamOption) => {
    if (editingIndex !== null) {
      update(editingIndex, data);
    } else {
      append(data);
    }
    setShowModal(false);
  };

  const typeOptions = [
    { value: 'JUSTIFY', label: t('justify') },
    { value: 'OTHER', label: t('other') },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('identification')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('params.identification.description')}</p>
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full">
              <FormField
                control={control}
                name="idEnterprise"
                render={({ field }) => (
                  <FormItem>
                    <Field className="gap-2">
                      <FieldLabel>{t('enterprise')}</FieldLabel>
                      <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Field className="gap-2">
                      <FieldLabel>{t('description')}</FieldLabel>
                      <Input {...field} placeholder={t('description.placeholder')} maxLength={150} />
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Field className="gap-2">
                      <FieldLabel>{t('type')}</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('type')} />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-foreground">{t('options')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('params.options.description')}</p>
        </div>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('value')}</TableHead>
                <TableHead>{t('label')}</TableHead>
                <TableHead className="text-center w-20">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{field.value}</TableCell>
                  <TableCell>{field.label}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button type="button" size="icon" className="size-8" onClick={() => handleEditOption(index)}>
                        <Edit2 className="size-4" />
                      </Button>
                      <Button type="button" size="icon" className="size-8 text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {fields.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    {t('no.options')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center">
            <Button type="button" onClick={handleAddOption} className="gap-2">
              <PlusCircle className="size-4" />
              {t('add.options')}
            </Button>
          </div>
        </div>
      </div>

      <ItemParamsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSaveOption}
        dataInitial={editingIndex !== null ? (fields[editingIndex] as any) : undefined}
      />
    </div>
  );
}
