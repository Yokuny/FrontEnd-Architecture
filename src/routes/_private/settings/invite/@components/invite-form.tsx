import type { UseFormReturn } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { UserInvite } from '@/lib/interfaces/schemas/user.schema';

export function InviteForm({ form, isPending, clinic }: InviteFormProps) {
  const sections: FormSection[] = [
    {
      title: 'Dados do Integrante',
      description: 'Informe o e-mail do usuário e determine o nível de acesso à plataforma.',
      fields: [
        <FormField
          key="email"
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail do usuário</FormLabel>
              <FormControl>
                <Input placeholder="Digite o e-mail do usuário" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="role"
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Médico</SelectItem>
                    <SelectItem value="assistant">Recepcionista</SelectItem>
                    <SelectItem value="guest">Visitante</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                {field.value === 'professional' && 'Visível nos seletores de profissional. Pode criar, visualizar e editar dados associados ao seu nome.'}
                {field.value === 'assistant' && 'Tem foco em agendamentos e dados dos clientes. Pode criar, visualizar e editar todos os dados da clínica.'}
                {field.value === 'guest' && 'Pode visualizar dados da agenda e pacientes cadastrados.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: 'Salas de Atendimento',
      description: 'Libere acesso para o integrante visualizar e agendar nas salas selecionadas.',
      fields: [
        <FormField
          key="rooms"
          control={form.control}
          name="rooms"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-4">
              <FormControl>
                <div className="flex flex-col gap-4">
                  {clinic?.rooms?.map((room: any) => (
                    <div key={room._id} className="flex items-center justify-between rounded-lg border p-4">
                      <label htmlFor={room._id} className="cursor-pointer font-semibold">
                        {room.name}
                      </label>
                      <Switch
                        id={room._id}
                        checked={field.value?.includes(room._id || '')}
                        onCheckedChange={(checked) => {
                          const currentRooms = field.value || [];
                          if (checked) {
                            field.onChange([...currentRooms, room._id]);
                          } else {
                            field.onChange(currentRooms.filter((id: string) => id !== room._id));
                          }
                        }}
                        disabled={isPending}
                      />
                    </div>
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}

interface InviteFormProps {
  form: UseFormReturn<UserInvite>;
  isPending: boolean;
  clinic: any;
}
