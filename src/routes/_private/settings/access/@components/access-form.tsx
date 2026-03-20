import type { UseFormReturn } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { PasswordUpdate } from '@/lib/interfaces/schemas/user.schema';

export function AccessForm({ form, isPending }: AccessFormProps) {
  const sections: FormSection[] = [
    {
      title: 'Alteração de Senha',
      description: 'Atualize sua senha para manter sua conta segura.',
      fields: [
        <FormField
          key="oldPassword"
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha antiga</FormLabel>
              <FormControl>
                <Input placeholder="Digite sua senha antiga" type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="newPassword"
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input placeholder="Digite uma nova senha" type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="confirmPassword"
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input placeholder="Repita a nova senha" type="password" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}

interface AccessFormProps {
  form: UseFormReturn<PasswordUpdate>;
  isPending: boolean;
}
