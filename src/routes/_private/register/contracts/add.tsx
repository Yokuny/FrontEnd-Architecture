import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import React from 'react';
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
import { useContract, useContractsApi } from '@/hooks/use-contracts-api';
import { ContractForm } from './@components/contract-form';
import { useContractForm } from './@hooks/use-contract-form';

const searchSchema = z.object({
  id: z.string().optional(),
  duplicate: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/contracts/add')({
  component: ContractAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
});

function ContractAddPage() {
  const { t } = useTranslation();
  const { id, duplicate } = Route.useSearch();
  const isDuplicate = duplicate === 'true';

  const { data: contract, isLoading } = useContract(id || '');

  // Prepare initial data
  const initialData = React.useMemo(() => {
    if (!contract) return undefined;
    return {
      ...contract,
      idEnterprise: contract.idEnterprise || contract.enterprise?.id,
      id: isDuplicate ? undefined : contract.id,
      description: isDuplicate ? `${contract.description} (${t('copy', 'Copy')})` : contract.description,
    };
  }, [contract, isDuplicate, t]);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('contract')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <ContractFormContent initialData={initialData} id={id} isDuplicate={isDuplicate} />;
}

function ContractFormContent({ initialData, id, isDuplicate }: { initialData?: any; id?: string; isDuplicate: boolean }) {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { deleteContract } = useContractsApi();
  const { form, onSubmit, isPending } = useContractForm(initialData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteContract.mutateAsync(id);
      toast.success(t('delete.success'));
      navigate({ to: '/register/contracts', search: { page: 1, size: 10 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData?.id && !isDuplicate ? t('view.contract.edit') : t('view.contract.add')} />

      <Form {...form}>
        <form onSubmit={handleSave}>
          <CardContent>
            <ContractForm />
          </CardContent>

          <CardFooter layout="multi">
            {initialData?.id && !isDuplicate && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteContract.isPending || isPending}>
                    {deleteContract.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('message.users.role.name', { name: initialData.description })}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-background hover:bg-destructive/90">
                      {t('delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="ml-auto flex gap-2">
              <Button variant="outline" type="button" onClick={() => navigate({ to: '/register/contracts', search: { page: 1, size: 10 } })} disabled={isPending}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || deleteContract.isPending} className="min-w-[120px]">
                {isPending && <Spinner className="mr-2 size-4" />}
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
