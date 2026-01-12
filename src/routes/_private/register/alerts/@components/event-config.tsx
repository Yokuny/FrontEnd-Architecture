import { ArrowUpRight, Clock, MapPin, Monitor, WifiOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FenceSelect } from '@/components/selects/fence-select';
import { MachineSelect } from '@/components/selects/machine-select';
import { PlatformEnterpriseSelect } from '@/components/selects/platform-enterprise-select';
import { SensorByMachineSelect } from '@/components/selects/sensor-by-machine-select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { AlertFormData } from '../@interface/alert';

export function EventConfig() {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<AlertFormData>();
  const idEnterprise = watch('idEnterprise');
  const events = watch('events');

  // Helper to toggle sections
  const toggleSection = (section: Exclude<keyof NonNullable<AlertFormData['events']>, 'description'>) => {
    const current = events?.[section];
    setValue(`events.${section}` as any, (current ? null : {}) as any);
  };

  const lostConnectionMachineId = watch('events.lostConnectionSensor.idMachine');

  return (
    <div className="space-y-6">
      {/* 1. In/Out Geofence */}
      <div className={cn('rounded-lg border p-4 space-y-4 transition-colors', events?.inOutGeofence ? 'border-primary bg-primary/5' : 'bg-muted/30')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className="size-4 text-purple-500" />
            {t('in.out.geofence')}
          </div>
          <Switch checked={!!events?.inOutGeofence} onCheckedChange={() => toggleSection('inOutGeofence')} />
        </div>
        {!!events?.inOutGeofence && (
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="events.inOutGeofence.allMachines"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">{t('all.vessels')}</FormLabel>
                    </FormItem>
                  )}
                />
                {!watch('events.inOutGeofence.allMachines') && (
                  <FormField
                    control={control}
                    name="events.inOutGeofence.idMachines"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MachineSelect
                            mode="multi"
                            idEnterprise={idEnterprise}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            placeholder={t('vessels.select.placeholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-2">
                <FormField
                  control={control}
                  name="events.inOutGeofence.allGeofences"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">{t('all.geofences')}</FormLabel>
                    </FormItem>
                  )}
                />
                {!watch('events.inOutGeofence.allGeofences') && (
                  <FormField
                    control={control}
                    name="events.inOutGeofence.idGeofences"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FenceSelect mode="multi" idEnterprise={idEnterprise} value={field.value} onChange={(val) => field.onChange(val)} placeholder={t('fence.placeholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-2">
              <FormField
                control={control}
                name="events.inOutGeofence.alertEntering"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">{t('alert.event.entering.checkbox')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="events.inOutGeofence.alertLeaving"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">{t('alert.event.leaving.checkbox')}</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="events.inOutGeofence.passage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">{t('passage')}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Platform Proximity */}
      <div className={cn('rounded-lg border p-4 space-y-4 transition-colors', events?.startInsideInPlatformArea ? 'border-primary bg-primary/5' : 'bg-muted/30')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Monitor className="size-4 text-blue-500" />
            {t('platform.proximity')}
          </div>
          <Switch checked={!!events?.startInsideInPlatformArea} onCheckedChange={() => toggleSection('startInsideInPlatformArea')} />
        </div>
        {!!events?.startInsideInPlatformArea && (
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="events.startInsideInPlatformArea.allMachines"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">{t('all.vessels')}</FormLabel>
                    </FormItem>
                  )}
                />
                {!watch('events.startInsideInPlatformArea.allMachines') && (
                  <FormField
                    control={control}
                    name="events.startInsideInPlatformArea.idMachines"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MachineSelect
                            mode="multi"
                            idEnterprise={idEnterprise}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            placeholder={t('vessels.select.placeholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-2">
                <FormField
                  control={control}
                  name="events.startInsideInPlatformArea.allPlatforms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">{t('all.platforms')}</FormLabel>
                    </FormItem>
                  )}
                />
                {!watch('events.startInsideInPlatformArea.allPlatforms') && (
                  <FormField
                    control={control}
                    name="events.startInsideInPlatformArea.idPlatforms"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PlatformEnterpriseSelect
                            mode="multi"
                            idEnterprise={idEnterprise}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            placeholder={t('platforms.select.placeholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Lost Connection */}
      <div className={cn('rounded-lg border p-4 space-y-4 transition-colors', events?.lostConnectionSensor ? 'border-primary bg-primary/5' : 'bg-muted/30')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <WifiOff className="size-4 text-red-500" />
            {t('lostconnection')}
          </div>
          <Switch checked={!!events?.lostConnectionSensor} onCheckedChange={() => toggleSection('lostConnectionSensor')} />
        </div>
        {!!events?.lostConnectionSensor && (
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="events.lostConnectionSensor.idMachine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('machine')}</FormLabel>
                    <FormControl>
                      <MachineSelect mode="single" idEnterprise={idEnterprise} value={field.value || undefined} onChange={field.onChange} placeholder={t('machine')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="events.lostConnectionSensor.idSensors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sensors')}</FormLabel>
                    <FormControl>
                      <SensorByMachineSelect multi idMachine={lostConnectionMachineId || ''} values={field.value || []} onChangeMulti={field.onChange} placeholder={t('sensors')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="events.lostConnectionSensor.timeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('time.min.lost.connection')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" className="pl-9" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder={t('time.min')} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Status Distance Port */}
      <div className={cn('rounded-lg border p-4 space-y-4 transition-colors', events?.statusDistancePort ? 'border-primary bg-primary/5' : 'bg-muted/30')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <ArrowUpRight className="size-4 text-orange-500" />
            {t('status.distance.port')}
          </div>
          <Switch checked={!!events?.statusDistancePort} onCheckedChange={() => toggleSection('statusDistancePort')} />
        </div>
        {!!events?.statusDistancePort && (
          <div className="grid gap-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 lg:col-span-3">
                <FormField
                  control={control}
                  name="events.statusDistancePort.allMachines"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">{t('all.vessels')}</FormLabel>
                    </FormItem>
                  )}
                />
                {!watch('events.statusDistancePort.allMachines') && (
                  <FormField
                    control={control}
                    name="events.statusDistancePort.idMachines"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MachineSelect mode="multi" idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} placeholder={t('vessels.select.placeholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={control}
                name="events.statusDistancePort.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dp">DP</SelectItem>
                        <SelectItem value="standby">{t('stand.by')}</SelectItem>
                        <SelectItem value="standbyready">{t('stand.by.ready')}</SelectItem>
                        <SelectItem value="underway">{t('in.travel')}</SelectItem>
                        <SelectItem value="fasttransit">{t('fast.transit')}</SelectItem>
                        <SelectItem value="slow">{t('slow')}</SelectItem>
                        <SelectItem value="at_anchor">{t('at.anchor')}</SelectItem>
                        <SelectItem value="port">{t('moored')}</SelectItem>
                        <SelectItem value="dock">{t('dock')}</SelectItem>
                        <SelectItem value="other">{t('other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="events.statusDistancePort.distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('distance.more.than')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} placeholder={t('distance')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <FormField
          control={control}
          name="events.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')} *</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('message.description.placeholder')} maxLength={150} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
