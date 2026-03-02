import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DateTimePicker from '@/components/date-time-picker';
import Back from '@/components/icons/Back.Icon';
import Delete from '@/components/icons/Delete.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Loader from '@/components/icons/Loader.Icon';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClinicStore } from '@/hooks/clinic';
import { usePatientStore } from '@/hooks/patients';
import { DELETE, GET, POST, PUT, request } from '@/lib/api/client';
import { DefaultEndHour, DefaultStartHour } from '@/lib/consts/calendar.constants';
import { comboboxWithImgFormat, formatPhone } from '@/lib/helpers/formatter.helper';
import { addKey } from '@/lib/helpers/validade.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule';
import type { NewSchedule, UpdateSchedule } from '@/lib/interfaces/schemas/schedule.schema';
import { cn } from '@/lib/utils';
import { useClinicApi } from '@/query/clinic';
import { usePatientsQuery } from '@/query/patients';
import { useUserQuery } from '@/query/user';

export function ScheduleForm({ event, onClose, onSave, onDelete }: ScheduleFormProps) {
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
    [...clinicRooms, ...userRooms].forEach((r) => mergedMap.set(r._id, r));
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

  const clearFields = () => {
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
  };

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

  const handleSave = async () => {
    const values = form.getValues();
    setIsLoading(true);
    try {
      if (!values.Room && !selectedRoom) {
        toast.error('Selecione a sala do atendimento');
        return;
      }

      if (activeTab === 'newpatient') {
        if (!values.patient?.name || values.patient.name.trim().length < 5) {
          toast.error('Nome do paciente deve ter pelo menos 5 caracteres');
          return;
        }
        if (!values.patient?.sex) {
          toast.error('Selecione o sexo do paciente');
          return;
        }
        const phoneLength = values.patient?.phone?.replace(/\D/g, '').length || 0;
        if (!values.patient?.phone || phoneLength < 10 || phoneLength > 11) {
          toast.error('Telefone deve ter 10 ou 11 dígitos');
          return;
        }
        if (!values.Professional) {
          toast.error('Selecione um profissional');
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
          title: 'Atendimento de novo paciente',
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
          toast.error('Título é obrigatório para eventos de sala');
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
  };

  const handleDelete = async () => {
    if (!event?._id) return;
    setIsLoading(true);
    try {
      const res = await request(`schedule/${event._id}`, DELETE());
      if (res.success === false) throw new Error(res.message);
      toast.success(res.message || 'Agendamento excluído com sucesso');
      onDelete(event._id);
      setSelectedRoom('');
      setSelectedRoomName('');
      form.setValue('Room', '');
      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedRoom('');
    setSelectedRoomName('');
    form.setValue('Room', '');
    onClose();
  };

  const extractTimeFromISO = (iso?: string): string | undefined => {
    if (!iso) return undefined;
    const date = new Date(iso);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Agendamento</DialogTitle>
        <DialogDescription>{event?._id ? 'Editar detalhes do agendamento' : 'Adicionar um novo agendamento'}</DialogDescription>
      </DialogHeader>

      <Form {...(form as any)}>
        <form className="!p-0">
          {!isEditMode && (
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setRoomEvent(value === 'roomevent');
                clearFields();
                if (value === 'roomevent') {
                  form.setValue('Patient', '');
                  form.setValue('Professional', '');
                  setSelectedPatient('');
                  setSelectedProfessional('');
                }
              }}
              className="w-full"
            >
              <ScrollArea className="w-full max-w-xs md:max-w-none">
                <TabsList className="gap-1">
                  <TabsTrigger value="appointment" className="rounded-md data-[state=active]:shadow-none">
                    Atendimento
                  </TabsTrigger>
                  <TabsTrigger value="newpatient" className="rounded-md data-[state=active]:shadow-none">
                    Novo Paciente
                  </TabsTrigger>
                  <TabsTrigger value="roomevent" className="rounded-md data-[state=active]:shadow-none">
                    Evento na sala
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className={cn('w-full rounded-lg bg-muted p-2 pb-0 md:p-4 md:pb-0', !isEditMode && 'rounded-b-none')}>
                <TabsContent value="appointment">
                  <div className="flex w-full flex-wrap gap-1 rounded-lg border border-accent bg-background p-6 pt-0 md:gap-4">
                    <FormField
                      control={form.control as any}
                      name="Patient"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-52">
                          <FormLabel className="flex h-8 items-end">Paciente</FormLabel>
                          <FormControl>
                            <PatientCombobox
                              controller={{
                                ...field,
                                onChange: (value: string) => {
                                  field.onChange(value);
                                  setSelectedPatient(value);
                                },
                              }}
                              fetchPatients={fetchPatients}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="Professional"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-52">
                          <FormLabel className="flex h-8 items-end">Profissional</FormLabel>
                          <FormControl>
                            <ProfessionalCombobox
                              controller={{
                                ...field,
                                onChange: (value: string) => {
                                  field.onChange(value);
                                  setSelectedProfessional(value);
                                },
                              }}
                              fetchProfessionals={fetchProfessionals}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="roomevent">
                  <div className="flex w-full flex-wrap gap-1 rounded-lg border border-accent bg-background p-6 pt-0 md:gap-4">
                    <FormField
                      control={form.control as any}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="flex h-8 items-end">Título do Evento</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descreva o evento da sala" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="newpatient">
                  <div className="flex w-full flex-wrap gap-1 rounded-lg border border-accent bg-background p-6 pt-0 md:gap-4">
                    <FormField
                      control={form.control as any}
                      name="patient.name"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-52">
                          <FormLabel className="flex h-8 items-end">Nome do paciente</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome completo" className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="patient.sex"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-32">
                          <FormLabel className="flex h-8 items-end">Sexo</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="M">Masculino</SelectItem>
                                <SelectItem value="F">Feminino</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="patient.phone"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-52">
                          <FormLabel className="flex h-8 items-end">Telefone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(00) 0000-0000"
                              className="w-full"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(formatPhone(e.target.value))}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="Professional"
                      render={({ field }) => (
                        <FormItem className="w-full max-w-52">
                          <FormLabel className="flex h-8 items-end">Profissional</FormLabel>
                          <FormControl>
                            <ProfessionalCombobox
                              controller={{
                                ...field,
                                onChange: (value: string) => {
                                  field.onChange(value);
                                  setSelectedProfessional(value);
                                },
                              }}
                              fetchProfessionals={fetchProfessionals}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}

          <div className={cn('w-full rounded-lg bg-muted p-2 md:p-4', !isEditMode && 'rounded-t-none')}>
            <div className="space-y-6 rounded-lg border border-accent bg-background p-6 px-4 md:p-6">
              <DateTimePicker
                startDate={startDateTime ? new Date(startDateTime) : undefined}
                endDate={endDateTime ? new Date(endDateTime) : undefined}
                startTime={!allDay ? extractTimeFromISO(startDateTime) : undefined}
                endTime={!allDay ? extractTimeFromISO(endDateTime) : undefined}
                allDay={allDay}
                onChange={(data) => {
                  setStartDateTime(data.startISO);
                  setEndDateTime(data.endISO);
                  setAllDay(data.allDay);
                }}
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
      </Form>

      <DialogFooter className="flex-row items-center justify-between space-x-2 md:justify-between">
        {event?._id && (
          <Button variant="outline" onClick={handleDelete} disabled={isLoading} aria-label="Apagar agendamento">
            <Delete className="size-4 text-destructive" aria-hidden="true" />
          </Button>
        )}
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          <Back className="size-4 md:hidden" />
          <span className="hidden md:block">Cancelar</span>
        </Button>
        {!(form.getValues('Room') || selectedRoom) ? (
          <Select
            value={form.getValues('Room')}
            onValueChange={(value) => {
              form.setValue('Room', value);
              setSelectedRoom(value);
              setSelectedRoomName(getRoomName(value));
            }}
          >
            <SelectTrigger className="w-full overflow-x-hidden">
              <SelectValue placeholder={rooms.length ? 'Selecione a sala' : 'Sem salas disponíveis'} />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room._id} value={room._id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setValue('Room', '');
                setSelectedRoom('');
                setSelectedRoomName('');
              }}
              aria-label="Alterar sala"
            >
              <Edit className="size-4" />
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="w-full">
              {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
              {isEditMode ? 'Salvar' : `Agendar em ${selectedRoomName || ''}`}
            </Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

type ScheduleFormProps = {
  event: PartialSchedule | null;
  onClose: () => void;
  onSave: (event: PartialSchedule) => void;
  onDelete: (eventId: string) => void;
};
