import { createFileRoute } from '@tanstack/react-router';
// Icons
import { Activity, Calendar, DollarSign, FileText, Smile, User } from 'lucide-react';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientQuery } from '@/query/patient';
import { PatientAnamnesisView } from '../../@components/patient-anamnesis-view';
import { PatientIntraoralView } from '../../@components/patient-intraoral-view';
import { PatientProfile } from '../../@components/patient-profile';

const searchSchema = z.object({
  tab: z.enum(['profile', 'anamnesis', 'intraoral', 'odontogram', 'schedule', 'financial', 'medicalrecord']).default('profile'),
});

export const Route = createFileRoute('/_private/patient/details/$id/')({
  component: PatientDetailsPage,
  validateSearch: searchSchema,
});

function PatientDetailsPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const { data: patient, isLoading } = usePatientQuery(id);
  const navigate = Route.useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  if (!patient) return <div>Paciente não encontrado.</div>;

  const currentTab = search.tab;

  const handleTabChange = (value: string) => {
    navigate({ search: { tab: value as 'profile' | 'anamnesis' | 'intraoral' | 'odontogram' | 'schedule' | 'financial' | 'medicalrecord' } });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{patient.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2">
              <TabsTrigger value="profile">
                <User className="mr-2 size-4" /> Visão Geral
              </TabsTrigger>
              <TabsTrigger value="anamnesis">
                <Activity className="mr-2 size-4" /> Anamnese
              </TabsTrigger>
              <TabsTrigger value="intraoral">
                <Smile className="mr-2 size-4" /> Intraoral
              </TabsTrigger>
              <TabsTrigger value="odontogram">
                <FileText className="mr-2 size-4" /> Odontograma
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Calendar className="mr-2 size-4" /> Agendamentos
              </TabsTrigger>
              <TabsTrigger value="financial">
                <DollarSign className="mr-2 size-4" /> Financeiro
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
        </CardContent>
      </Card>
    </div>
  );
}
