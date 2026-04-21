import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';
import { usePatientQuery } from '@/query/patient';
import { YesNoSelect } from './@components/yes-no-select';
import { useAnamnesisForm } from './@hooks/use-anamnesis-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/anamnesis/')({
  component: AnamnesisPage,
  staticData: {
    title: t('medical.anamnesis'),
    description: t('anamnesis.page.description'),
  },
  validateSearch: searchSchema,
});

function AnamnesisPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'anamnesis' } });

  const { form, isSubmitting, onSubmit, hasExisting } = useAnamnesisForm(id, patient?.anamnesis, patient?.sex, goBack);

  const sections = [
    {
      title: t('medical.history'),
      description: t('medical.history.description'),
      fields: [
        <div key="medical-history" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mainComplaint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('main.complaint.form.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.main.complaint')} disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="infectiousDisease"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('infectious.disease.form')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.infectious.disease')} disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="importantHealthInformation"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('important.health.form')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.important.health')} disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('harmful.habits.section'),
      description: t('harmful.habits.description'),
      fields: [
        <div key="habits" className="grid grid-cols-2 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="smoker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('smoker')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alcoholConsumer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('alcohol')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bitesPenOrPencil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('bites.pen.pencil')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nailsBiting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('nails.biting')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otherHarmfulHabits"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t('other.harmful.habits')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.other.habits')} disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('special.conditions'),
      description: t('special.conditions.form.description'),
      fields: [
        <div key="conditions" className="grid grid-cols-2 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="allergicToMedication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('medication.allergy.label')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch('allergicToMedication') === 'true' && (
            <FormField
              control={form.control}
              name="medicationAllergy"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('which.medications')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholder.allergy')} disabled={isSubmitting} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="gumsBleedEasily"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('gums.bleed.label')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sensitiveTeeth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sensitive.teeth')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          {patient?.sex === 'F' && (
            <>
              <FormField
                control={form.control}
                name="pregnant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('pregnant')}</FormLabel>
                    <FormControl>
                      <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch('pregnant') === 'true' && (
                <FormField
                  control={form.control}
                  name="pregnancyMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pregnancy.month.label')}</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={10} disabled={isSubmitting} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="breastfeeding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('breastfeeding')}</FormLabel>
                    <FormControl>
                      <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="underMedicalTreatment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('under.medical.treatment')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch('underMedicalTreatment') === 'true' && (
            <FormField
              control={form.control}
              name="medicalTreatmentDetails"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('treatment.details')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholder.treatment')} disabled={isSubmitting} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="takingMedication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('taking.medications')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch('takingMedication') === 'true' && (
            <FormField
              control={form.control}
              name="medicationDetails"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t('medication.details.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholder.medications')} disabled={isSubmitting} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>,
      ],
    },
    {
      title: t('chronic.diseases'),
      description: t('chronic.diseases.description'),
      fields: [
        <div key="illnesses" className="grid grid-cols-2 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="illnesses.diabetes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.diabetes')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.tuberculosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.tuberculosis')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.heartProblems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.heart')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.arthritis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.arthritis')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.asthma"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.asthma')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.highBloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.hypertension')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.kidneyProblems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.kidney')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.liverProblems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('illness.liver')}</FormLabel>
                <FormControl>
                  <YesNoSelect value={field.value} onChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illnesses.otherIllnesses"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>{t('illness.other')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholder.other.illnesses')} disabled={isSubmitting} {...field} />
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
          <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting || isLoadingPatient || !patient}>
            <Cross className="size-4" />
            <span className="sr-only md:not-sr-only">{t('cancel')}</span>
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting || isLoadingPatient || !patient}>
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
            <DefaultFormLayout sections={sections} />
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
