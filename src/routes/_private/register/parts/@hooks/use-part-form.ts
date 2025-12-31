import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { usePartsApi } from '@/hooks/use-parts-api';
import { type PartFormData, partSchema } from '../@interface/part';

export function usePartForm(initialData?: PartFormData, initialImage?: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { savePart, uploadImage } = usePartsApi();
  const [image, setImage] = useState<File | string | undefined>(initialImage?.url);
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialImage?.url);

  const form = useForm<PartFormData>({
    resolver: zodResolver(partSchema) as any,
    defaultValues: initialData || {
      name: '',
      sku: '',
      description: '',
      idEnterprise: '',
    },
  });

  const onChangeImage = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const savedPart = await savePart.mutateAsync({
        ...values,
        description: values.description || '',
      } as any);

      if (image instanceof File && savedPart.id) {
        await uploadImage.mutateAsync({ id: savedPart.id, file: image });
      }

      toast.success(t('save.successfull'));
      navigate({ to: '/register/parts', search: { page: 1, size: 10 } });
    } catch {
      // API client usually handles toast for errors
    }
  });

  return {
    form,
    onSubmit,
    image,
    imagePreview,
    onChangeImage,
    isPending: savePart.isPending || uploadImage.isPending,
  };
}
