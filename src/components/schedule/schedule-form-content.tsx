import { type ReactNode, useEffect } from 'react';
import DateTimePicker from '@/components/data-inputs/date-time-picker';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import Back from '@/components/icons/Back.Icon';
import Delete from '@/components/icons/Delete.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Loader from '@/components/icons/Loader.Icon';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import { cn } from '@/lib/utils/cn.util';
import { useScheduleForm } from '@/routes/_private/schedule/@hooks/use-schedule-form';
import type { ScheduleFormProps } from '@/routes/_private/schedule/@interface/schedule.interface';

export type ScheduleFormContentProps = ScheduleFormProps & {
  /** Quando true, não renderiza o rodapé (ex.: página com botão Salvar no header). */
  hideFooter?: boolean;
  /** `id` do `<form>` para submit externo via `form="..."`. */
  formId?: string;
  /** Notifica estado de envio (para botão Salvar em página com `hideFooter`). */
  onBusyChange?: (busy: boolean) => void;
};

export function ScheduleFormContent({ event, onClose, onSave, onDelete, hideFooter = false, formId, onBusyChange }: ScheduleFormContentProps) {
  const {
    form,
    isEditMode,
    isLoading,
    rooms,
    startDateTime,
    endDateTime,
    allDay,
    activeTab,
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
  } = useScheduleForm({ event, onClose, onSave, onDelete });

  useEffect(() => {
    onBusyChange?.(isLoading);
  }, [isLoading, onBusyChange]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSave();
  };

  const layoutClassName = 'p-0';

  return (
    <>
      <Form {...(form as any)}>
        <form id={formId} className="!p-0" onSubmit={formId ? handleFormSubmit : undefined}>
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
                 <TabsContent value="appointment">
                  <DefaultFormLayout
                    className={layoutClassName}
                    sections={[
                      {
                        title: 'Paciente e profissional',
                        description: 'Selecione quem será atendido e o profissional responsável.',
                        fields: [
                          <div key="patient-professional" className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control as any}
                              name="Patient"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Paciente</FormLabel>
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
                                <FormItem className="flex flex-col">
                                  <FormLabel>Profissional</FormLabel>
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
                          </div>,
                        ],
                      },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="roomevent">
                  <DefaultFormLayout
                    className={layoutClassName}
                    sections={[
                      {
                        title: 'Evento na sala',
                        description: 'Defina um título para o bloqueio ou uso da sala.',
                        fields: [
                          <FormField
                            key="title"
                            control={form.control as any}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Título do evento</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Descreva o evento da sala" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />,
                        ],
                      },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="newpatient">
                  <DefaultFormLayout
                    className={layoutClassName}
                    sections={[
                      {
                        title: 'Novo paciente',
                        description: 'Cadastre os dados básicos e o profissional do atendimento.',
                        fields: [
                          <div key="new-patient-fields" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control as any}
                              name="patient.name"
                              render={({ field }) => (
                                <FormItem className="flex flex-col sm:col-span-2">
                                  <FormLabel>Nome do paciente</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Nome completo" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control as any}
                              name="patient.sex"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Sexo</FormLabel>
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
                                <FormItem className="flex flex-col">
                                  <FormLabel>Telefone</FormLabel>
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
                                <FormItem className="flex flex-col sm:col-span-2">
                                  <FormLabel>Profissional</FormLabel>
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
                          </div>,
                        ],
                      },
                    ]}
                  />
                </TabsContent>
             </Tabs>
          )}

             <DefaultFormLayout
              className={layoutClassName}
              sections={[
                {
                  title: 'Data e horário',
                  description: 'Defina início, fim e se o evento é o dia inteiro.',
                  fields: [
                    <DateTimePicker
                      key="schedule-datetime"
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
                    />,
                  ],
                },
              ]}
            />
         </form>
      </Form>

      {(!hideFooter || (hideFooter && formId)) && (
        <FooterShell hideFooter={hideFooter} formId={formId}>
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
              {!(hideFooter && formId) && (
                <Button type={formId ? 'submit' : 'button'} form={formId} onClick={formId ? undefined : () => void handleSave()} disabled={isLoading} className="w-full">
                  {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
                  {isEditMode ? 'Salvar' : `Agendar em ${selectedRoomName || ''}`}
                </Button>
              )}
            </>
          )}
        </FooterShell>
      )}
    </>
  );
}

function FooterShell({ hideFooter, formId, children }: { hideFooter: boolean; formId?: string; children: ReactNode }) {
  if (hideFooter && formId) {
    return <div className="mt-4 flex flex-row flex-wrap items-center justify-between gap-2 border-t pt-4 md:justify-between">{children}</div>;
  }
  return <DialogFooter className="flex-row items-center justify-between space-x-2 md:justify-between">{children}</DialogFooter>;
}
