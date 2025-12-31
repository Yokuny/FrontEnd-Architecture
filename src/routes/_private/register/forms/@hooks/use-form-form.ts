import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useFormsApi } from '@/hooks/use-forms-api';
import type { FormFormData } from '../@interface/form.schema';

export function useFormForm(initialData?: Partial<FormFormData>) {
  const { createForm, updateForm } = useFormsApi();
  const isChanged = useRef(false);

  const form = useForm<FormFormData>({
    defaultValues: {
      id: initialData?.id || '',
      idEnterprise: initialData?.idEnterprise || '',
      description: initialData?.description || '',
      typeForm: initialData?.typeForm || '',
      fields: initialData?.fields || [],
      viewVisibility: initialData?.viewVisibility || 'all',
      viewUsers: initialData?.viewUsers || [],
      editVisibility: initialData?.editVisibility || 'all',
      editUsers: initialData?.editUsers || [],
      fillVisibility: initialData?.fillVisibility || 'all',
      fillUsers: initialData?.fillUsers || [],
      deleteFormBoardVisibility: initialData?.deleteFormBoardVisibility || 'all',
      deleteFormBoardUsers: initialData?.deleteFormBoardUsers || [],
      justifyVisibility: initialData?.justifyVisibility,
      justifyUsers: initialData?.justifyUsers || [],
      editFormFillingVisibility: initialData?.editFormFillingVisibility,
      editFormFillingUsers: initialData?.editFormFillingUsers || [],
      blockVisibility: initialData?.blockVisibility,
      blockUsers: initialData?.blockUsers || [],
      whatsapp: initialData?.whatsapp || false,
      users: initialData?.users || [],
      email: initialData?.email || false,
      emails: initialData?.emails || [],
      validations: initialData?.validations || [],
    },
  });

  const watchedData = form.watch();
  const formId = initialData?.id;

  // Persist to localStorage on changes
  useEffect(() => {
    if (isChanged.current && formId) {
      const forms = JSON.parse(localStorage.getItem('forms') || '[]');
      const updatedForms = [...forms.filter((f: { id: string }) => f.id !== formId), { id: formId, data: watchedData }];
      localStorage.setItem('forms', JSON.stringify(updatedForms));
    }
  }, [watchedData, formId]);

  const clearLocalStorage = (id: string) => {
    const forms = JSON.parse(localStorage.getItem('forms') || '[]');
    const newForms = forms.filter((f: { id: string }) => f.id !== id);
    localStorage.setItem('forms', JSON.stringify(newForms));
    isChanged.current = false;
  };

  const validateForm = (data: FormFormData): boolean => {
    if (!data.idEnterprise) {
      toast.warning('Empresa é obrigatória');
      return false;
    }
    if (!data.description) {
      toast.warning('Descrição é obrigatória');
      return false;
    }
    return true;
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!validateForm(data)) return;

    const saveData = {
      id: data.id,
      idEnterprise: data.idEnterprise,
      description: data.description,
      typeForm: data.typeForm || undefined,
      fields: data.fields,
      validations: data.validations,
      whatsapp: data.whatsapp,
      users: data.users,
      email: data.email,
      emails: data.emails,
      permissions: {
        view: {
          visibility: data.viewVisibility,
          users: data.viewUsers || [],
        },
        edit: {
          visibility: data.editVisibility,
          users: data.editUsers || [],
        },
        fill: {
          visibility: data.fillVisibility,
          users: data.fillUsers || [],
        },
        deleteFormBoard: {
          visibility: data.deleteFormBoardVisibility,
          users: data.deleteFormBoardUsers || [],
        },
        justify: {
          visibility: data.justifyVisibility || 'all',
          users: data.justifyUsers || [],
        },
        editFilling: {
          visibility: data.editFormFillingVisibility || 'all',
          users: data.editFormFillingUsers || [],
        },
        block: {
          visibility: data.blockVisibility || 'all',
          users: data.blockUsers || [],
        },
      },
    };

    if (initialData?.id) {
      await updateForm.mutateAsync(saveData);
    } else {
      await createForm.mutateAsync(saveData);
    }

    if (data.id) {
      clearLocalStorage(data.id);
    }
  });

  const markAsChanged = () => {
    isChanged.current = true;
  };

  return {
    form,
    onSubmit,
    markAsChanged,
    isPending: createForm.isPending || updateForm.isPending,
  };
}
