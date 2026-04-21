import type { UseFormReturn } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/helpers/translate.helper';
import type { Profile } from '@/lib/interfaces/schemas/user.schema';
import type { PartialUser } from '@/lib/interfaces/user.interface';

export function ProfileForm({ form, isPending, user }: ProfileFormProps) {
  const sections: FormSection[] = [
    {
      title: t('basic.info'),
      description: t('profile.basic.description'),
      fields: [
        <FormField
          key="name"
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('username')} disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="email" className="flex flex-col gap-2">
          <FormLabel>{t('email')}</FormLabel>
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
                <FormLabel>{t('profile.image.url')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('image.url.placeholder')} disabled={isPending} {...field} />
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
