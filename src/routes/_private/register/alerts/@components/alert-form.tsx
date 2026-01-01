import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DefaultFormLayout from '@/components/default-form-layout';
import { EditPermissionSelect } from '@/components/selects/edit-permission-select';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';

import { ScaleSelect } from '@/components/selects/scale-select';
import { UserSelect } from '@/components/selects/user-select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Fields based on Type
  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'min-max':
        return <MinMaxConfig />;
      case 'event':
        return <EventConfig />;
      case 'conditional':
        return <RuleConfig />;
      default:
        return null;
    }
  };

  const sections = [
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
              <FormLabel>{t('enterprise')} *</FormLabel>
              <FormControl>
                <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
              </FormControl>
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
    {
      title: t('configuration'),
      description: t('alert.rules.config'),
      fields: [
        <div key="type-config" className="w-full">
          {renderTypeSpecificFields()}
        </div>,
      ],
    },
    {
      title: t('notifications'),
      description: t('who.receives'),
      fields: [
        <FormField
          key="sendBy"
          control={control}
          name="sendBy"
          render={() => (
            <FormItem>
              <FormLabel>{t('send.by')}</FormLabel>
              <div className="flex flex-wrap gap-4">
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
                                return checked ? field.onChange([...field.value, method]) : field.onChange(field.value?.filter((value) => value !== method));
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
        />,
        <FormField
          key="users"
          control={control}
          name="users"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users')}</FormLabel>
              <FormControl>
                <UserSelect multi idEnterprise={idEnterprise} values={field.value as any} onChangeMulti={field.onChange} placeholder={t('users.placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="scales"
          control={control}
          name="scales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('scales')}</FormLabel>
              <FormControl>
                <ScaleSelect mode="multi" value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('permissions'),
      description: t('visibility.settings'),
      fields: [
        <FormField
          key="visibility"
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
        />,
        <FormField
          key="edit"
          control={control}
          name="edit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('who.edit')}</FormLabel>
              <EditPermissionSelect mode="single" value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />,
        // Users Permission View (Only if visibility is limited)
        visibility === 'limited' ? (
          <FormField
            key="usersPermissionView"
            control={control}
            name="usersPermissionView"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('users.permission.view')}</FormLabel>
                <UserSelect multi idEnterprise={idEnterprise} values={field.value as any} onChangeMulti={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <React.Fragment key="empty-perm" />
        ),
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} layout="vertical" />;
}
