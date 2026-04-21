import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { type Profile, profileSchema } from '@/lib/interfaces/schemas/user.schema';
import { t } from '@/lib/helpers/translate.helper';
import { useUserQuery } from '@/query/user';
import { ProfileForm } from './@components/profile-form';
import { useSettingsMutations } from './@hooks/use-settings-api';

export const Route = createFileRoute('/_private/settings/profile/')({
  component: SettingsProfile,
  staticData: {
    title: t('profile'),
    description: t('profile.page.description'),
  },
});

export function SettingsProfile() {
  const { data: user, isLoading } = useUserQuery();
  const { updateProfile } = useSettingsMutations();

  const form = useForm<Profile>({
    resolver: zodResolver(profileSchema),
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

  const onSubmit = async (values: Profile) => {
    const body = {
      name: values.name,
      ...(values.image ? { image: values.image } : {}),
    };

    try {
      const result = await updateProfile.mutateAsync(body);
      toast.success(result.message);
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="profile-form" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('save')}</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="profile-form">
              <ProfileForm form={form} isPending={updateProfile.isPending} user={user} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
