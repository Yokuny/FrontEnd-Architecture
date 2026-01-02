import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { Button } from '@/components/ui/button';
import type { FormFormData } from '../@interface/form.schema';
import { FormFieldEditorModal } from './form-field-editor-modal';
import { FormFieldItemView } from './form-field-item-view';

interface FormFieldsListProps {
  form: UseFormReturn<FormFormData>;
  idEnterprise: string;
  markAsChanged: () => void;
}

export function FormFieldsList({ form, idEnterprise, markAsChanged }: FormFieldsListProps) {
  const { t } = useTranslation();
  const [editingField, setEditingField] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fields = form.watch('fields') || [];

  const handleAddField = () => {
    const nextId = fields.length > 0 ? Math.max(...fields.map((f: any) => f.id || 0)) + 1 : 1;
    const newField = {
      id: nextId,
      datatype: 'text',
      isVisiblePublic: true,
      size: '12',
      name: `field_${nextId}`,
    };
    setEditingField(newField);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditField = (index: number) => {
    setEditingField(fields[index]);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    form.setValue('fields', newFields);
    markAsChanged();
  };

  const handleSaveField = (fieldData: any) => {
    const newFields = [...fields];
    if (editingIndex !== null) {
      newFields[editingIndex] = fieldData;
    } else {
      newFields.push(fieldData);
    }
    form.setValue('fields', newFields);
    markAsChanged();
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newFields.length) {
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      form.setValue('fields', newFields);
      markAsChanged();
    }
  };

  return (
    <DefaultFormLayout
      sections={[
        {
          title: t('fields.of.form'),
          description: t('form.fields.desc', 'Gerencie os campos do formulário e sua ordem de exibição'),
          fields: [
            <div key="fields-container" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button type="button" size="sm" onClick={handleAddField}>
                  <Plus className="size-4 mr-2" />
                  {t('add.field')}
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className="space-y-2">
                  {fields.map((field: any, index: number) => (
                    <div key={field.id || index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <FormFieldItemView field={field} onEdit={() => handleEditField(index)} onRemove={() => handleRemoveField(index)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button type="button" variant="ghost" size="icon" disabled={index === 0} onClick={() => moveField(index, 'up')}>
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" disabled={index === fields.length - 1} onClick={() => moveField(index, 'down')}>
                          <ArrowDown className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-accent/20">
                  <p>{t('no.fields', 'Nenhum campo adicionado ainda.')}</p>
                </div>
              )}

              <FormFieldEditorModal open={isModalOpen} onOpenChange={setIsModalOpen} field={editingField} onSave={handleSaveField} idEnterprise={idEnterprise} />
            </div>,
          ],
        },
      ]}
    />
  );
}
