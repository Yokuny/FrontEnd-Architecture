import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { type ParamFormData, paramFormSchema } from '../@interface/param';

export function useParamForm(initialData?: Partial<ParamFormData>) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<ParamFormData>({
    resolver: zodResolver(paramFormSchema),
    defaultValues: {
      id: initialData?.id,
      description: initialData?.description || '',
      idEnterprise: initialData?.idEnterprise || '',
      type: initialData?.type || '',
      options: initialData?.options || [],
    },
  });

  // Reset form when initialData changes (e.g., after async load)
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        description: initialData.description || '',
        idEnterprise: initialData.idEnterprise || '',
        type: initialData.type || '',
        options: initialData.options || [],
      });
    }
  }, [initialData, form]);

  const { mutateAsync: saveParam, isPending } = useMutation({
    mutationFn: (data: ParamFormData) => {
      // Use POST for both as per legacy code's dataToSave structure (id handled in payload)
      // or check if backend requires PUT for updates.
      // Based on legacy ParamsAdd.jsx line 103, it uses a single Fetch.post for saving.
      return api.post('/params', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['params'] });
      toast.success('save.success');
      navigate({ to: '/register/params', search: { page: 1, size: 20 } });
    },
    onError: () => {
      toast.error('error.save');
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await saveParam(data);
  });

  return {
    form,
    onSubmit,
    isPending,
  };
}
