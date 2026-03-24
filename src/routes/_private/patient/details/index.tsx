import { createFileRoute } from '@tanstack/react-router';
import { Activity } from 'react';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientQuery } from '@/query/patient';
import { PatientAnamnesisView } from './@components/patient-anamnesis-view';
import { PatientFinancialView } from './@components/patient-financial-view';
import { PatientIntraoralView } from './@components/patient-intraoral-view';
import { PatientMedicalRecordView } from './@components/patient-medicalrecord-view';
import { PatientOdontogramView } from './@components/patient-odontogram-view';
import { PatientProfile } from './@components/patient-profile';
import { PatientScheduleView } from './@components/patient-schedule-view';
import { tabs, tabValues } from './@consts/tabs';

const searchSchema = z.object({
  id: z.string().optional(),
  tab: z.enum(tabValues).default('profile'),
});

export const Route = createFileRoute('/_private/patient/details/')({
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
    navigate({ search: (prev) => ({ ...prev, tab: value as (typeof tabValues)[number] }) });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Card asPage>
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <DefaultLoading />
          ) : !patient ? (
            <DefaultEmptyData />
          ) : (
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2">
                {tabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger key={value} value={value}>
                    <Icon className="mr-2 size-4" /> {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-6">
                <Activity mode={currentTab === 'profile' ? 'visible' : 'hidden'}>
                  <PatientProfile patient={patient} />
                </Activity>
                <Activity mode={currentTab === 'anamnesis' ? 'visible' : 'hidden'}>
                  <PatientAnamnesisView anamnesis={patient.anamnesis} patientId={patient._id} />
                </Activity>
                <Activity mode={currentTab === 'intraoral' ? 'visible' : 'hidden'}>
                  <PatientIntraoralView intraoral={patient.intraoral} patientId={patient._id} />
                </Activity>
                <Activity mode={currentTab === 'odontogram' ? 'visible' : 'hidden'}>
                  <PatientOdontogramView patient={patient} />
                </Activity>
                <Activity mode={currentTab === 'schedule' ? 'visible' : 'hidden'}>
                  <PatientScheduleView patient={patient} />
                </Activity>
                <Activity mode={currentTab === 'financial' ? 'visible' : 'hidden'}>
                  <PatientFinancialView patient={patient} />
                </Activity>
                <Activity mode={currentTab === 'medicalrecord' ? 'visible' : 'hidden'}>
                  <PatientMedicalRecordView patient={patient} />
                </Activity>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
