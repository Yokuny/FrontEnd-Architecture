import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UploadImage from '@/components/upload-image';
import type { PartFormData } from '../@interface/part';

interface PartFormProps {
  imagePreview?: string;
  onChangeImage: (file: File) => void;
  isEdit?: boolean;
}

export function PartForm({ imagePreview, onChangeImage, isEdit }: PartFormProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<PartFormData>();

  return (
    <DefaultFormLayout
      sections={[
        {
          title: t('identification'),
          description: t('part.identification.description'),
          fields: [
            <FormField
              key="idEnterprise"
              control={control as any}
              name="idEnterprise"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FormControl>
                      <EnterpriseSelect value={field.value} onChange={field.onChange} disabled={isEdit} mode="single" />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />,
            <FormField
              key="name"
              control={control as any}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('part.name.label')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('part.name.placeholder')} {...field} />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />,
            <FormField
              key="sku"
              control={control as any}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('part.sku.label')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('part.sku.placeholder')} {...field} />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />,
          ],
        },
        {
          title: t('description'),
          description: t('part.description.placeholder'),
          fields: [
            <FormField
              key="description"
              control={control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder={t('part.description.placeholder')} className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />,
          ],
        },
        {
          title: t('image'),
          description: t('part.image.description'),
          fields: [
            <Field key="image-upload" className="w-full max-w-sm gap-2">
              <UploadImage value={imagePreview} onAddFile={onChangeImage} maxSize={5 * 1024 * 1024} height={200} />
            </Field>,
          ],
        },
      ]}
    />
  );
}
