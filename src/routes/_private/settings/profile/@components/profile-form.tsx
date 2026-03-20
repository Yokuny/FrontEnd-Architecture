import type { UseFormReturn } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Profile } from '@/lib/interfaces/schemas/user.schema';
import type { PartialUser } from '@/lib/interfaces/user';

export function ProfileForm({ form, isPending, user }: ProfileFormProps) {
  const sections: FormSection[] = [
    {
      title: 'Informações Básicas',
      description: 'Atualize seus dados pessoais e de acesso.',
      fields: [
        <FormField
          key="name"
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome de usuário" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="email" className="flex flex-col gap-2">
          <FormLabel>E-mail</FormLabel>
          <Input disabled value={user?.email || ''} />
        </div>,
        <FormField
          key="image"
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
                  <Input placeholder="URL da imagem..." disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}

interface ProfileFormProps {
  form: UseFormReturn<Profile>;
  isPending: boolean;
  user: PartialUser | undefined;
}
