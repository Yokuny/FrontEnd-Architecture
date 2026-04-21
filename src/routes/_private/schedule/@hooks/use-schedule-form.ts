import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useClinicStore } from '@/hooks/clinic';
import { usePatientStore } from '@/hooks/patients';
import { DELETE, GET, POST, PUT, request } from '@/lib/api/client.api';
import { DefaultEndHour, DefaultStartHour } from '@/lib/config/calendar.config';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import { addKey } from '@/lib/helpers/validate.helper';
import type { NewSchedule, UpdateSchedule } from '@/lib/interfaces/schemas/schedule.schema';
import { useClinicApi } from '@/query/clinic';
import { usePatientsQuery } from '@/query/patients';
import { useUserQuery } from '@/query/user';
import type { ScheduleFormProps } from '@/components/schedule/schedule-form';
import { extractTimeFromISO } from '../@utils/schedule.utils';

export function useScheduleForm({ event, onClose, onSave, onDelete }: ScheduleFormProps) {
  const { data: user } = useUserQuery();
  const { data: clinic } = useClinicApi();
  const { data: patients } = usePatientsQuery();
  const { getRoomName: getRoomNameUtil } = useClinicStore();

  const getRoomName = useCallback((id: string | undefined) => getRoomNameUtil(clinic, id), [clinic, getRoomNameUtil]);
  const getPatientName = useCallback((id: string | undefined) => usePatientStore.getState().getName(patients, id), [patients]);

  const [startDateTime, setStartDateTime] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string | undefined>(undefined);
  const [_selectedPatient, setSelectedPatient] = useState<string>('');
  const [_selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [_selectedFinancial, setSelectedFinancial] = useState<string>('');
  const [_selectedOdontogram, setSelectedOdontogram] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [activeTab, setActiveTab] = useState('appointment');
  const [roomEvent, setRoomEvent] = useState(false);

  const isEditMode = Boolean(event?._id);

  const rooms = useMemo(() => {
    const clinicRooms = clinic?.rooms?.map((r: any) => ({ _id: r._id, name: r.name })) ?? [];
    const userRooms = (user?.rooms || []).map((r: any) => ({ _id: r._id, name: getRoomName(r._id) })).filter((r: any) => r.name && r.name.trim() !== '');
    const mergedMap = new Map<string, { _id: string; name: string }>();
    for (const r of [...clinicRooms, ...userRooms]) {
      mergedMap.set(r._id, r);
    }
    return Array.from(mergedMap.values());
  }, [clinic, user, getRoomName]);

  const form = useForm<any>({
    defaultValues: isEditMode
      ? { title: '', start: '', end: '', allDay: false }
      : {
          Patient: '',
          Professional: '',
          Financial: '',
          Odontogram: '',
          Room: '',
          title: '',
          start: '',
          end: '',
          status: 'pending',
          patient: { name: '', sex: '', phone: '' },
        },
    mode: 'onChange',
  });

  const resetForm = useCallback(() => {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    const endTime = new Date(now.getTime() + 60 * 60 * 1000);
    setStartDateTime(now.toISOString());
    setEndDateTime(endTime.toISOString());
    setSelectedPatient('');
    setSelectedProfessional('');
    setSelectedFinancial('');
    setSelectedOdontogram('');
    setAllDay(false);
    setRoomEvent(false);
    setSelectedRoom('');
    setSelectedRoomName('');

    if (isEditMode) {
      form.reset({ title: '', start: `${DefaultStartHour}:00`, end: `${DefaultEndHour}:00`, allDay: false });
    } else {
      form.reset({
        Patient: '',
        Professional: '',
        Financial: '',
        Odontogram: '',
        Room: '',
        title: '',
        start: `${DefaultStartHour}:00`,
        end: `${DefaultEndHour}:00`,
        status: 'pending',
        patient: { name: '', sex: '', phone: '' },
      });
    }
  }, [form, isEditMode]);

  useEffect(() => {
    if (event) {
      setStartDateTime(new Date(event.start).toISOString());
      setEndDateTime(event.end ? new Date(event.end).toISOString() : undefined);
      setAllDay(event.allDay || false);
      setSelectedPatient(event.Patient || '');

      form.setValue('title', event.title || '');
      form.setValue('allDay', event.allDay || false);
      form.setValue('Patient', event.Patient || '');
      form.setValue('Professional', event.Professional || '');
      form.setValue('Room', event.Room || '');
      form.setValue('status', event.status || 'pending');
      if (event.Room) {
        setSelectedRoom(event.Room);
        setSelectedRoomName(getRoomName(event.Room));
      }
    } else {
      resetForm();
    }
  }, [event, form, resetForm, getRoomName]);

  function clearFields() {
    if (!isEditMode) {
      form.setValue('Patient', '');
      form.setValue('Professional', '');
      form.setValue('Financial', '');
      form.setValue('Odontogram', '');
      form.setValue('patient.name', '');
      form.setValue('patient.sex', '');
      form.setValue('patient.phone', '');
      setSelectedPatient('');
      setSelectedProfessional('');
      setSelectedFinancial('');
      setSelectedOdontogram('');
    }
    form.setValue('title', '');
  }

  const fetchPatients = useCallback(async () => {
    const res = await request('patient', GET());
    if (!res.success) throw new Error(res.message);
    return comboboxWithImgFormat(res.data);
  }, []);

  const fetchProfessionals = useCallback(async () => {
    const res = await request('professional', GET());
    if (!res.success) throw new Error(res.message);
    return comboboxWithImgFormat(res.data);
  }, []);

  async function handleSave() {
    const values = form.getValues();
    setIsLoading(true);
    try {
      if (!values.Room && !selectedRoom) {
        toast.error(t('error.select.appointment.room'));
        return;
      }

      if (activeTab === 'newpatient') {
        if (!values.patient?.name || values.patient.name.trim().length < 5) {
          toast.error(t('error.patient.name.length'));
          return;
        }
        if (!values.patient?.sex) {
          toast.error(t('error.select.patient.sex'));
          return;
        }
        const phoneLength = values.patient?.phone?.replace(/\D/g, '').length || 0;
        if (!values.patient?.phone || phoneLength < 10 || phoneLength > 11) {
          toast.error(t('error.phone.digits'));
          return;
        }
        if (!values.Professional) {
          toast.error(t('error.select.a.professional'));
          return;
        }
      }

      if (isEditMode && event?._id) {
        const updateBody: UpdateSchedule = { allDay, start: startDateTime };
        addKey(updateBody, 'end', endDateTime);
        addKey(updateBody, 'title', values.title);

        const res = await request(`schedule/${event._id}`, PUT(updateBody));
        if (!res.success) throw new Error(res.message);
        toast.success(res.message);
        onSave({
          ...event,
          title: values.title,
          start: new Date(startDateTime),
          end: endDateTime ? new Date(endDateTime) : new Date(startDateTime),
          allDay,
        });
        return;
      }

      if (activeTab === 'newpatient') {
        const body: any = {
          patient: {
            name: values.patient?.name || '',
            sex: values.patient?.sex || '',
            phone: values.patient?.phone ? values.patient.phone.replace(/\D/g, '') : '',
          },
          Professional: values.Professional,
          Room: values.Room || selectedRoom,
          start: startDateTime,
          allDay,
        };
        addKey(body, 'end', endDateTime);
        addKey(body, 'title', values.title);

        const res = await request('schedule/scheduled-patient', POST(body));
        if (!res.success) throw new Error(res.message);
        toast.success(res.message);
        onSave({
          _id: res.data.scheduleID,
          title: t('new.patient.visit.title'),
          start: new Date(startDateTime),
          end: endDateTime ? new Date(endDateTime) : new Date(startDateTime),
          allDay,
          Room: values.Room || selectedRoom,
          Patient: res.data.patientID || '',
          Professional: values.Professional || '',
          status: 'pending',
        });
        return;
      }

      const body: NewSchedule = {
        Room: values.Room || selectedRoom,
        start: startDateTime,
        status: 'pending',
        allDay,
      } as any;

      addKey(body, 'end', endDateTime);

      if (!roomEvent) {
        addKey(body, 'Patient', values.Patient);
        addKey(body, 'Professional', values.Professional);
        addKey(body, 'Financial', values.Financial);
        addKey(body, 'Odontogram', values.Odontogram);
      }
      if (roomEvent) {
        if (!values.title || values.title.trim() === '') {
          toast.error(t('error.room.event.title'));
          return;
        }
        addKey(body, 'title', values.title);
      }

      const res = await request('schedule/create', POST(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onSave({
        _id: res.data._id,
        title: getPatientName(values.Patient),
        start: new Date(startDateTime),
        end: endDateTime ? new Date(endDateTime) : new Date(startDateTime),
        allDay,
        Room: values.Room || selectedRoom,
        Patient: (roomEvent ? '' : values.Patient) || '',
        Professional: (roomEvent ? '' : values.Professional) || '',
        status: values.status || 'pending',
      });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!event?._id) return;
    setIsLoading(true);
    try {
      const res = await request(`schedule/${event._id}`, DELETE());
      if (res.success === false) throw new Error(res.message);
      toast.success(res.message || t('appointment.deleted.success'));
      onDelete(event._id);
      setSelectedRoom('');
      setSelectedRoomName('');
      form.setValue('Room', '');
      onClose();
    } catch (e: any) {
      toast.error(e.message || t('appointment.delete.error'));
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setSelectedRoom('');
    setSelectedRoomName('');
    form.setValue('Room', '');
    onClose();
  }

  return {
    form,
    isEditMode,
    isLoading,
    rooms,
    startDateTime,
    endDateTime,
    allDay,
    activeTab,
    roomEvent,
    selectedRoom,
    selectedRoomName,
    setStartDateTime,
    setEndDateTime,
    setAllDay,
    setActiveTab,
    setRoomEvent,
    setSelectedPatient,
    setSelectedProfessional,
    setSelectedRoom,
    setSelectedRoomName,
    getRoomName,
    clearFields,
    fetchPatients,
    fetchProfessionals,
    handleSave,
    handleDelete,
    handleCancel,
    extractTimeFromISO,
  };
}
