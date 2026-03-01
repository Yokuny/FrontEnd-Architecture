import { createFileRoute } from '@tanstack/react-router';
import { SettingsClinic } from '../@components/settings-clinic';

export const Route = createFileRoute('/_private/settings/clinic/')({
  component: SettingsClinic,
});
