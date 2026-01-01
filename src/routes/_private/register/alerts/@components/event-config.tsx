import { ArrowUpRight, Clock, MapPin, Monitor, WifiOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FenceSelect } from '@/components/selects/fence-select';
import { MachineSelect } from '@/components/selects/machine-select';
import { PlatformEnterpriseSelect } from '@/components/selects/platform-enterprise-select';
import { SensorByMachineSelect } from '@/components/selects/sensor-by-machine-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const toggleSection = (section: keyof NonNullable<AlertFormData['events']>) => {
    const current = events?.[section];
    setValue(`events.${section}`, current ? null : {});
  };

  const lostConnectionMachineId = watch('events.lostConnectionSensor.machine');

  return (
    <div className="space-y-4">
      {/* 1. In/Out Geofence */}
      <Card className={cn(events?.inOutGeofence ? 'border-primary' : '')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <MapPin className="size-4 text-purple-500" />
            {t('in.out.geofence')}
          </CardTitle>
          <Switch checked={!!events?.inOutGeofence} onCheckedChange={() => toggleSection('inOutGeofence')} />
        </CardHeader>
        {!!events?.inOutGeofence && (
          <CardContent className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vessels */}
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
                    name="events.inOutGeofence.machines"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MachineSelect
                            mode="multi"
                            idEnterprise={idEnterprise}
                            value={field.value}
                            onChange={(val) => field.onChange(val)} // Ensure array
                            placeholder={t('vessels.select.placeholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Geofences */}
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
                    name="events.inOutGeofence.geofences"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </CardContent>
        )}
      </Card>

      {/* 2. Platform Proximity */}
      <Card className={cn(events?.startInsideInPlatformArea ? 'border-primary' : '')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Monitor className="size-4 text-blue-500" />
            {t('platform.proximity')}
          </CardTitle>
          <Switch checked={!!events?.startInsideInPlatformArea} onCheckedChange={() => toggleSection('startInsideInPlatformArea')} />
        </CardHeader>
        {!!events?.startInsideInPlatformArea && (
          <CardContent className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vessels */}
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
                    name="events.startInsideInPlatformArea.machines"
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

              {/* Platforms */}
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
                    name="events.startInsideInPlatformArea.platforms"
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
          </CardContent>
        )}
      </Card>

      {/* 3. Lost Connection */}
      <Card className={cn(events?.lostConnectionSensor ? 'border-primary' : '')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <WifiOff className="size-4 text-red-500" />
            {t('lostconnection')}
          </CardTitle>
          <Switch checked={!!events?.lostConnectionSensor} onCheckedChange={() => toggleSection('lostConnectionSensor')} />
        </CardHeader>
        {!!events?.lostConnectionSensor && (
          <CardContent className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Machine (Single) */}
              <FormField
                control={control}
                name="events.lostConnectionSensor.machine"
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

              {/* Sensors (Multi) */}
              <FormField
                control={control}
                name="events.lostConnectionSensor.sensors"
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

              {/* Time */}
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
          </CardContent>
        )}
      </Card>

      {/* 4. Status Distance Port */}
      <Card className={cn(events?.statusDistancePort ? 'border-primary' : '')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <ArrowUpRight className="size-4 text-orange-500" />
            {t('status.distance.port')}
          </CardTitle>
          <Switch checked={!!events?.statusDistancePort} onCheckedChange={() => toggleSection('statusDistancePort')} />
        </CardHeader>
        {!!events?.statusDistancePort && (
          <CardContent className="grid gap-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Vessels */}
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
                    name="events.statusDistancePort.machines"
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

              {/* Status */}
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
                        {/* Legacy ListType mapping */}
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

              {/* Distance */}
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
          </CardContent>
        )}
      </Card>

      {/* Common Description */}
      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
