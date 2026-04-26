import { useEffect } from 'react';
import DateTimePicker from '@/components/data-inputs/date-time-picker';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import Back from '@/components/icons/Back.Icon';
import Delete from '@/components/icons/Delete.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Loader from '@/components/icons/Loader.Icon';
import Save from '@/components/icons/Save.Icon';
import type { ScheduleFormProps } from '@/components/schedule/schedule-form';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import { useScheduleForm } from '@/routes/_private/schedule/@hooks/use-schedule-form';

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
                    {t('appointment')}
                  </TabsTrigger>
                  <TabsTrigger value="newpatient" className="rounded-md data-[state=active]:shadow-none">
                    {t('new.patient.tab')}
                  </TabsTrigger>
                  <TabsTrigger value="roomevent" className="rounded-md data-[state=active]:shadow-none">
                    {t('room.event')}
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <TabsContent value="appointment">
                <DefaultFormLayout
                  className={layoutClassName}
                  sections={[
                    {
                      title: t('section.patient.professional'),
                      description: t('section.patient.professional.description'),
                      fields: [
                        <div key="patient-professional" className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control as any}
                            name="Patient"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{t('patient')}</FormLabel>
                                <FormControl>
                                  <PatientCombobox
                                    value={field.value}
                                    onChange={(value: string) => {
                                      field.onChange(value);
                                      setSelectedPatient(value);
                                    }}
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
                                <FormLabel>{t('professional.label')}</FormLabel>
                                <FormControl>
                                  <ProfessionalCombobox
                                    value={field.value}
                                    onChange={(value: string) => {
                                      field.onChange(value);
                                      setSelectedProfessional(value);
                                    }}
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
                      title: t('room.event'),
                      description: t('room.event.description'),
                      fields: [
                        <FormField
                          key="title"
                          control={form.control as any}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('event.title')}</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={t('room.event.placeholder')} />
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
                      title: t('new.patient.section'),
                      description: t('new.patient.section.description'),
                      fields: [
                        <div key="new-patient-fields" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control as any}
                            name="patient.name"
                            render={({ field }) => (
                              <FormItem className="flex flex-col sm:col-span-2">
                                <FormLabel>{t('patient.name')}</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder={t('full.name')} />
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
                                <FormLabel>{t('sex')}</FormLabel>
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder={t('select.generic')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="M">{t('sex.male')}</SelectItem>
                                      <SelectItem value="F">{t('sex.female')}</SelectItem>
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
                                <FormLabel>{t('phone')}</FormLabel>
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
                                <FormLabel>{t('professional.label')}</FormLabel>
                                <FormControl>
                                  <ProfessionalCombobox
                                    value={field.value}
                                    onChange={(value: string) => {
                                      field.onChange(value);
                                      setSelectedProfessional(value);
                                    }}
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
                title: t('section.datetime'),
                description: t('section.datetime.description'),
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
        <CardFooter className="mt-4 flex-row flex-nowrap items-center justify-between gap-2 border-t px-0 pt-4">
          {event?._id && (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} aria-label={t('delete.appointment')}>
              <Delete className="size-4 text-destructive" aria-hidden="true" />
            </Button>
          )}
          <Button variant="primary" onClick={handleCancel} disabled={isLoading}>
            <Back className="size-4 md:hidden" />
            <span className="hidden md:block">{t('cancel')}</span>
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
              <SelectTrigger variant="default" className="min-w-0 flex-1 overflow-x-hidden">
                <SelectValue placeholder={rooms.length ? t('select.room.field') : t('no.rooms.available')} />
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
                variant="info"
                onClick={() => {
                  form.setValue('Room', '');
                  setSelectedRoom('');
                  setSelectedRoomName('');
                }}
                aria-label={t('change.room')}
              >
                <Edit className="size-4" />
              </Button>
              {!(hideFooter && formId) && (
                <Button type={formId ? 'submit' : 'button'} form={formId} onClick={formId ? undefined : () => void handleSave()} disabled={isLoading} className="shrink-0">
                  {isLoading ? <Loader className="size-4 animate-spin" /> : isEditMode && <Save className="size-4" />}
                  <span className={isEditMode ? 'sr-only md:not-sr-only' : undefined}>{isEditMode ? t('save') : `${t('book.in')} ${selectedRoomName || ''}`}</span>
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </>
  );
}
