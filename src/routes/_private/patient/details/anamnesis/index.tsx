import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { PUT, request } from '@/lib/api/client';
import { anamnesisSchema } from '@/lib/interfaces/schemas/patient.schema';
import { usePatientQuery } from '@/query/patient';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/anamnesis/')({
  component: AnamnesisFormPage,
  staticData: {
    title: 'Anamnese',
    description: 'Histórico médico e hábitos do paciente.',
  },
  validateSearch: searchSchema,
});

const stringToBoolean = (value: string): boolean => value === 'true';

const YesNoSelect = ({ field, disabled }: { field: any; disabled: boolean }) => (
  <Select onValueChange={field.onChange} value={field.value}>
    <SelectTrigger className="w-full">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="true" disabled={disabled}>
        Sim
      </SelectItem>
      <SelectItem value="false" disabled={disabled}>
        Não
      </SelectItem>
    </SelectContent>
  </Select>
);

function AnamnesisFormPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const anamnesis = patient?.anamnesis;
  const hasExisting = anamnesis && anamnesis.updatedAt !== anamnesis.createdAt;
  const sex = patient?.sex;

  const form = useForm<z.input<typeof anamnesisSchema>>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues: {
      mainComplaint: anamnesis?.mainComplaint || '',
      gumsBleedEasily: anamnesis?.gumsBleedEasily ? 'true' : 'false',
      sensitiveTeeth: anamnesis?.sensitiveTeeth ? 'true' : 'false',
      allergicToMedication: anamnesis?.allergicToMedication ? 'true' : 'false',
      medicationAllergy: anamnesis?.medicationAllergy || '',
      bitesPenOrPencil: anamnesis?.bitesPenOrPencil ? 'true' : 'false',
      nailsBiting: anamnesis?.nailsBiting ? 'true' : 'false',
      otherHarmfulHabits: anamnesis?.otherHarmfulHabits || '',
      pregnant: sex === 'F' ? (anamnesis?.pregnant ? 'true' : 'false') : 'false',
      pregnancyMonth: sex === 'F' ? anamnesis?.pregnancyMonth || 0 : 0,
      breastfeeding: sex === 'F' ? (anamnesis?.breastfeeding ? 'true' : 'false') : 'false',
      underMedicalTreatment: anamnesis?.underMedicalTreatment ? 'true' : 'false',
      medicalTreatmentDetails: anamnesis?.medicalTreatmentDetails || '',
      takingMedication: anamnesis?.takingMedication ? 'true' : 'false',
      medicationDetails: anamnesis?.medicationDetails || '',
      infectiousDisease: anamnesis?.infectiousDisease || '',
      smoker: anamnesis?.smoker ? 'true' : 'false',
      alcoholConsumer: anamnesis?.alcoholConsumer ? 'true' : 'false',
      illnesses: {
        diabetes: anamnesis?.illnesses?.diabetes ? 'true' : 'false',
        tuberculosis: anamnesis?.illnesses?.tuberculosis ? 'true' : 'false',
        heartProblems: anamnesis?.illnesses?.heartProblems ? 'true' : 'false',
        arthritis: anamnesis?.illnesses?.arthritis ? 'true' : 'false',
        asthma: anamnesis?.illnesses?.asthma ? 'true' : 'false',
        highBloodPressure: anamnesis?.illnesses?.highBloodPressure ? 'true' : 'false',
        kidneyProblems: anamnesis?.illnesses?.kidneyProblems ? 'true' : 'false',
        liverProblems: anamnesis?.illnesses?.liverProblems ? 'true' : 'false',
        otherIllnesses: anamnesis?.illnesses?.otherIllnesses || '',
      },
      importantHealthInformation: anamnesis?.importantHealthInformation || '',
    },
    mode: 'onChange',
  });

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'anamnesis' } });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!id) return;
    const body = {
      Patient: id,
      mainComplaint: values.mainComplaint,
      gumsBleedEasily: stringToBoolean(values.gumsBleedEasily),
      sensitiveTeeth: stringToBoolean(values.sensitiveTeeth),
      allergicToMedication: stringToBoolean(values.allergicToMedication),
      medicationAllergy: values.medicationAllergy,
      bitesPenOrPencil: stringToBoolean(values.bitesPenOrPencil),
      nailsBiting: stringToBoolean(values.nailsBiting),
      otherHarmfulHabits: values.otherHarmfulHabits,
      pregnant: sex === 'F' ? stringToBoolean(values.pregnant) : false,
      pregnancyMonth: sex === 'F' ? Number(values.pregnancyMonth) : 0,
      breastfeeding: sex === 'F' ? stringToBoolean(values.breastfeeding) : false,
      underMedicalTreatment: stringToBoolean(values.underMedicalTreatment),
      medicalTreatmentDetails: values.medicalTreatmentDetails,
      takingMedication: stringToBoolean(values.takingMedication),
      medicationDetails: values.medicationDetails,
      infectiousDisease: values.infectiousDisease,
      smoker: stringToBoolean(values.smoker),
      alcoholConsumer: stringToBoolean(values.alcoholConsumer),
      illnesses: {
        diabetes: stringToBoolean(values.illnesses.diabetes),
        tuberculosis: stringToBoolean(values.illnesses.tuberculosis),
        heartProblems: stringToBoolean(values.illnesses.heartProblems),
        arthritis: stringToBoolean(values.illnesses.arthritis),
        asthma: stringToBoolean(values.illnesses.asthma),
        highBloodPressure: stringToBoolean(values.illnesses.highBloodPressure),
        kidneyProblems: stringToBoolean(values.illnesses.kidneyProblems),
        liverProblems: stringToBoolean(values.illnesses.liverProblems),
        otherIllnesses: values.illnesses.otherIllnesses,
      },
      importantHealthInformation: values.importantHealthInformation,
    };

    setIsSubmitting(true);
    try {
      const res = await request(`patient/${id}/anamnesis`, PUT(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      goBack();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao salvar anamnese');
    } finally {
      setIsSubmitting(false);
    }
  });

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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />
          {sex === 'F' && (
            <>
              <FormField
                control={form.control}
                name="pregnant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grávida</FormLabel>
                    <FormControl>
                      <YesNoSelect field={field} disabled={isSubmitting} />
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
                      <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
                  <YesNoSelect field={field} disabled={isSubmitting} />
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
          <Button type="submit" form="anamnesis-form" disabled={isSubmitting || isLoadingPatient || !patient} className="min-w-[120px]">
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            {hasExisting ? 'Atualizar' : 'Cadastrar'}
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
            <form onSubmit={onSubmit} id="anamnesis-form">
              <DefaultFormLayout sections={sections} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
