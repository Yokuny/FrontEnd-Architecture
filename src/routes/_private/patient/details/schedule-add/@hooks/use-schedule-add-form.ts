import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useClinicStore } from '@/hooks/clinic';
import { useFinancialStore } from '@/hooks/financials';
import { useOdontogramStore } from '@/hooks/odontogram';
import { useProfessionalStore } from '@/hooks/professionals';
import { POST, request } from '@/lib/api/client.api';
import { t } from '@/lib/helpers/translate.helper';
import { addKey } from '@/lib/helpers/validate.helper';
import { useClinicApi } from '@/query/clinic';
import { useFinancialsPartialQuery } from '@/query/financials';
import { useOdontogramsQuery } from '@/query/odontogram';
import { useProfessionalsQuery } from '@/query/professionals';
import { useUserQuery } from '@/query/user';

export function useScheduleAddForm(patientId: string | undefined, onCancel: () => void) {
  const { data: user } = useUserQuery();
  const { data: clinic } = useClinicApi();
  const { getRoomName: getRoomNameUtil } = useClinicStore();
  const { data: professionals } = useProfessionalsQuery();
  const { data: financials } = useFinancialsPartialQuery();
  const { data: odontograms } = useOdontogramsQuery();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDateTime, setStartDateTime] = useState<string>(() => {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return now.toISOString();
  });
  const [endDateTime, setEndDateTime] = useState<string | undefined>(() => {
    const now = new Date();
    now.setHours(10, 0, 0, 0);
    return now.toISOString();
  });
  const [allDay, setAllDay] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedFinancial, setSelectedFinancial] = useState('');
  const [selectedOdontogram, setSelectedOdontogram] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState('');

  const getRoomName = useCallback((roomId: string | undefined) => getRoomNameUtil(clinic, roomId), [clinic, getRoomNameUtil]);

  const rooms = useMemo(() => {
    const clinicRooms = clinic?.rooms?.map((r: any) => ({ _id: r._id, name: r.name })) ?? [];
    const userRooms = (user?.rooms || []).map((r: any) => ({ _id: r._id, name: getRoomName(r._id) })).filter((r: any) => r.name && r.name.trim() !== '');
    const mergedMap = new Map<string, { _id: string; name: string }>();
    for (const r of [...clinicRooms, ...userRooms]) mergedMap.set(r._id, r);
    return Array.from(mergedMap.values());
  }, [clinic, user, getRoomName]);

  const form = useForm<any>({
    defaultValues: {
      Patient: patientId || '',
      Professional: '',
      Financial: '',
      Odontogram: '',
      Room: '',
      procedures: [{ procedure: '', price: 0, status: 'pending' as const }],
      title: '',
      start: '09:00',
      end: '10:00',
      allDay: false,
      status: 'pending' as const,
    },
    mode: 'onChange',
  });

  const fetchProfessionals = useCallback(async () => {
    return useProfessionalStore
      .getState()
      .mapToCombobox(professionals)
      .map((p) => ({ ...p, image: p.image || '' }));
  }, [professionals]);

  const fetchFinancials = useCallback(
    async (pid: string) => {
      return useFinancialStore.getState().mapToCombobox(financials, pid);
    },
    [financials],
  );

  const fetchOdontograms = useCallback(
    async (pid: string) => {
      return useOdontogramStore.getState().mapToCombobox(odontograms, pid);
    },
    [odontograms],
  );

  const handleSubmit = async () => {
    if (!patientId) return;
    const values = form.getValues();

    if (!values.Room && !selectedRoom) {
      toast.error(t('select.appointment.room'));
      return;
    }

    const body: any = {
      Patient: patientId,
      Room: values.Room || selectedRoom,
      start: startDateTime,
      status: 'pending',
      allDay,
    };

    addKey(body, 'end', endDateTime);
    addKey(body, 'Professional', values.Professional);
    addKey(body, 'Financial', values.Financial);
    addKey(body, 'Odontogram', values.Odontogram);
    addKey(body, 'title', values.title);
    if (values.procedures && values.procedures.length > 0) {
      const validProcedures = values.procedures.filter((p: any) => p.procedure.trim() !== '');
      if (validProcedures.length > 0) body.procedures = validProcedures;
    }

    setIsSubmitting(true);
    try {
      const res = await request('schedule/create', POST(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCancel();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : t('error.create.schedule'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    allDay,
    setAllDay,
    selectedProfessional,
    setSelectedProfessional,
    selectedFinancial,
    setSelectedFinancial,
    selectedOdontogram,
    setSelectedOdontogram,
    selectedRoom,
    setSelectedRoom,
    selectedRoomName,
    setSelectedRoomName,
    rooms,
    getRoomName,
    fetchProfessionals,
    fetchFinancials,
    fetchOdontograms,
    handleSubmit,
  };
}
