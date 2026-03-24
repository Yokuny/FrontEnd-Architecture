import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DateTimePicker from '@/components/data-inputs/date-time-picker';
import FinancialCombobox from '@/components/data-inputs/financial-combobox';
import OdontogramCombobox from '@/components/data-inputs/odontogram-combobox';
import ProcedureComponent from '@/components/data-inputs/procedure-component';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Edit from '@/components/icons/Edit.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useClinicStore } from '@/hooks/clinic';
import { GET, POST, request } from '@/lib/api/client';
import { comboboxWithImgFormat, currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { addKey } from '@/lib/helpers/validade.helper';
import { useClinicApi } from '@/query/clinic';
import { usePatientQuery } from '@/query/patient';
import { useUserQuery } from '@/query/user';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/schedule-add/')({
  component: ScheduleAddPage,
  staticData: {
    title: 'Novo Agendamento',
    description: 'Agende uma nova consulta para o paciente.',
  },
  validateSearch: searchSchema,
});

function ScheduleAddPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);
  const { data: user } = useUserQuery();
  const { data: clinic } = useClinicApi();
  const { getRoomName: getRoomNameUtil } = useClinicStore();

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
      Patient: id || '',
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
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  }, []);

  const fetchFinancials = useCallback(async (patientId: string) => {
    const res = await request(`financial/patient/${patientId}`, GET());
    if (!res.success) return [];
    return (res.data || []).map((f: any) => ({ value: f._id, label: `${f._id?.slice(-6)} - R$ ${f.price}` }));
  }, []);

  const fetchOdontograms = useCallback(async (patientId: string) => {
    const res = await request(`odontogram/patient/${patientId}`, GET());
    if (!res.success) return [];
    return (res.data || []).map((o: any) => ({ value: o._id, label: `${o._id?.slice(-6)} - ${o.finished ? 'Finalizado' : 'Em andamento'}` }));
  }, []);

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'schedule' } });

  const handleSubmit = async () => {
    if (!id) return;
    const values = form.getValues();

    if (!values.Room && !selectedRoom) {
      toast.error('Selecione a sala do atendimento');
      return;
    }

    const body: any = {
      Patient: id,
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
      goBack();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar agendamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    {
      title: 'Informações do Agendamento',
      description: 'Profissional, financeiro e odontograma',
      fields: [
        <div key="info" className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="Professional"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Profissional</FormLabel>
                <FormControl>
                  <ProfessionalCombobox
                    controller={{
                      ...field,
                      onChange: (value: string) => {
                        field.onChange(value);
                        setSelectedProfessional(value);
                        if (value) {
                          form.setValue('Financial', '');
                          form.setValue('Odontogram', '');
                          setSelectedFinancial('');
                          setSelectedOdontogram('');
                        }
                      },
                    }}
                    fetchProfessionals={fetchProfessionals}
                    disabled={selectedFinancial !== '' || selectedOdontogram !== ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Financial"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Financeiro / Orçamento</FormLabel>
                <FormControl>
                  <FinancialCombobox
                    controller={{
                      ...field,
                      onChange: (value: string) => {
                        field.onChange(value);
                        setSelectedFinancial(value);
                        if (value) {
                          form.setValue('Professional', '');
                          form.setValue('Odontogram', '');
                          setSelectedProfessional('');
                          setSelectedOdontogram('');
                        }
                      },
                    }}
                    patient={String(id)}
                    fetchFinancials={fetchFinancials}
                    disabled={selectedProfessional !== '' || selectedOdontogram !== ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Odontogram"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Odontograma</FormLabel>
                <FormControl>
                  <OdontogramCombobox
                    controller={{
                      ...field,
                      onChange: (value: string) => {
                        field.onChange(value);
                        setSelectedOdontogram(value);
                        if (value) {
                          form.setValue('Professional', '');
                          form.setValue('Financial', '');
                          setSelectedProfessional('');
                          setSelectedFinancial('');
                        }
                      },
                    }}
                    patient={String(id)}
                    fetchOdontograms={fetchOdontograms}
                    disabled={selectedProfessional !== '' || selectedFinancial !== ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: 'Procedimentos',
      description: 'Procedimentos a serem realizados',
      fields: [
        <div key="procedures" className="rounded-lg md:border md:p-6">
          <ProcedureComponent
            form={form}
            disabled={isSubmitting || selectedOdontogram !== '' || selectedFinancial !== ''}
            currencyFormat={(v) => String(currencyFormat(v) ?? '')}
            statusDictionary={statusDictionary}
          />
        </div>,
      ],
    },
    {
      title: selectedRoomName ? `${selectedRoomName} | Data, Horário` : 'Local, Data e Horário',
      description: selectedRoomName ? `Agendamento na sala ${selectedRoomName}. Selecione a data e o horário.` : 'Selecione a sala, data e o horário da consulta',
      fields: [
        <div key="datetime-room" className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <FormLabel>Sala do Atendimento</FormLabel>
            <div className="flex w-full gap-2">
              {!(form.getValues('Room') || selectedRoom) ? (
                <Select
                  value={form.getValues('Room')}
                  onValueChange={(value) => {
                    form.setValue('Room', value);
                    setSelectedRoom(value);
                    setSelectedRoomName(getRoomName(value) || '');
                  }}
                >
                  <SelectTrigger className="w-full">
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
                <div className="flex w-full items-center gap-2 rounded-md border p-2">
                  <span className="flex-1 font-medium text-sm">{selectedRoomName}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue('Room', '');
                      setSelectedRoom('');
                      setSelectedRoomName('');
                    }}
                    aria-label="Alterar sala"
                  >
                    <Edit className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DateTimePicker
            startDate={startDateTime ? new Date(startDateTime) : undefined}
            endDate={endDateTime ? new Date(endDateTime) : undefined}
            allDay={allDay}
            onChange={(data) => {
              setStartDateTime(data.startISO);
              setEndDateTime(data.endISO);
              setAllDay(data.allDay);
              form.setValue('allDay', data.allDay);
            }}
            disabled={isSubmitting}
          />
        </div>,
      ],
    },
  ];

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button form="schedule-add-form" type="submit" disabled={isSubmitting || isLoadingPatient || !patient || !selectedRoom}>
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            {selectedRoomName ? `Agendar em ${selectedRoomName}` : 'Agendar'}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoadingPatient ? (
          <DefaultLoading />
        ) : !patient ? (
          <DefaultEmptyData />
        ) : (
          <Form {...(form as any)}>
            <form
              id="schedule-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <DefaultFormLayout sections={sections} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
