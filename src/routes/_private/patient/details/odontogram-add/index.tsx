import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';
import { usePatientQuery } from '@/query/patient';
import Teeth from '@/routes/_private/odontogram/@components/teeth';
import { useOdontogramAddForm } from './@hooks/use-odontogram-add-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/odontogram-add/')({
  component: OdontogramAddPage,
  staticData: {
    title: t('new.odontogram'),
    description: t('new.odontogram.description'),
  },
  validateSearch: searchSchema,
});

function OdontogramAddPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'odontogram' } });

  const { form, isSubmitting, fetchProfessionals, onSubmit } = useOdontogramAddForm(id, goBack);

  const sections = [
    {
      title: t('responsible.professional'),
      description: t('odontogram.professional.description'),
      fields: [
        <FormField
          key="professional"
          control={form.control as any}
          name="Professional"
          render={({ field }) => (
            <FormItem className="w-full max-w-xs">
              <FormLabel>{t('professional')}</FormLabel>
              <FormControl>
                <ProfessionalCombobox controller={field} fetchProfessionals={fetchProfessionals} />
              </FormControl>
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('execution.map'),
      description: t('execution.map.description'),
      layout: 'vertical' as const,
      fields: [
        <div key="teeth-map" className="rounded-lg md:bg-muted md:p-6">
          <FormField
            control={form.control as any}
            name="teeth"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="text-xs md:text-md">
                  <Teeth form={field} odontogram={patient?.odontogram} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
  ];

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button form="odontogram-add-form" type="submit" disabled={isSubmitting || isLoadingPatient || !patient}>
            {isSubmitting ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('register')}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoadingPatient ? (
          <DefaultLoading />
        ) : !patient ? (
          <DefaultEmptyData />
        ) : (
          <Form {...(form as any)}>
            <form
              id="odontogram-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form.getValues());
              }}
            >
              <DefaultFormLayout sections={sections} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
