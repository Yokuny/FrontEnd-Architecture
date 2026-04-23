import { useClinicStore } from '@/hooks/clinic';
import { useClinicApi } from '@/query/clinic';
import { getPatientName, usePatientsQuery } from '@/query/patients';
import { getProfessionalName, useProfessionalsQuery } from '@/query/professionals';
import { usePatientSchedulesQuery } from '@/query/schedule';

export function useScheduleDetails(id: string | undefined) {
  const { data: clinic } = useClinicApi();
  const { getRoomName: getRoomNameUtil } = useClinicStore();
  const { data: patients } = usePatientsQuery();
  const { data: professionals } = useProfessionalsQuery();
  const { data, isLoading } = usePatientSchedulesQuery(id);

  const getPatientNameById = (patientId: string | undefined) => getPatientName(patients, patientId);
  const getRoomName = (roomId: string | undefined) => getRoomNameUtil(clinic, roomId);
  const getProfessionalNameById = (profId: string | undefined) => getProfessionalName(professionals, profId);

  return {
    data,
    isLoading,
    getPatientName: getPatientNameById,
    getRoomName,
    getProfessionalName: getProfessionalNameById,
  };
}
