import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET, POST, PUT, request } from '@/lib/api/client';
import type { NewClinic } from '@/lib/interfaces/schemas/clinic.schema';
import type { PasswordUpdate, UpdateRoleAndRoom, UserInvite } from '@/lib/interfaces/schemas/user.schema';
import type { UserRolesAndRooms } from '@/lib/interfaces/user';
import { clinicKeys } from '@/query/clinic';
import { proceduresKeys } from '@/query/procedures';
import { userKeys } from '@/query/user';

export const settingsKeys = {
  rolesAndRooms: () => [...userKeys.all, 'roles-and-rooms'] as const,
};

export function useRolesAndRoomsQuery() {
  return useQuery({
    queryKey: settingsKeys.rolesAndRooms(),
    queryFn: async () => {
      const res = await request('user/roles-and-rooms', GET());
      if (!res.success) throw new Error(res.message);
      return res.data as UserRolesAndRooms[];
    },
  });
}

export function useSettingsMutations() {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (body: any) => {
      const res = await request('user/update', PUT(body));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const changePassword = useMutation({
    mutationFn: async (body: Partial<PasswordUpdate>) => {
      const res = await request('user/change-password', PUT(body));
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });

  const saveClinic = useMutation({
    mutationFn: async ({ data, isUpdate }: { data: NewClinic; isUpdate: boolean }) => {
      const endpoint = isUpdate ? 'clinic' : 'clinic/create';
      const res = await request(endpoint, isUpdate ? PUT(data) : POST(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicKeys.all });
      // Invalidate user queries to refresh permissions if needed
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: ['procedures'] });
    },
  });

  const updateProcedures = useMutation({
    mutationFn: async (procedures: any[]) => {
      const res = await request('procedure', PUT({ procedures }));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proceduresKeys.all });
    },
  });

  const inviteUser = useMutation({
    mutationFn: async (body: UserInvite) => {
      const res = await request('user/user-invite', POST(body));
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });

  const updatePermissions = useMutation({
    mutationFn: async (body: UpdateRoleAndRoom) => {
      const res = await request('user/update-role-and-room', PUT(body));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.rolesAndRooms() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  return {
    updateProfile,
    changePassword,
    saveClinic,
    updateProcedures,
    inviteUser,
    updatePermissions,
  };
}
