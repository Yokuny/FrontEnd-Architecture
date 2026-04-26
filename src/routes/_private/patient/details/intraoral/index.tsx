import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';
import { usePatientQuery } from '@/query/patient';
import { useIntraoralForm } from './@hooks/use-intraoral-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/intraoral/')({
  component: IntraoralFormPage,
  staticData: {
    title: t('intraoral'),
    description: t('intraoral.page.description'),
  },
  validateSearch: searchSchema,
});

function IntraoralFormPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);

  const intraoral = patient?.intraoral;
  const hasExisting = intraoral && intraoral.updatedAt !== intraoral.createdAt;

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'intraoral' } });

  const { form, isSubmitting, onSubmit } = useIntraoralForm(id, intraoral, goBack);

  const sections = [
    {
      title: t('oral.health.assessment'),
      description: t('intraoral.health.fields.description'),
      fields: [
        <div key="health" className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="hygiene"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('hygiene')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">{t('tooth.status.normal')}</SelectItem>
                      <SelectItem value="regular">{t('condition.regular')}</SelectItem>
                      <SelectItem value="deficiente">{t('condition.deficient')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="halitosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('halitosis')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausente">{t('tooth.status.missing')}</SelectItem>
                      <SelectItem value="moderada">{t('intensity.moderate')}</SelectItem>
                      <SelectItem value="forte">{t('intensity.strong')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tartar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('tartar')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausente">{t('absent')}</SelectItem>
                      <SelectItem value="pouco">{t('amount.little')}</SelectItem>
                      <SelectItem value="muito">{t('amount.much')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gums"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('gum')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">{t('tooth.status.normal')}</SelectItem>
                      <SelectItem value="gengivite">{t('gingivitis')}</SelectItem>
                      <SelectItem value="periodontite">{t('tooth.status.periodontitis')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mucosa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('mucosa')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">{t('tooth.status.normal')}</SelectItem>
                      <SelectItem value="alterada">{t('altered')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('oral.parts.exam'),
      description: t('oral.parts.exam.description'),
      fields: [
        <div key="regions" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tongue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('tongue')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.tongue')} disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="palate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('palate.roof')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.palate')} disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="oralFloor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('oral.floor')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.oral.floor')} disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lips"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lips')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.lips')} disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otherObservations"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('other.observations')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.other.symptoms')} disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage />
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
          <Button type="button" variant="info" onClick={goBack} disabled={isSubmitting || isLoadingPatient || !patient}>
            <Cross className="size-4" />
            <span className="sr-only md:not-sr-only">{t('cancel')}</span>
          </Button>
          <Button type="submit" form="intraoral-form" disabled={isSubmitting || isLoadingPatient || !patient}>
            {isSubmitting ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{hasExisting ? t('update') : t('register')}</span>
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
            <form onSubmit={onSubmit} id="intraoral-form">
              <DefaultFormLayout sections={sections} />
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button type="button" variant="info" onClick={goBack} disabled={isSubmitting || isLoadingPatient || !patient}>
            <Cross className="size-4" />
            <span className="sr-only md:not-sr-only">{t('cancel')}</span>
          </Button>
          <Button type="submit" form="intraoral-form" disabled={isSubmitting || isLoadingPatient || !patient}>
            {isSubmitting ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{hasExisting ? t('update') : t('register')}</span>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
