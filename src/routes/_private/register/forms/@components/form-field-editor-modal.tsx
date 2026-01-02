import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelMachineSelect } from '@/components/selects/model-machine-select';
import { UserSelect } from '@/components/selects/user-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataSelect } from '@/components/ui/data-select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormOptions } from '../@hooks/use-form-options';

interface FormFieldEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: any;
  onSave: (data: any) => void;
  idEnterprise: string;
}

export function FormFieldEditorModal({ open, onOpenChange, field, onSave, idEnterprise }: FormFieldEditorModalProps) {
  const { t } = useTranslation();
  const { datatypeOptions, sizeOptions } = useFormOptions();
  const [data, setData] = useState<any>(null);
  const [optionInput, setOptionInput] = useState('');

  useEffect(() => {
    if (field) {
      setData({ ...field });
    }
  }, [field]);

  if (!data) return null;

  const handleChange = (prop: string, value: any) => {
    setData((prev: any) => ({ ...prev, [prop]: value }));
  };

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  const addOption = () => {
    if (optionInput) {
      const currentOptions = data.options || [];
      handleChange('options', [...currentOptions, optionInput]);
      setOptionInput('');
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = data.options || [];
    handleChange(
      'options',
      currentOptions.filter((_: any, i: number) => i !== index),
    );
  };

  // Mock query for static options
  const dataTypeQuery = { data: datatypeOptions, isLoading: false, isError: false, status: 'success' as const };
  const sizeQuery = { data: sizeOptions, isLoading: false, isError: false, status: 'success' as const };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {data?.id ? t('edit') : t('add')} {t('field')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-2">
            <Label>{t('field.name')} *</Label>
            <Input value={data.description || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder={t('field.name')} />
          </div>

          <div className="space-y-2">
            <Label>{t('type')} *</Label>
            <DataSelect
              value={data.datatype || data.type}
              onChange={(val) => {
                handleChange('datatype', val);
                handleChange('type', val); // Keep both for safety
              }}
              query={dataTypeQuery as any}
              placeholder={t('type')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('size')} *</Label>
            <DataSelect value={data.size} onChange={(val) => handleChange('size', val)} query={sizeQuery as any} placeholder={t('size')} />
          </div>

          <div className="space-y-2">
            <Label>ID *</Label>
            <Input value={data.name || ''} onChange={(e) => handleChange('name', e.target.value)} placeholder="ID" />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox id="isRequired" checked={!!data.isRequired} onCheckedChange={(val) => handleChange('isRequired', val)} />
            <Label htmlFor="isRequired">{t('field.is.required')}</Label>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox id="isVisiblePublic" checked={data.isVisiblePublic !== false} onCheckedChange={(val) => handleChange('isVisiblePublic', val)} />
            <Label htmlFor="isVisiblePublic">{t('public')}?</Label>
          </div>

          {data.datatype === 'selectMachine' && (
            <div className="col-span-2">
              <ModelMachineSelect mode="multi" idEnterprise={idEnterprise} value={data.idModel} onChange={(val) => handleChange('idModel', val)} label={t('model.machine')} />
            </div>
          )}

          {data.isVisiblePublic === false && (
            <div className="col-span-2">
              <UserSelect multi idEnterprise={idEnterprise} values={data.usersVisible} onChangeMulti={(val) => handleChange('usersVisible', val)} label={t('user.can.view')} />
            </div>
          )}

          {(data.datatype === 'select' || data.datatype === 'radio') && (
            <div className="col-span-2 space-y-4 border-t pt-4">
              <Label>{t('options')}</Label>
              <div className="flex gap-2">
                <Input
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  placeholder={t('add.option')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addOption}>
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(data.options || []).map((opt: string, i: number) => (
                  <Badge key={`${opt}-${i}`} variant="secondary" className="flex items-center gap-1">
                    {opt}
                    <X className="size-3 cursor-pointer" onClick={() => removeOption(i)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!data.description || (!data.datatype && !data.type)}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
