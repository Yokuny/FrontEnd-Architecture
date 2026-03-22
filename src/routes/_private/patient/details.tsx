import { createFileRoute } from '@tanstack/react-router';
// Icons
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import Calender from '@/components/icons/Calender.Icon';
import Dollar from '@/components/icons/Dollar.Icon';
import Face from '@/components/icons/Face.Icon';
import Mail from '@/components/icons/Mail.Icon';
import Pulse from '@/components/icons/Pulse.Icon';
import User from '@/components/icons/User.Icon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientQuery } from '@/query/patient';
import { PatientAnamnesisView } from './@components/patient-anamnesis-view';
import { PatientIntraoralView } from './@components/patient-intraoral-view';
import { PatientProfile } from './@components/patient-profile';

const searchSchema = z.object({
  id: z.string(),
  tab: z.enum(['profile', 'anamnesis', 'intraoral', 'odontogram', 'schedule', 'financial', 'medicalrecord']).default('profile'),
});

export const Route = createFileRoute('/_private/patient/details')({
  component: PatientDetailsPage,
  staticData: {
    title: 'Prontuário do Paciente',
    description: 'Visão completa, prontuário, odontograma e histórico do paciente.',
  },
  validateSearch: searchSchema,
});

function PatientDetailsPage() {
  const search = Route.useSearch();
  const id = search.id;
  const { data: patient, isLoading } = usePatientQuery(id);
  const navigate = Route.useNavigate();

  const currentTab = search.tab;

  const handleTabChange = (value: string) => {
    navigate({ search: (prev: any) => ({ ...prev, tab: value as 'profile' | 'anamnesis' | 'intraoral' | 'odontogram' | 'schedule' | 'financial' | 'medicalrecord' }) });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Card asPage>
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <DefaultLoading />
          ) : !patient ? (
            <div className="p-12 text-center">Paciente não encontrado.</div>
          ) : (
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2">
                <TabsTrigger value="profile">
                  <User className="mr-2 size-4" /> Visão Geral
                </TabsTrigger>
                <TabsTrigger value="anamnesis">
                  <Pulse className="mr-2 size-4" /> Anamnese
                </TabsTrigger>
                <TabsTrigger value="intraoral">
                  <Face className="mr-2 size-4" /> Intraoral
                </TabsTrigger>
                <TabsTrigger value="odontogram">
                  <Mail className="mr-2 size-4" /> Odontograma
                </TabsTrigger>
                <TabsTrigger value="schedule">
                  <Calender className="mr-2 size-4" /> Agendamentos
                </TabsTrigger>
                <TabsTrigger value="financial">
                  <Dollar className="mr-2 size-4" /> Financeiro
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <PatientProfile patient={patient} />
              </TabsContent>
              <TabsContent value="anamnesis" className="mt-6">
                <PatientAnamnesisView anamnesis={patient.anamnesis} />
              </TabsContent>
              <TabsContent value="intraoral" className="mt-6">
                <PatientIntraoralView intraoral={patient.intraoral} />
              </TabsContent>
              <TabsContent value="odontogram" className="mt-6">
                Em construção: Odontogram
              </TabsContent>
              <TabsContent value="schedule" className="mt-6">
                Em construção: Schedule
              </TabsContent>
              <TabsContent value="financial" className="mt-6">
                Em construção: Financial
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
