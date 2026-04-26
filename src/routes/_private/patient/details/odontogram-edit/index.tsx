import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Save from '@/components/icons/Save.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { t } from '@/lib/helpers/translate.helper';
import { usePatientQuery } from '@/query/patient';
import { ToothStatusPicker } from './@components/tooth-status-picker';
import { deciduousTeethNumbers, permanentTeethNumbers } from './@consts/tooth-data';
import { useOdontogramEditForm } from './@hooks/use-odontogram-edit-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/odontogram-edit/')({
  component: OdontogramEditPage,
  staticData: {
    title: t('update.odontogram'),
    description: t('update.odontogram.description'),
  },
  validateSearch: searchSchema,
});

function OdontogramEditPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'odontogram' } });

  const { form, isSubmitting, getCurrentToothStatus, handleToothStatus, onSubmit } = useOdontogramEditForm(id, patient?.odontogram, goBack);

  const sections = [
    {
      title: t('current.state.map'),
      description: t('current.state.map.description'),
      layout: 'vertical' as const,
      fields: [
        <div key="odontogram-tabs" className="space-y-5">
          <ScrollArea>
            <FormField
              control={form.control}
              name="odontogram"
              render={() => (
                <FormItem className="w-full rounded-lg border">
                  <FormControl>
                    <Tabs defaultValue="permanentes" className="flex w-full flex-col gap-4">
                      {(['permanentes', 'deciduos'] as const).map((teethType) => {
                        const teeth = teethType === 'permanentes' ? permanentTeethNumbers : deciduousTeethNumbers;
                        return (
                          <TabsContent key={teethType} value={teethType} className="flex flex-col items-center gap-2 p-4 md:p-8">
                            <div className="flex min-w-max justify-center gap-0.5 md:gap-1">
                              {teeth.top.map((toothNumber) => (
                                <ToothStatusPicker
                                  key={toothNumber}
                                  number={toothNumber}
                                  bottom={false}
                                  currentStatus={getCurrentToothStatus(toothNumber)}
                                  onStatusChange={handleToothStatus}
                                />
                              ))}
                            </div>
                            <div className="flex min-w-max justify-center gap-0.5 md:gap-1">
                              {teeth.bottom.map((toothNumber) => (
                                <ToothStatusPicker
                                  key={toothNumber}
                                  number={toothNumber}
                                  bottom={true}
                                  currentStatus={getCurrentToothStatus(toothNumber)}
                                  onStatusChange={handleToothStatus}
                                />
                              ))}
                            </div>
                          </TabsContent>
                        );
                      })}
                      <div className="flex w-full justify-center">
                        <TabsList className="grid h-auto w-fit grid-cols-2">
                          <TabsTrigger value="permanentes">{t('teeth.permanent')}</TabsTrigger>
                          <TabsTrigger value="deciduos">{t('teeth.deciduous')}</TabsTrigger>
                        </TabsList>
                      </div>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>,
      ],
    },
  ];

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting || isLoadingPatient || !patient}>
            {isSubmitting ? <Spinner className="size-4" /> : <Save className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('save')}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoadingPatient ? (
          <DefaultLoading />
        ) : !patient ? (
          <DefaultEmptyData />
        ) : (
          <Form {...form}>
            <DefaultFormLayout sections={sections} />
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
