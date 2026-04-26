import { createFileRoute } from '@tanstack/react-router';
import { Activity } from 'react';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { t } from '@/lib/helpers/translate.helper';
import { usePatientQuery } from '@/query/patient';
import { PatientAnamnesisView } from './@components/anamnesis-view';
import { PatientFinancialView } from './@components/financial-view';
import { PatientIntraoralView } from './@components/intraoral-view';
import { PatientMedicalRecordView } from './@components/medicalrecord-view';
import { PatientOdontogramView } from './@components/odontogram-view';
import { PatientProfile } from './@components/profile';
import { PatientScheduleView } from './@components/schedule-view';
import { tabs, tabValues } from './@consts/tabs';

const searchSchema = z.object({
  id: z.string().optional(),
  tab: z.enum(tabValues).default('profile'),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/patient/details/')({
  component: PatientDetailsPage,
  staticData: {
    title: t('patient.record.title'),
    description: t('patient.record.description'),
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
    navigate({ search: ((prev: any) => ({ ...prev, tab: value as (typeof tabValues)[number] }) satisfies SearchParams) as any } as any);
  };

  return (
    <Card asPage>
      <CardHeader title={patient?.name} />
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
                  <Icon className="size-4" /> {label}
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
  );
}
