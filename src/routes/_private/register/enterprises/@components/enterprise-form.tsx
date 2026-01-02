import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import UploadImage from '@/components/upload-image';
import type { EnterpriseFormData } from '../@interface/enterprise-form-data';

export function EnterpriseForm() {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<EnterpriseFormData>();
  const [showToken, setShowToken] = useState(false);
  const publicKey = watch('publicKey');

  const sections = [
    {
      title: t('identification'),
      description: t('enterprise.general.description', 'Basic company information.'),
      fields: [
        <FormField
          key="name"
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name.enterprise.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('name.enterprise.label')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="active"
          control={control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
              <div className="space-y-0.5">
                <FormLabel className="text-base">{t('active')}</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />,
        publicKey && (
          <FormItem key="publicKey">
            <FormLabel>{t('machine.token.label')}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input type={showToken ? 'text' : 'password'} value={publicKey} readOnly className="pr-10" />
              </FormControl>
              <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <FormDescription>{t('machine.token.description', 'Token para integração com agentes de coleta.')}</FormDescription>
          </FormItem>
        ),
      ],
    },
    {
      title: t('address'),
      description: t('enterprise.address.description', 'Localização física da sede da empresa.'),
      fields: [
        <div key="zip-address" className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <FormField
              control={control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('zip.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-8">
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('address.label')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>,
        <div key="number-district" className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <FormField
              control={control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('number.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-9">
            <FormField
              control={control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('district.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('district.label')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>,
        <FormField
          key="complement"
          control={control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('complement.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('complement.label')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="city-state-country" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('city.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('city.label')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('state.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('state.label')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('country.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('country.label')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('location'),
      description: t('enterprise.location.description', 'Physical location of the company headquarters and geographical coordinates.'),
      fields: [
        <FormField
          key="description"
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Input placeholder={t('description')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="lat-lon" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lat.label')}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.0000" {...field} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="lon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('lon.label')}</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="0.0000" {...field} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('appearance'),
      description: t('enterprise.logos.description', 'Logos for light and dark themes.'),
      fields: [
        <div key="logos" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('drag.image.white')}</FormLabel>
                <FormControl>
                  <UploadImage
                    value={watch('imagePreview')}
                    onAddFile={(file) => {
                      field.onChange(file);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        setValue('imagePreview', reader.result as string);
                      };
                    }}
                    height={160}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="imageDark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('drag.image.dark')}</FormLabel>
                <FormControl>
                  <UploadImage
                    value={watch('imagePreviewDark')}
                    onAddFile={(file) => {
                      field.onChange(file);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = () => {
                        setValue('imagePreviewDark', reader.result as string);
                      };
                    }}
                    height={160}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
