import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useSensorFunction } from '@/hooks/use-sensor-functions-api';
import { SensorFunctionForm } from './@components/sensor-function-form';
import { replacePlaceholdersWithArray } from './@consts/sensor-function-utils';
import { useSensorFunctionForm } from './@hooks/use-sensor-function-form';

const sensorFunctionAddSearchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/sensor-functions/add')({
  component: SensorFunctionAddPage,
  validateSearch: sensorFunctionAddSearchSchema,
  beforeLoad: () => ({
    title: 'sensor.function',
  }),
});

function SensorFunctionAddPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useSearch({ from: '/_private/register/sensor-functions/add' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data: sensorFunction, isLoading } = useSensorFunction(id);

  const initialData = React.useMemo(() => {
    if (!sensorFunction) return undefined;
    return {
      ...sensorFunction,
      algorithm: replacePlaceholdersWithArray(sensorFunction.algorithm, sensorFunction.sensorsIn),
      idSensor: sensorFunction.idSensor || sensorFunction.sensor?.value,
      idMachines: sensorFunction.idMachines || sensorFunction.machines?.map((m: any) => m.value) || [],
    };
  }, [sensorFunction]);

  const { form, onSubmit, onToggle, isPending } = useSensorFunctionForm(idEnterprise || '', initialData);

  if ((id && isLoading) || !idEnterprise) {
    return (
      <Card>
        <CardHeader title={t('sensor.function')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('sensor.function')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <SensorFunctionForm idEnterprise={idEnterprise} />
          </CardContent>
          <CardFooter layout="multi">
            <div>
              {id && !isLoading && (
                <Button variant={sensorFunction?.enabled ? 'destructive' : 'default'} type="button" onClick={onToggle} disabled={isPending}>
                  {t(sensorFunction?.enabled ? 'to.disable' : 'to.enable')}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={() => navigate({ to: '/register/sensor-functions', search: { page: 1, size: 20 } })}>
                {t('cancel')}
              </Button>
              <Button onClick={onSubmit} disabled={isPending}>
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
