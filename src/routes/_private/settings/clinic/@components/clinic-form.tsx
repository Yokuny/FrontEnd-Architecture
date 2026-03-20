import { type Control, type UseFormReturn, useFieldArray } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import Add from '@/components/icons/Add.Icon';
import Delete from '@/components/icons/Delete.Icon';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCpfCnpj } from '@/lib/helpers/formatter.helper';
import type { NewClinic } from '@/lib/interfaces/schemas/clinic.schema';

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
        <Delete className="size-4" />
      </Button>
    </div>
  );
};

export function ClinicForm({ form, isPending }: ClinicFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rooms',
  });

  const sections: FormSection[] = [
    {
      title: 'Dados da Clínica',
      description: 'Atualize o nome e o email da sua clínica.',
      fields: [
        <FormField
          key="name"
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da clínica" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="email"
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite o email da clínica" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="code"
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Digite um código para a clínica" disabled={isPending} {...field} />
              </FormControl>
              <FormDescription>Código utilizado para convidar novos integrantes ao sistema.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: 'Informações Fiscais',
      description: 'Informe o CNPJ da clínica para emissão de notas fiscais.',
      fields: [
        <FormField
          key="cnpj"
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o CNPJ da clínica"
                  disabled={isPending}
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
        />,
      ],
    },
    {
      title: 'Salas e Acesso',
      description: 'Adicione as salas de atendimento disponíveis e configure o código da clínica.',
      fields: [
        <div key="rooms" className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <FormLabel>Salas de Atendimento</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: `Sala ${fields.length + 1}` })}
                disabled={isPending}
                className="flex items-center gap-2"
              >
                <Add className="size-4" />
                Adicionar Sala
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <RoomField key={field.id} index={index} remove={() => remove(index)} control={form.control} />
            ))}
          </div>
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}

interface ClinicFormProps {
  form: UseFormReturn<NewClinic>;
  isPending: boolean;
}
