import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { usePatientQuery } from '@/query/patient';
import { useIntraoralForm } from './@hooks/use-intraoral-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/intraoral/')({
  component: IntraoralFormPage,
  staticData: {
    title: 'Intraoral',
    description: 'Avaliação da saúde bucal do paciente.',
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
      title: 'Avaliação da Saúde Bucal',
      description: 'Higiene, hálito, tártaro, gengiva e mucosa',
      fields: [
        <div key="health" className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="hygiene"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Higiene</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="deficiente">Deficiente</SelectItem>
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
                <FormLabel>Hálito</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausente">Ausente</SelectItem>
                      <SelectItem value="moderada">Moderado</SelectItem>
                      <SelectItem value="forte">Forte</SelectItem>
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
                <FormLabel>Tártaro</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ausente">Ausente</SelectItem>
                      <SelectItem value="pouco">Pouco</SelectItem>
                      <SelectItem value="muito">Muito</SelectItem>
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
                <FormLabel>Gengiva</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="gengivite">Gengivite</SelectItem>
                      <SelectItem value="periodontite">Periodontite</SelectItem>
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
                <FormLabel>Mucosa</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alterada">Alterada</SelectItem>
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
      title: 'Exame das Partes da Boca',
      description: 'Língua, palato, assoalho, lábios e observações',
      fields: [
        <div key="regions" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tongue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Língua</FormLabel>
                <FormControl>
                  <Input placeholder="Como está a língua?" disabled={isSubmitting} {...field} />
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
                <FormLabel>Céu da boca</FormLabel>
                <FormControl>
                  <Input placeholder="Como está o céu da boca?" disabled={isSubmitting} {...field} />
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
                <FormLabel>Assoalho bucal</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva o assoalho bucal." disabled={isSubmitting} {...field} />
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
                <FormLabel>Lábios</FormLabel>
                <FormControl>
                  <Input placeholder="Como estão os lábios?" disabled={isSubmitting} {...field} />
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
                <FormLabel>Outras Observações</FormLabel>
                <FormControl>
                  <Input placeholder="Outros sintomas? Preocupações?" disabled={isSubmitting} {...field} />
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
          <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting || isLoadingPatient || !patient}>
            <Cross className="size-4" />
            <span className="sr-only md:not-sr-only">Cancelar</span>
          </Button>
          <Button type="submit" form="intraoral-form" disabled={isSubmitting || isLoadingPatient || !patient}>
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
            <form onSubmit={onSubmit} id="intraoral-form">
              <DefaultFormLayout sections={sections} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
