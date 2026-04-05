import DateTimePicker from '@/components/data-inputs/date-time-picker';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
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
import { formatPhone } from '@/lib/helpers/formatter.helper';
import { cn } from '@/lib/utils/cn.util';
import { useScheduleForm } from '../@hooks/use-schedule-form';
import type { ScheduleFormProps } from '../@interface/schedule.interface';

export function ScheduleForm({ event, onClose, onSave, onDelete }: ScheduleFormProps) {
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
