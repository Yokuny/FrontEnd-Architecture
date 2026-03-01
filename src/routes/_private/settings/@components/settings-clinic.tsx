import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { type Control, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { formatCpfCnpj, numClean } from '@/lib/helpers/formatter.helper';
import { clinicSchema, type NewClinic } from '@/lib/interfaces/schemas/clinic.schema';
import { useClinicApi } from '@/query/clinic';
import { useSettingsMutations } from '../@hooks/use-settings-api';

const RoomField = ({ index, remove, control }: { index: number; remove: () => void; control: Control<NewClinic> }) => {
  return (
    <div className="flex items-start gap-2">
      <FormField
        control={control}
        name={`rooms.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input placeholder={`Nome da sala ${index + 1}`} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="size-10" type="button" variant="destructive" size="icon" onClick={remove}>
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
};

export function SettingsClinic() {
  const { data: clinic, isLoading } = useClinicApi();
  const { saveClinic } = useSettingsMutations();

  const form = useForm<NewClinic>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: '',
      email: '',
      code: '',
      cnpj: '',
      rooms: [{ name: 'Sala 1' }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rooms',
  });

  useEffect(() => {
    if (clinic) {
      form.reset({
        name: clinic.name || '',
        email: clinic.email || '',
        code: clinic.code || '',
        cnpj: clinic.cnpj || '',
        rooms: clinic.rooms?.map((room) => ({ _id: room._id, name: room.name })) || [],
      });
    }
  }, [clinic, form]);

  const onSubmit = async (values: NewClinic) => {
    const data = {
      name: values.name,
      email: values.email,
      code: values.code,
      cnpj: values.cnpj ? numClean(values.cnpj) : '',
      rooms: values.rooms.map((room) => ({
        _id: room._id,
        name: room.name,
      })),
    };

    try {
      await saveClinic.mutateAsync({ data, isUpdate: !!clinic });
      toast.success('Clínica salva com sucesso');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar clínica');
    }
  };

  if (isLoading) return <DefaultLoading />;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Informações da Clínica</CardTitle>
        <CardDescription>Obtenha ou edite as informações da clínica</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da clínica" disabled={saveClinic.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ... rest of the fields exactly like the legacy implementation ... */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o email da clínica" disabled={saveClinic.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o CNPJ da clínica"
                      disabled={saveClinic.isPending}
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatCpfCnpj(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <FormLabel>Salas de Atendimento</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: `Sala ${fields.length + 1}` })}
                    disabled={saveClinic.isPending}
                    className="flex items-center gap-2"
                  >
                    <Plus className="size-4" />
                    Adicionar Sala
                  </Button>
                </div>
                <FormDescription>Adicione as salas de atendimento disponíveis na clínica.</FormDescription>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <RoomField key={field.id} index={index} remove={() => remove(index)} control={form.control} />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite um código para a clínica" disabled={saveClinic.isPending} {...field} />
                  </FormControl>
                  <FormDescription>Código utilizado para convidar novos integrantes ao sistema.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={saveClinic.isPending} className="min-w-[120px]">
              {saveClinic.isPending && <Spinner className="mr-2 size-4" />}
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
