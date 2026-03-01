import { createFileRoute } from '@tanstack/react-router';
import { SettingsProcedures } from '../@components/settings-procedures';

export const Route = createFileRoute('/_private/settings/procedures/')({
  component: SettingsProcedures,
});
