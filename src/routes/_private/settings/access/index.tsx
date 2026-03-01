import { createFileRoute } from '@tanstack/react-router';
import { SettingsAccess } from '../@components/settings-access';

export const Route = createFileRoute('/_private/settings/access/')({
  component: SettingsAccess,
});
