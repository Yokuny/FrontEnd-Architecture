import { createFileRoute } from '@tanstack/react-router';
import { SettingsInvite } from '../@components/settings-invite';

export const Route = createFileRoute('/_private/settings/invite/')({
  component: SettingsInvite,
});
