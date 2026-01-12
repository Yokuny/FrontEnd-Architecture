import { Settings, Shield, Users, Zap } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DefaultFormLayout from '@/components/default-form-layout';
import { EditPermissionSelect } from '@/components/selects/edit-permission-select';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { MachineSelect } from '@/components/selects/machine-select';
import { ScaleSelect } from '@/components/selects/scale-select';
import { UserSelect } from '@/components/selects/user-select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { AlertFormData } from '../@interface/alert';
import { EventConfig } from './event-config';
import { MinMaxConfig } from './min-max-config';
import { RuleConfig } from './rule-config';

export function AlertForm() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<AlertFormData>();
  const type = watch('type');
  const idEnterprise = watch('idEnterprise');
  const visibility = watch('visibility');

  const identificationSections = [
    {
      title: t('identification'),
      description: t('basic.info'),
      fields: [
        <FormField
          key="idEnterprise"
          control={control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="type"
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('type')} *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!!watch('id')}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('select.type')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="conditional">{t('conditional')}</SelectItem>
                  <SelectItem value="event">{t('event')}</SelectItem>
                  <SelectItem value="min-max">{t('min.max')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  if (!idEnterprise) {
    return <DefaultFormLayout sections={identificationSections} layout="vertical" />;
  }

  return (
    <>
      <DefaultFormLayout sections={identificationSections} layout="vertical" />

      <div className="px-6 pb-6 md:px-10 md:pb-10">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="size-4" />
              {t('configuration')}
            </TabsTrigger>
            {type !== 'event' && (
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <Zap className="size-4" />
                {t('assets')}
              </TabsTrigger>
            )}
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Users className="size-4" />
              {t('notifications')}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="size-4" />
              {t('permissions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-6">
            <DefaultFormLayout
              sections={[
                {
                  title: t('alert.rules.config'),
                  description: t('alert.rules.config.description'),
                  fields: [
                    <React.Fragment key="type-config">
                      {type === 'min-max' && <MinMaxConfig />}
                      {type === 'event' && <EventConfig />}
                      {type === 'conditional' && <RuleConfig />}
                    </React.Fragment>,
                  ],
                },
              ]}
            />
          </TabsContent>

          {type !== 'event' && (
            <TabsContent value="assets" className="mt-6">
              <DefaultFormLayout
                sections={[
                  {
                    title: t('assets'),
                    description: t('assets.description'),
                    fields: [
                      <div key="assets-container" className="space-y-4">
                        <FormField
                          control={control}
                          name="allMachines"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="font-normal">{t('all.machines')}</FormLabel>
                            </FormItem>
                          )}
                        />
                        {!watch('allMachines') && (
                          <FormField
                            control={control}
                            name="idMachines"
                            render={({ field }) => (
                              <FormItem>
                                <MachineSelect label={t('machines')} mode="multi" idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>,
                    ],
                  },
                ]}
              />
            </TabsContent>
          )}

          <TabsContent value="notifications" className="mt-6">
            <DefaultFormLayout
              sections={[
                {
                  title: t('notifications'),
                  description: t('who.receives'),
                  fields: [
                    <div key="notif-container" className="space-y-6">
                      <FormField
                        control={control}
                        name="sendBy"
                        render={() => (
                          <FormItem>
                            <FormLabel>{t('send.by')}</FormLabel>
                            <div className="flex flex-wrap gap-4 pt-2">
                              {['push', 'email', 'sms'].map((method) => (
                                <FormField
                                  key={method}
                                  control={control}
                                  name="sendBy"
                                  render={({ field }) => {
                                    return (
                                      <FormItem key={method} className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(method)}
                                            onCheckedChange={(checked) => {
                                              return checked ? field.onChange([...field.value, method]) : field.onChange(field.value?.filter((value: string) => value !== method));
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">{t(method)}</FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="users"
                        render={({ field }) => (
                          <FormItem>
                            <UserSelect
                              multi
                              label={t('users')}
                              idEnterprise={idEnterprise}
                              values={field.value as any}
                              onChangeMulti={field.onChange}
                              placeholder={t('users.placeholder')}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="scales"
                        render={({ field }) => (
                          <FormItem>
                            <ScaleSelect label={t('scales')} mode="multi" value={field.value} onChange={field.onChange} />
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

          <TabsContent value="permissions" className="mt-6">
            <DefaultFormLayout
              sections={[
                {
                  title: t('permissions'),
                  description: t('visibility.settings'),
                  fields: [
                    <div key="perm-container" className="space-y-6">
                      <FormField
                        control={control}
                        name="visibility"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('visibility')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">{t('public')}</SelectItem>
                                <SelectItem value="private">{t('private')}</SelectItem>
                                <SelectItem value="limited">{t('limited')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="edit"
                        render={({ field }) => (
                          <FormItem>
                            <EditPermissionSelect label={t('who.edit')} mode="single" value={field.value} onChange={field.onChange} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {visibility === 'limited' && (
                        <FormField
                          control={control}
                          name="usersPermissionView"
                          render={({ field }) => (
                            <FormItem>
                              <UserSelect multi label={t('users.permission.view')} idEnterprise={idEnterprise} values={field.value as any} onChangeMulti={field.onChange} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>,
                  ],
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
