import { createFileRoute, Link } from '@tanstack/react-router';
import type { ComponentType, SVGProps } from 'react';
import Access from '@/components/icons/Access.Icon';
import Clinic from '@/components/icons/Clinic.Icon';
import Lock from '@/components/icons/Lock.Icon';
import Mail from '@/components/icons/Mail.Icon';
import Service from '@/components/icons/Service.Icon';
import User from '@/components/icons/User.Icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { t } from '@/lib/helpers/translate.helper';

const SETTINGS_SECTIONS = [
  { to: '/settings/profile', titleKey: 'profile', descriptionKey: 'profile.page.description', icon: User },
  { to: '/settings/clinic', titleKey: 'clinic', descriptionKey: 'clinic.page.description', icon: Clinic },
  { to: '/settings/access', titleKey: 'access', descriptionKey: 'access.page.description', icon: Access },
  { to: '/settings/permissions', titleKey: 'permissions', descriptionKey: 'permissions.page.description', icon: Lock },
  { to: '/settings/invite', titleKey: 'invite', descriptionKey: 'invite.page.description', icon: Mail },
  { to: '/settings/procedures', titleKey: 'services', descriptionKey: 'services.page.description', icon: Service },
] as const;

type SettingsSection = (typeof SETTINGS_SECTIONS)[number] & {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const Route = createFileRoute('/_private/settings/')({
  component: SettingsIndexPage,
  staticData: {
    title: t('settings'),
    description: t('settings.index.description'),
  },
});

function SettingsIndexPage() {
  return (
    <Card asPage>
      <CardHeader />
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SETTINGS_SECTIONS.map(({ to, titleKey, descriptionKey, icon: Icon }: SettingsSection) => (
          <Item key={to} variant="info" className="h-full min-h-28 cursor-pointer p-5" asChild>
            <Link to={to}>
              <ItemMedia variant="icon" className="size-10">
                <Icon className="size-6" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg">{t(titleKey)}</ItemTitle>
                <ItemDescription>{t(descriptionKey)}</ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </CardContent>
    </Card>
  );
}
