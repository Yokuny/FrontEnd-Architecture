import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { SensorByEnterpriseSelect } from '@/components/selects/sensor-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { useSensorFunction } from '@/hooks/use-sensor-functions-api';
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

  const initialData = sensorFunction
    ? {
        ...sensorFunction,
        algorithm: replacePlaceholdersWithArray(sensorFunction.algorithm, sensorFunction.sensorsIn),
        idSensor: sensorFunction.idSensor || sensorFunction.sensor?.value,
        idMachines: sensorFunction.idMachines || sensorFunction.machines?.map((m: any) => m.value) || [],
      }
    : undefined;

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
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DefaultFormLayout
              sections={[
                {
                  title: t('general.information'),
                  description: t('sensor.function.general.desc'),
                  fields: [
                    <FormField
                      key="description"
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('description')}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('description.placeholder')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                    <FormField
                      key="algorithm"
                      control={form.control}
                      name="algorithm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sensor.function.input.title')}</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={4} className="font-mono mt-1" placeholder={t('sensor.function.algorithm.placeholder')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                  ],
                },
                {
                  title: t('associations'),
                  description: t('sensor.function.associations.desc'),
                  fields: [
                    <FormField
                      key="idSensor"
                      control={form.control}
                      name="idSensor"
                      render={({ field }) => (
                        <FormItem>
                          <SensorByEnterpriseSelect label={t('result.sensor')} idEnterprise={idEnterprise} value={field.value} onChange={(val) => field.onChange(val)} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                    <FormField
                      key="idMachines"
                      control={form.control}
                      name="idMachines"
                      render={({ field }) => (
                        <FormItem>
                          <MachineByEnterpriseSelect mode="multi" label={t('machines')} idEnterprise={idEnterprise} value={field.value} onChange={(vals) => field.onChange(vals)} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                  ],
                },
              ]}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter layout="multi">
        <div>
          {id && !isLoading && (
            <Button
              variant="outline"
              type="button"
              onClick={onToggle}
              disabled={isPending}
              className={sensorFunction?.enabled ? 'text-destructive border-destructive hover:bg-destructive/10' : 'text-warning border-warning hover:bg-warning/10'}
            >
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
    </Card>
  );
}
