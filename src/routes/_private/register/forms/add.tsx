import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Eye, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { type FormDetail, useForm as useFormQuery, useFormsApi } from '@/hooks/use-forms-api';
import { FormForm } from './@components/form-form';
import { FormPreviewModal } from './@components/form-preview-modal';
import { useFormForm } from './@hooks/use-form-form';
import type { FormFormData } from './@interface/form.schema';

const searchSchema = z.object({
  id: z.string().optional(),
  new: z.string().optional(),
  pending: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/forms/add')({
  component: FormAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'config.form',
  }),
});

function FormAddPage() {
  const { t } = useTranslation();
  const { id, new: isNew, pending } = useSearch({ from: '/_private/register/forms/add' });

  // If editing an existing form (not new, not pending), fetch from API
  const shouldFetchFromApi = id && isNew !== 'true' && pending !== 'true';
  const { data: formData, isLoading } = useFormQuery(shouldFetchFromApi ? id : undefined);

  // If pending, load from localStorage
  const pendingData = useMemo(() => {
    if (pending === 'true' && id) {
      const forms = JSON.parse(localStorage.getItem('forms') || '[]');
      const form = forms.find((f: { id: string }) => f.id === id);
      return form?.data;
    }
    return null;
  }, [pending, id]);

  // Generate new ID if creating new form
  const formId = useMemo(() => {
    if (isNew === 'true' && !id) {
      return uuidv4();
    }
    return id;
  }, [isNew, id]);

  if (shouldFetchFromApi && isLoading) {
    return (
      <Card>
        <CardHeader title={t('config.form')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <FormAddFormContent initialData={formData} pendingData={pendingData} formId={formId} />;
}

interface FormAddFormContentProps {
  initialData?: FormDetail;
  pendingData?: any;
  formId?: string;
}

function FormAddFormContent({ initialData, pendingData, formId }: FormAddFormContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteForm } = useFormsApi();

  // Transform API data to form data
  const transformedData: Partial<FormFormData> | undefined = useMemo(() => {
    if (pendingData) {
      return { ...pendingData, id: formId };
    }

    if (initialData) {
      return {
        id: initialData.id,
        _id: initialData._id,
        idEnterprise: initialData.enterprise?.id || '',
        description: initialData.description || '',
        typeForm: initialData.typeForm || '',
        fields: initialData.fields || [],
        viewVisibility: initialData.permissions?.view?.visibility || 'all',
        viewUsers: initialData.permissions?.view?.users || [],
        editVisibility: initialData.permissions?.edit?.visibility || 'all',
        editUsers: initialData.permissions?.edit?.users || [],
        fillVisibility: initialData.permissions?.fill?.visibility || 'all',
        fillUsers: initialData.permissions?.fill?.users || [],
        deleteFormBoardVisibility: initialData.permissions?.deleteFormBoard?.visibility || 'all',
        deleteFormBoardUsers: initialData.permissions?.deleteFormBoard?.users || [],
        justifyVisibility: initialData.permissions?.justify?.visibility,
        justifyUsers: initialData.permissions?.justify?.users || [],
        editFormFillingVisibility: initialData.permissions?.editFilling?.visibility,
        editFormFillingUsers: initialData.permissions?.editFilling?.users || [],
        blockVisibility: initialData.permissions?.block?.visibility,
        blockUsers: initialData.permissions?.block?.users || [],
        validations: initialData.validations || [],
        whatsapp: initialData.whatsapp || false,
        users: initialData.users || [],
        email: initialData.email || false,
        emails: initialData.emails || [],
      };
    }

    return formId ? { id: formId } : undefined;
  }, [initialData, pendingData, formId]);

  const { form, onSubmit, isPending, markAsChanged } = useFormForm(transformedData);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    try {
      await onSubmit();
      toast.success(t('save.successfull'));
      navigate({ to: '/register/forms', search: { page: 1, size: 10 } });
    } catch {
      // Error handled by API client
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteForm.mutateAsync(initialData.id);
      // Clear from localStorage too
      const forms = JSON.parse(localStorage.getItem('forms') || '[]');
      localStorage.setItem('forms', JSON.stringify(forms.filter((f: { id: string }) => f.id !== initialData.id)));
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/forms', search: { page: 1, size: 10 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  const fields = form.watch('fields') || [];

  return (
    <>
      <Card>
        <CardHeader title={t('config.form')}>
          {fields.length > 0 && (
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="size-4 mr-2" />
              Preview
            </Button>
          )}
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <CardContent>
              <FormForm markAsChanged={markAsChanged} />
            </CardContent>

            <CardFooter layout="multi">
              <div>
                {initialData && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" disabled={deleteForm.isPending || isPending}>
                        {deleteForm.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                        {t('delete')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('delete.confirmation')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-background">
                          {t('delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => navigate({ to: '/register/forms', search: { page: 1, size: 10 } })}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isPending || deleteForm.isPending} className="min-w-[120px]">
                  {isPending && <Spinner className="mr-2 size-4" />}
                  {t('save')}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <FormPreviewModal open={showPreview} onOpenChange={setShowPreview} fields={fields} idEnterprise={form.watch('idEnterprise')} />
    </>
  );
}
