import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';

import { type UserInvite, userInviteSchema } from '@/lib/interfaces/schemas/user.schema';
import { useClinicApi } from '@/query/clinic';
import { useSettingsMutations } from '../@hooks/use-settings-api';

export function SettingsInvite() {
  const { data: clinic, isLoading } = useClinicApi();
  const { inviteUser } = useSettingsMutations();

  const form = useForm<UserInvite>({
    resolver: zodResolver(userInviteSchema),
    defaultValues: {
      email: '',
      rooms: [],
      role: 'professional',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: UserInvite) => {
    try {
      await inviteUser.mutateAsync({
        email: values.email,
        role: values.role,
        rooms: values.rooms,
      });
      toast.success('Convite enviado com sucesso');
      form.reset();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao enviar convite');
    }
  };

  if (isLoading) return <DefaultLoading />;
  if (!clinic) return null;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Convidar integrantes</CardTitle>
        <CardDescription>Envie convites por e-mail para novos usuários criarem suas contas.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o e-mail do usuário" disabled={inviteUser.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={inviteUser.isPending}>
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
            />

            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4">
                  <FormLabel className="text-base">Salas de Atendimento</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {clinic.rooms?.map((room) => (
                        <div key={room._id} className="flex items-center justify-between rounded-lg border p-4">
                          <label htmlFor={room._id} className="font-semibold">
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
                                field.onChange(currentRooms.filter((id) => id !== room._id));
                              }
                            }}
                            disabled={inviteUser.isPending}
                          />
                        </div>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={inviteUser.isPending} className="min-w-[150px]">
              {inviteUser.isPending && <Spinner className="mr-2 size-4" />}
              Enviar convite
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
