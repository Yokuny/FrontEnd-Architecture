import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
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
import { useSensor, useSensorsApi } from '@/hooks/use-sensors-api';
import { SensorForm } from './@components/sensor-form';
import { useSensorForm } from './@hooks/use-sensor-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/sensors/add')({
  component: SensorAddPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'sensor',
  }),
});

function SensorAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/sensors/add' });
  const { data: sensor, isLoading } = useSensor(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'sensor.edit' : 'sensor.new')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <SensorAddFormContent initialData={sensor} />;
}

function SensorAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteSensor } = useSensorsApi();
  const { form, onSubmit, isPending } = useSensorForm({
    id: initialData?.id,
    sensorId: initialData?.sensorId,
    idEnterprise: initialData?.enterprise?.id,
    sensor: initialData?.sensor,
    description: initialData?.description,
    type: initialData?.type,
    unit: initialData?.unit,
    valueMin: initialData?.valueMin,
    valueMax: initialData?.valueMax,
  });

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteSensor.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/sensors' } as { to: string });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('sensor.edit') : t('sensor.new')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <SensorForm isEdit={!!initialData} />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteSensor.isPending || isPending}>
                    {deleteSensor.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
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
            <Button type="submit" disabled={isPending || deleteSensor.isPending} className="min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
