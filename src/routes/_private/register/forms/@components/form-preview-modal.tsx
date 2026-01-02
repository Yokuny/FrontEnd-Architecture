import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { FormFieldPreview } from './form-field-preview';

interface FormPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: any[];
  idEnterprise?: string;
}

export function FormPreviewModal({ open, onOpenChange, fields, idEnterprise }: FormPreviewModalProps) {
  const { t } = useTranslation();
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const handleValueChange = (name: string, value: any) => {
    setPreviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="text-xl font-bold">{t('form.preview', 'Pré visualização do formulário')}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-12rem)]">
          <div className="p-6">
            <div className="grid grid-cols-12 gap-x-6 gap-y-4">
              {fields.length > 0 ? (
                fields.map((field: any, index: number) => (
                  <FormFieldPreview
                    key={field.id || `preview-${field.name}-${index}`}
                    field={field}
                    value={previewData[field.name]}
                    onChange={(val) => handleValueChange(field.name, val)}
                    idEnterprise={idEnterprise}
                  />
                ))
              ) : (
                <div className="col-span-12 py-24 text-center text-muted-foreground border-2 border-dashed rounded-lg">{t('no.fields', 'Nenhum campo adicionado')}</div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
