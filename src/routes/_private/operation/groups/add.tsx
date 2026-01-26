import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useGroup, useGroupsApi } from '@/hooks/use-groups-api';
import { useGroupForm } from './@hooks/use-group-form';

const groupAddSearchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/operation/groups/add')({
  component: GroupAddPage,
  validateSearch: (search: Record<string, unknown>) => groupAddSearchSchema.parse(search),
});

function GroupAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/operation/groups/add' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data: groupData, isLoading } = useGroup(id || '');

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('group')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  const initialData = groupData
    ? {
        ...groupData,
        idEnterprise: groupData.idEnterprise || groupData.enterprise?.id,
      }
    : { idEnterprise: idEnterprise || '' };

  return <GroupFormContent initialData={initialData} />;
}

function GroupFormContent({ initialData }: { initialData: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteGroup } = useGroupsApi();
  const { form, onSubmit, isPending } = useGroupForm(initialData);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subgroup',
  });

  const handleDelete = async () => {
    const id = initialData.id || initialData._id;
    if (!id) return;
    try {
      await deleteGroup.mutateAsync(id);
      navigate({ to: '/operation/groups' });
    } catch {
      // Error handled by API toast
    }
  };

  return (
    <Card>
      <CardHeader title={initialData.id || initialData._id ? t('edit.group') : t('add.group')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="p-0">
            <DefaultFormLayout
              sections={[
                {
                  title: t('identification'),
                  description: t('basic.info'),
                  fields: [
                    <FormField
                      key="idEnterprise"
                      control={form.control}
                      name="idEnterprise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('enterprise')}</FormLabel>
                          <FormControl>
                            <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} disabled={!!initialData.id || !!initialData._id} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                    <FormField
                      key="name"
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('group')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('group')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                  ],
                },
                {
                  title: t('subgroups'),
                  description: t('manage.subgroups'),
                  layout: 'vertical',
                  fields: [
                    <div key="subgroups-container" className="space-y-4">
                      <div className="flex items-center justify-end">
                        <Button type="button" variant="outline" onClick={() => append({ name: '', description: '', details: [] })}>
                          <Plus className="mr-2 size-4" />
                          {t('add')}
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <div key={field.id} className="relative flex items-end gap-4 rounded-lg border p-4">
                            <div className="grid flex-1 grid-cols-1 gap-4">
                              <FormField
                                control={form.control}
                                name={`subgroup.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('subgroup')}</FormLabel>
                                    <FormControl>
                                      <Input placeholder={t('name')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <Button type="button" className="size-10 shrink-0 text-destructive" onClick={() => remove(index)} disabled={fields.length === 1}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>,
                  ],
                },
              ]}
            />
          </CardContent>

          <CardFooter layout="multi">
            <div>
              {(initialData.id || initialData._id) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={deleteGroup.isPending || isPending}>
                      {deleteGroup.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/operation/groups' })}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending || deleteGroup.isPending} className="min-w-[120px]">
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
