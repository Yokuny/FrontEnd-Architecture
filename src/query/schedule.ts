import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DELETE, GET, PATCH, POST, PUT, request } from '@/lib/api/client.api';
import type { DbSchedule, FullSchedule, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import type { NewSchedule, ScheduledPatient, UpdateSchedule } from '@/lib/interfaces/schemas/schedule.schema';

export const scheduleKeys = {
  all: ['schedule'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (params: ScheduleQueryParams) => [...scheduleKeys.lists(), params.startDate.toISOString(), params.endDate.toISOString(), params.roomID || 'all'] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
  byPatient: (patientId: string) => [...scheduleKeys.all, 'patient', patientId] as const,
};

async function fetchSchedules(params: ScheduleQueryParams): Promise<PartialSchedule[]> {
  const paramsObj: Record<string, string> = {
    startDate: params.startDate.toISOString(),
    endDate: params.endDate.toISOString(),
  };
  if (params.roomID && params.roomID !== 'all') {
    paramsObj.roomID = params.roomID;
  }
  const queryParams = new URLSearchParams(paramsObj);
  const res = await request(`schedule/partial?${queryParams}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialSchedule[];
}

async function fetchSchedule(id: string): Promise<FullSchedule> {
  const res = await request(`schedule/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FullSchedule;
}

async function fetchPatientSchedules(patientId: string): Promise<PatientScheduleData> {
  const res = await request(`schedule?Patient=${patientId}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PatientScheduleData;
}

export function useScheduleQuery(params: ScheduleQueryParams) {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => fetchSchedules(params),
    enabled: !!params.startDate && !!params.endDate,
  });
}

export function useScheduleDetailQuery(id?: string) {
  return useQuery({
    queryKey: scheduleKeys.detail(id ?? ''),
    queryFn: () => fetchSchedule(id!),
    enabled: !!id,
  });
}

export function usePatientSchedulesQuery(patientId?: string) {
  return useQuery({
    queryKey: scheduleKeys.byPatient(patientId ?? ''),
    queryFn: () => fetchPatientSchedules(patientId!),
    enabled: !!patientId,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: NewSchedule) => {
      const res = await request('schedule/create', POST(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useCreateScheduledPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ScheduledPatient) => {
      const res = await request('schedule/scheduled-patient', POST(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSchedule }) => {
      const res = await request(`schedule/${id}`, PUT(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useUpdateScheduleTime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { start: string; end: string } }) => {
      const res = await request(`schedule/${id}/time`, PATCH(data));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useUpdateScheduleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await request(`schedule/${id}/status`, PATCH({ status }));
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await request(`schedule/${id}`, DELETE());
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
}

export function useRequestScheduleConfirmation() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await request(`schedule/${id}/confirmation-passkey`, POST({}));
      if (!res.success) throw new Error(res.message);
      return res;
    },
  });
}

export type ScheduleQueryParams = {
  startDate: Date;
  endDate: Date;
  roomID: string;
};

interface PatientScheduleData {
  nextEvent: DbSchedule | null;
  futureEvents: DbSchedule[];
  pastEvents: DbSchedule[];
}
