import { createFileRoute } from '@tanstack/react-router';
import { SettingsPermissions } from '../@components/settings-permissions';

export const Route = createFileRoute('/_private/settings/permissions/')({
  component: SettingsPermissions,
});
