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
import { usePatientQuery } from '@/query/patient';
import { YesNoSelect } from './@components/yes-no-select';
import { useAnamnesisForm } from './@hooks/use-anamnesis-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/anamnesis/')({
  component: AnamnesisPage,
  staticData: {
    title: 'Anamnese',
    description: 'Histórico de saúde do paciente.',
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
      title: 'Histórico Médico',
      description: 'Queixa principal e informações de saúde',
      fields: [
        <div key="medical-history" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="mainComplaint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queixa principal</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva a queixa principal..." disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="infectiousDisease"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doença infecciosa</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a doença infecciosa..." disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="importantHealthInformation"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Informações importantes de saúde</FormLabel>
                <FormControl>
                  <Input placeholder="Digite informações importantes..." disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: 'Hábitos Prejudiciais',
      description: 'Fumante, álcool e outros hábitos',
      fields: [
        <div key="habits" className="grid grid-cols-2 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="smoker"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fumante</FormLabel>
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
                <FormLabel>Álcool</FormLabel>
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
                <FormLabel>Rói caneta/lápis</FormLabel>
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
                <FormLabel>Rói unhas</FormLabel>
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
                <FormLabel>Outros hábitos prejudiciais</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva outros hábitos..." disabled={isSubmitting} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: 'Condições Especiais',
      description: 'Alergias, medicamentos e condições médicas',
      fields: [
        <div key="conditions" className="grid grid-cols-2 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="allergicToMedication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alergia a medicamentos</FormLabel>
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
                  <FormLabel>Quais medicamentos?</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva a alergia..." disabled={isSubmitting} {...field} />
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
                <FormLabel>Gengiva sangra</FormLabel>
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
                <FormLabel>Dentes sensíveis</FormLabel>
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
                    <FormLabel>Grávida</FormLabel>
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
                      <FormLabel>Mês de gestação</FormLabel>
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
                    <FormLabel>Amamentando</FormLabel>
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
                <FormLabel>Em tratamento médico</FormLabel>
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
                  <FormLabel>Detalhes do tratamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva o tratamento..." disabled={isSubmitting} {...field} />
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
                <FormLabel>Tomando medicamentos</FormLabel>
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
                  <FormLabel>Detalhes dos medicamentos</FormLabel>
                  <FormControl>
                    <Input placeholder="Descreva os medicamentos..." disabled={isSubmitting} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>,
      ],
    },
    {
      title: 'Doenças Crônicas',
      description: 'Condições médicas pré-existentes',
      fields: [
        <div key="illnesses" className="grid grid-cols-2 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="illnesses.diabetes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diabetes</FormLabel>
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
                <FormLabel>Tuberculose</FormLabel>
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
                <FormLabel>Problemas cardíacos</FormLabel>
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
                <FormLabel>Artrite</FormLabel>
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
                <FormLabel>Asma</FormLabel>
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
                <FormLabel>Pressão alta</FormLabel>
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
                <FormLabel>Problemas renais</FormLabel>
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
                <FormLabel>Problemas hepáticos</FormLabel>
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
                <FormLabel>Outras doenças</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva outras doenças..." disabled={isSubmitting} {...field} />
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
            <span className="sr-only md:not-sr-only">Cancelar</span>
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting || isLoadingPatient || !patient}>
            {isSubmitting ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{hasExisting ? 'Atualizar' : 'Cadastrar'}</span>
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
