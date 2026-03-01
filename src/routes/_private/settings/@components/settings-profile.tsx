import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { type User, userSchema } from '@/lib/interfaces/schemas/user.schema';
import { useUserQuery } from '@/query/user';
import { useSettingsMutations } from '../@hooks/use-settings-api';

export function SettingsProfile() {
  const { data: user, isLoading } = useUserQuery();
  const { updateProfile } = useSettingsMutations();

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      image: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        image: user.image || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: User) => {
    const body = {
      name: values.name,
      ...(values.image ? { image: values.image } : {}),
    };

    try {
      await updateProfile.mutateAsync(body);
      toast.success('Perfil atualizado com sucesso');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao atualizar perfil');
    }
  };

  if (isLoading) return <DefaultLoading />;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Perfil</CardTitle>
        <CardDescription>Edite seu perfil e ajuste suas configurações de conta.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de usuário" disabled={updateProfile.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <FormLabel>E-mail</FormLabel>
              <Input disabled value={user?.email || ''} />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-14">
                    <AvatarImage src={form.watch('image')} alt="User Image" />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="w-full space-y-2">
                    <FormLabel>Imagem de perfil (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="URL da imagem..." disabled={updateProfile.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={updateProfile.isPending} className="min-w-[120px]">
              {updateProfile.isPending && <Spinner className="mr-2 size-4" />}
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
