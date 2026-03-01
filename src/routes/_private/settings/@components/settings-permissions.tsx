import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import DefaultLoading from '@/components/default-loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import type { UpdateRoleAndRoom } from '@/lib/interfaces/schemas/user.schema';
import { useClinicApi } from '@/query/clinic';
import { useRolesAndRoomsQuery, useSettingsMutations } from '../@hooks/use-settings-api';

type UserPermissions = {
  userID: string;
  roles: Array<'admin' | 'professional' | 'assistant' | 'guest'>;
  rooms: string[];
};

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
      await updatePermissions.mutateAsync(dataToSend);
      toast.success('Permissões atualizadas com sucesso!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao atualizar permissões');
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

  if (isLoadingClinic || isLoadingUsers) return <DefaultLoading />;
  if (!clinic || !users) return null;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Gerenciar Permissões</CardTitle>
        <CardDescription>Gerencie as funções e salas de atendimento dos usuários da clínica.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 px-0">
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
                              {(role === 'admin' && 'Administrador') ||
                                (role === 'professional' && 'Profissional') ||
                                (role === 'assistant' && 'Recepcionista') ||
                                (role === 'guest' && 'Visitante')}
                            </span>
                          ))
                        ) : (
                          <span>Sem permissões cadastradas</span>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 p-2 md:p-6">
                    <h5 className="font-semibold text-primary">Funções</h5>
                    <div className="flex flex-col gap-4">
                      {['admin', 'professional', 'assistant', 'guest'].map((role) => (
                        <div className="flex items-center justify-between rounded-lg border p-6" key={`${user._id}-${role}`}>
                          <Label htmlFor={`${user._id}-${role}`} className="flex cursor-pointer flex-col items-start hover:opacity-80">
                            <span className="mb-1 font-semibold text-base">
                              {(role === 'admin' && 'Administrador') ||
                                (role === 'professional' && 'Profissional') ||
                                (role === 'assistant' && 'Recepcionista') ||
                                (role === 'guest' && 'Visitante')}
                            </span>
                            <span className="w-3/4 font-normal text-muted-foreground leading-relaxed">
                              {role === 'admin' && 'Acesso total ao sistema, sem restrições, incluindo gerenciamento de usuários, configurações e dados da clínica.'}
                              {role === 'professional' && 'Visível nos seletores de profissional. Pode criar, visualizar, editar e excluir dados associados ao seu nome.'}
                              {role === 'assistant' && 'Tem foco em agendamentos e dados dos clientes. Pode criar, visualizar e editar todos os dados da clínica.'}
                              {role === 'guest' && 'Permite visualizar dados da agenda e pacientes cadastrados.'}
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
                      <h5 className="font-semibold text-primary">Salas de Atendimento</h5>
                      <span className="text-muted-foreground text-sm">Permitir a visualização e o agendamento nas salas selecionadas.</span>
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

        <Button onClick={handleSavePermissions} disabled={updatePermissions.isPending} className="min-w-[150px]">
          {updatePermissions.isPending && <Spinner className="mr-2 size-4" />}
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
}
