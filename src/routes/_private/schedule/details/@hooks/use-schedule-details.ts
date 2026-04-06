import { useClinicStore } from '@/hooks/clinic';
import { usePatientStore } from '@/hooks/patients';
import { useProfessionalStore } from '@/hooks/professionals';
import { useClinicApi } from '@/query/clinic';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';
import { usePatientSchedulesQuery } from '@/query/schedule';

export function useScheduleDetails(id: string | undefined) {
  const { data: clinic } = useClinicApi();
  const { getRoomName: getRoomNameUtil } = useClinicStore();
  const { data: patients } = usePatientsQuery();
  const { data: professionals } = useProfessionalsQuery();
  const { data, isLoading } = usePatientSchedulesQuery(id);

  const getPatientName = (patientId: string | undefined) => usePatientStore.getState().getName(patients, patientId);
  const getRoomName = (roomId: string | undefined) => getRoomNameUtil(clinic, roomId);
  const getProfessionalName = (profId: string | undefined) => useProfessionalStore.getState().getName(professionals, profId);

  return {
    data,
    isLoading,
    getPatientName,
    getRoomName,
    getProfessionalName,
  };
}
