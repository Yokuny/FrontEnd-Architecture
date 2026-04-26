import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Save from '@/components/icons/Save.Icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { t } from '@/lib/helpers/translate.helper';
import type { UpdateRoleAndRoom } from '@/lib/interfaces/schemas/user.schema';
import { useClinicApi } from '@/query/clinic';
import { useRolesAndRoomsQuery, useSettingsMutations } from '../profile/@hooks/use-settings-api';

export const Route = createFileRoute('/_private/settings/permissions/')({
  component: SettingsPermissions,
  staticData: {
    title: t('permissions'),
    description: t('permissions.page.description'),
  },
});

export function SettingsPermissions() {
  const { data: clinic, isLoading: isLoadingClinic } = useClinicApi();
  const { data: users, isLoading: isLoadingUsers } = useRolesAndRoomsQuery();
  const { updatePermissions } = useSettingsMutations();

  const [userPermissions, setUserPermissions] = useState<UserPermissions[]>([]);

  useEffect(() => {
    if (users) {
      setUserPermissions(
        users.map((user) => ({
          userID: user._id ?? '',
          roles: user.role ?? [],
          rooms: user.rooms?.map((room) => room._id ?? '') ?? [],
        })),
      );
    }
  }, [users]);

  const updateUserRole = (userID: string, role: 'admin' | 'professional' | 'assistant' | 'guest', checked: boolean) => {
    setUserPermissions((prev) =>
      prev.map((user) =>
        user.userID === userID
          ? {
              ...user,
              roles: checked ? [...new Set([...user.roles, role])] : user.roles.filter((r) => r !== role),
            }
          : user,
      ),
    );
  };

  const updateUserRooms = (userID: string, roomId: string, checked: boolean) => {
    setUserPermissions((prev) =>
      prev.map((user) =>
        user.userID === userID
          ? {
              ...user,
              rooms: checked ? [...new Set([...user.rooms, roomId])] : user.rooms.filter((id) => id !== roomId),
            }
          : user,
      ),
    );
  };

  const handleSavePermissions = async () => {
    try {
      const dataToSend: UpdateRoleAndRoom = {
        permissions: userPermissions,
      };
      const result = await updatePermissions.mutateAsync(dataToSend);
      toast.success(result.message);
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  const getUserPermissions = (userID: string): UserPermissions => {
    return (
      userPermissions.find((p) => p.userID === userID) || {
        userID,
        roles: [],
        rooms: [],
      }
    );
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button onClick={handleSavePermissions} disabled={updatePermissions.isPending}>
            {updatePermissions.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('save.changes')}</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-8">
        {isLoadingClinic || isLoadingUsers ? (
          <DefaultLoading />
        ) : !clinic || !users ? (
          <DefaultEmptyData />
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {users.map((user, index) => {
              const permissions = getUserPermissions(user._id ?? '');

              return (
                <AccordionItem key={user._id} value={`user-${index}`} className="rounded-lg border px-6 hover:no-underline">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center gap-4">
                      <Avatar className="size-12">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start gap-1">
                        <h4 className="font-semibold text-lg">{user.name}</h4>
                        <div className="flex flex-wrap gap-2 text-muted-foreground text-sm">
                          {permissions.roles.length > 0 ? (
                            permissions.roles.map((role) => (
                              <span key={role}>
                                {(role === 'admin' && t('role.admin')) ||
                                  (role === 'professional' && t('role.professional')) ||
                                  (role === 'assistant' && t('role.assistant')) ||
                                  (role === 'guest' && t('role.guest'))}
                              </span>
                            ))
                          ) : (
                            <span>{t('permissions.none')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 p-2 md:p-6">
                      <h5 className="font-semibold text-primary">{t('roles')}</h5>
                      <div className="flex flex-col gap-4">
                        {['admin', 'professional', 'assistant', 'guest'].map((role) => (
                          <div className="flex items-center justify-between rounded-lg border p-6" key={`${user._id}-${role}`}>
                            <Label htmlFor={`${user._id}-${role}`} className="flex cursor-pointer flex-col items-start hover:opacity-80">
                              <span className="mb-1 font-semibold text-base">
                                {(role === 'admin' && t('role.admin')) ||
                                  (role === 'professional' && t('role.professional')) ||
                                  (role === 'assistant' && t('role.assistant')) ||
                                  (role === 'guest' && t('role.guest'))}
                              </span>
                              <span className="w-3/4 font-normal text-muted-foreground leading-relaxed">
                                {role === 'admin' && t('role.admin.description')}
                                {role === 'professional' && t('role.professional.description.permissions')}
                                {role === 'assistant' && t('role.assistant.description')}
                                {role === 'guest' && t('role.guest.description.permissions')}
                              </span>
                            </Label>
                            <Switch
                              id={`${user._id}-${role}`}
                              checked={permissions.roles.includes(role as any)}
                              onCheckedChange={(checked) => {
                                updateUserRole(user._id ?? '', role as any, checked);
                              }}
                              disabled={updatePermissions.isPending}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 p-2 pt-6 md:p-6">
                      <div className="flex flex-col gap-1">
                        <h5 className="font-semibold text-primary">{t('rooms.service')}</h5>
                        <span className="text-muted-foreground text-sm">{t('rooms.service.hint')}</span>
                      </div>
                      <div className="flex flex-col gap-4">
                        {clinic.rooms?.map((room) => (
                          <div key={room._id} className="flex items-center justify-between rounded-lg border p-6">
                            <Label htmlFor={`${user._id}-${room._id}`} className="flex cursor-pointer flex-col items-start hover:opacity-80">
                              <span className="font-semibold text-base">{room.name}</span>
                            </Label>
                            <Switch
                              id={`${user._id}-${room._id}`}
                              checked={permissions.rooms.includes(room._id ?? '')}
                              onCheckedChange={(checked) => {
                                updateUserRooms(user._id ?? '', room._id ?? '', checked);
                              }}
                              disabled={updatePermissions.isPending}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

type UserPermissions = {
  userID: string;
  roles: Array<'admin' | 'professional' | 'assistant' | 'guest'>;
  rooms: string[];
};
