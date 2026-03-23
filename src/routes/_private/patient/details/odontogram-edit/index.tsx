import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ToothNumber from '@/components/odontogram/tooth-number';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PUT, request } from '@/lib/api/client';
import { type NewPatientOdontogram, patientOdontogramSchema } from '@/lib/interfaces/schemas/patient.schema';
import { usePatientQuery } from '@/query/patient';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/odontogram-edit/')({
  component: OdontogramEditPage,
  staticData: {
    title: 'Atualizar Odontograma',
    description: 'Atualize o status dos dentes do paciente.',
  },
  validateSearch: searchSchema,
});

type ToothStatusType = 'normal' | 'restored' | 'caries' | 'missing' | 'implant' | 'periodontitis' | 'prosthesis' | 'extracted' | 'other';

const toothStatusOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'restored', label: 'Restaurado' },
  { value: 'caries', label: 'Cárie' },
  { value: 'missing', label: 'Ausente' },
  { value: 'implant', label: 'Implante' },
  { value: 'periodontitis', label: 'Periodontite' },
  { value: 'prosthesis', label: 'Prótese' },
  { value: 'extracted', label: 'Extraído' },
  { value: 'other', label: 'Outro' },
] as const;

const permanentTeethNumbers = {
  top: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  bottom: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
};

const deciduousTeethNumbers = {
  top: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  bottom: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
};

function ToothStatusPicker({
  number,
  bottom,
  currentStatus,
  onStatusChange,
}: {
  number: number;
  bottom: boolean;
  currentStatus: ToothStatusType;
  onStatusChange: (toothNumber: number, status: ToothStatusType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ToothStatusType>(currentStatus);

  const handleChange = (value: ToothStatusType) => {
    setStatus(value);
    onStatusChange(number, value);
    setIsOpen(false);
  };

  return (
    <div className={`flex h-auto items-center justify-end gap-4 ${bottom ? 'flex-col-reverse' : 'flex-col'}`}>
      <ToothNumber toothNumber={number} status={status} />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" className="border p-1" variant="outline">
            {number}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <RadioGroup value={status} onValueChange={handleChange} className="flex flex-col gap-2">
            {toothStatusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`status-${option.value}-${number}`} />
                <Label htmlFor={`status-${option.value}-${number}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function OdontogramEditPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewPatientOdontogram>({
    resolver: zodResolver(patientOdontogramSchema),
    defaultValues: {
      odontogram: patient?.odontogram || [],
    },
    mode: 'onChange',
  });

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'odontogram' } });

  const getCurrentToothStatus = (toothNumber: number): ToothStatusType => {
    const odontogram = form.getValues('odontogram') || [];
    const tooth = odontogram.find((t) => t.number === toothNumber);
    return (tooth?.status as ToothStatusType) || 'normal';
  };

  const handleToothStatus = (toothNumber: number, status: ToothStatusType) => {
    const prev = form.getValues('odontogram') || [];
    const index = prev.findIndex((tooth) => tooth.number === toothNumber);

    if (index === -1) {
      form.setValue('odontogram', [...prev, { number: toothNumber, status }]);
    } else {
      const updated = [...prev];
      updated[index] = { number: toothNumber, status };
      form.setValue('odontogram', updated);
    }
  };

  const onSubmit = async () => {
    if (!id) return;
    const values = form.getValues();
    setIsSubmitting(true);
    try {
      const res = await request(`patient/${id}/odontogram`, PUT(values));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      goBack();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao atualizar odontograma');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPatient) return <DefaultLoading />;
  if (!patient) return <div className="p-12 text-center">Paciente não encontrado.</div>;

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            Salvar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-5">
            <ScrollArea>
              <FormField
                control={form.control}
                name="odontogram"
                render={() => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Tabs defaultValue="permanentes" className="flex w-full flex-col gap-4">
                        {(['permanentes', 'deciduos'] as const).map((teethType) => {
                          const teeth = teethType === 'permanentes' ? permanentTeethNumbers : deciduousTeethNumbers;
                          return (
                            <TabsContent key={teethType} value={teethType} className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 md:p-8">
                              <div className="flex min-w-max justify-center gap-0.5 md:gap-1">
                                {teeth.top.map((toothNumber) => (
                                  <ToothStatusPicker key={toothNumber} number={toothNumber} bottom={false} currentStatus={getCurrentToothStatus(toothNumber)} onStatusChange={handleToothStatus} />
                                ))}
                              </div>
                              <div className="flex min-w-max justify-center gap-0.5 md:gap-1">
                                {teeth.bottom.map((toothNumber) => (
                                  <ToothStatusPicker key={toothNumber} number={toothNumber} bottom={true} currentStatus={getCurrentToothStatus(toothNumber)} onStatusChange={handleToothStatus} />
                                ))}
                              </div>
                            </TabsContent>
                          );
                        })}
                        <div className="flex w-full justify-center">
                          <TabsList className="grid h-auto w-fit grid-cols-2 rounded-lg border">
                            <TabsTrigger value="permanentes">Permanentes</TabsTrigger>
                            <TabsTrigger value="deciduos">Decíduos</TabsTrigger>
                          </TabsList>
                        </div>
                      </Tabs>
                    </FormControl>
                  </FormItem>
                )}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
