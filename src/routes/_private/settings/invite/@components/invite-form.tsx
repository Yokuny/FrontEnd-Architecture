import type { UseFormReturn } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { t } from '@/lib/helpers/translate.helper';
import type { UserInvite } from '@/lib/interfaces/schemas/user.schema';

export function InviteForm({ form, isPending, clinic }: InviteFormProps) {
  const sections: FormSection[] = [
    {
      title: t('member.data'),
      description: t('invite.member.description'),
      fields: [
        <FormField
          key="email"
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('user.email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('user.email.placeholder')} disabled={isPending} {...field} />
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
              <FormLabel>{t('role.label')}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">{t('invite.role.professional')}</SelectItem>
                    <SelectItem value="assistant">{t('role.assistant')}</SelectItem>
                    <SelectItem value="guest">{t('role.guest')}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                {field.value === 'professional' && t('role.professional.description.invite')}
                {field.value === 'assistant' && t('role.assistant.description')}
                {field.value === 'guest' && t('role.guest.description.invite')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('rooms.service'),
      description: t('invite.rooms.description'),
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
