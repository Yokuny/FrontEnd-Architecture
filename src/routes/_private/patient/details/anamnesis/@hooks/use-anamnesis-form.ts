import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { PUT, request } from '@/lib/api/client.api';
import { t } from '@/lib/helpers/translate.helper';
import { anamnesisSchema, type UpdateAnamnesis } from '@/lib/interfaces/schemas/patient.schema';
import { booleanToString, stringToBoolean } from '../@utils/anamnesis-utils';

export type AnamnesisFormValues = z.infer<typeof anamnesisSchema>;

export interface UseAnamnesisFormReturn {
  form: UseFormReturn<AnamnesisFormValues, any, any>;
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  hasExisting: boolean;
}

export function useAnamnesisForm(
  patientId: string | undefined,
  initialAnamnesis: UpdateAnamnesis | undefined,
  patientSex: string | undefined,
  onCancel: () => void,
): UseAnamnesisFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo<AnamnesisFormValues>(
    () => ({
      mainComplaint: initialAnamnesis?.mainComplaint || '',
      gumsBleedEasily: booleanToString(initialAnamnesis?.gumsBleedEasily),
      sensitiveTeeth: booleanToString(initialAnamnesis?.sensitiveTeeth),
      allergicToMedication: booleanToString(initialAnamnesis?.allergicToMedication),
      medicationAllergy: initialAnamnesis?.medicationAllergy || '',
      bitesPenOrPencil: booleanToString(initialAnamnesis?.bitesPenOrPencil),
      nailsBiting: booleanToString(initialAnamnesis?.nailsBiting),
      otherHarmfulHabits: initialAnamnesis?.otherHarmfulHabits || '',
      pregnant: patientSex === 'F' ? booleanToString(initialAnamnesis?.pregnant) : 'false',
      pregnancyMonth: patientSex === 'F' ? initialAnamnesis?.pregnancyMonth || 0 : 0,
      breastfeeding: patientSex === 'F' ? booleanToString(initialAnamnesis?.breastfeeding) : 'false',
      underMedicalTreatment: booleanToString(initialAnamnesis?.underMedicalTreatment),
      medicalTreatmentDetails: initialAnamnesis?.medicalTreatmentDetails || '',
      takingMedication: booleanToString(initialAnamnesis?.takingMedication),
      medicationDetails: initialAnamnesis?.medicationDetails || '',
      infectiousDisease: initialAnamnesis?.infectiousDisease || '',
      smoker: booleanToString(initialAnamnesis?.smoker),
      alcoholConsumer: booleanToString(initialAnamnesis?.alcoholConsumer),
      illnesses: {
        diabetes: booleanToString(initialAnamnesis?.illnesses?.diabetes),
        tuberculosis: booleanToString(initialAnamnesis?.illnesses?.tuberculosis),
        heartProblems: booleanToString(initialAnamnesis?.illnesses?.heartProblems),
        arthritis: booleanToString(initialAnamnesis?.illnesses?.arthritis),
        asthma: booleanToString(initialAnamnesis?.illnesses?.asthma),
        highBloodPressure: booleanToString(initialAnamnesis?.illnesses?.highBloodPressure),
        kidneyProblems: booleanToString(initialAnamnesis?.illnesses?.kidneyProblems),
        liverProblems: booleanToString(initialAnamnesis?.illnesses?.liverProblems),
        otherIllnesses: initialAnamnesis?.illnesses?.otherIllnesses || '',
      },
      importantHealthInformation: initialAnamnesis?.importantHealthInformation || '',
    }),
    [initialAnamnesis, patientSex],
  );

  const form = useForm<AnamnesisFormValues>({
    resolver: zodResolver(anamnesisSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!patientId) return;

    const body = {
      Patient: patientId,
      mainComplaint: values.mainComplaint,
      gumsBleedEasily: stringToBoolean(values.gumsBleedEasily),
      sensitiveTeeth: stringToBoolean(values.sensitiveTeeth),
      allergicToMedication: stringToBoolean(values.allergicToMedication),
      medicationAllergy: values.medicationAllergy,
      bitesPenOrPencil: stringToBoolean(values.bitesPenOrPencil),
      nailsBiting: stringToBoolean(values.nailsBiting),
      otherHarmfulHabits: values.otherHarmfulHabits,
      pregnant: patientSex === 'F' ? stringToBoolean(values.pregnant) : false,
      pregnancyMonth: patientSex === 'F' ? Number(values.pregnancyMonth) : 0,
      breastfeeding: patientSex === 'F' ? stringToBoolean(values.breastfeeding) : false,
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
      const res = await request(`patient/${patientId}/anamnesis`, PUT(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('error.save.anamnesis'));
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    isSubmitting,
    onSubmit,
    hasExisting: !!initialAnamnesis?.updatedAt,
  };
}
