import { Edit2, PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const sections = [
    {
      title: t('identification'),
      description: t('params.identification.description'),
      fields: [
        <FormField
          key="idEnterprise"
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
        />,
        <FormField
          key="description"
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
        />,
        <FormField
          key="type"
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
        />,
      ],
    },
    {
      title: t('options'),
      description: t('params.options.description'),
      fields: [
        <div key="options-table" className="space-y-4">
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
        </div>,
      ],
    },
  ];

  return (
    <>
      <DefaultFormLayout sections={sections} />

      <ItemParamsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={handleSaveOption}
        dataInitial={editingIndex !== null ? (fields[editingIndex] as any) : undefined}
      />
    </>
  );
}
