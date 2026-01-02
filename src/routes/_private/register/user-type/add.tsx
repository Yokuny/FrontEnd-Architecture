import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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
import { useUserType, useUserTypesApi } from '@/hooks/use-user-types-api';
import { UserTypeForm } from './@components/user-type-form';
import { useUserTypeForm } from './@hooks/use-user-type-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/user-type/add')({
  component: UserTypeAddPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'type.user',
  }),
});

function UserTypeAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/user-type/add' });
  const { data: userType, isLoading } = useUserType(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('edit.type')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <UserTypeAddFormContent initialData={userType} />;
}

function UserTypeAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteUserType } = useUserTypesApi();

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      id: initialData.id,
      description: initialData.description,
      idEnterprise: initialData.enterprise?.id,
      color: initialData.color,
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useUserTypeForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteUserType.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/user-type' });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.type') : t('new.type')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <UserTypeForm />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteUserType.isPending || isPending}>
                    {deleteUserType.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
                      <Trash2 className="size-4" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit" disabled={isPending || deleteUserType.isPending} className="min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
