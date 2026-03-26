import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import PatientAnalytics from './@components/patient-analytics';
import { usePatientList } from './@hooks/use-patient-list';
import { searchSchema } from './@interface/patient.interface';
import { patientColumns } from './@utils/columns';

export const Route = createFileRoute('/_private/patient/')({
  component: PatientListPage,
  staticData: {
    title: 'Pacientes',
    description: 'Gestão e listagem de pacientes cadastrados na clínica',
  },
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
});

function PatientListPage() {
  const { page, size, data, isLoading, handlePageChange, handlePageSizeChange, navigate } = usePatientList();

  const columns = useMemo(() => patientColumns(navigate), [navigate]);

  return (
    <Card asPage>
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <CardAction className="sm:self-center">
          <Button onClick={() => navigate({ to: '/patient/add' })}>
            <Add className="mr-2 size-4" />
            Adicionar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        <PatientAnalytics />

        {isLoading && <DefaultLoading />}
        {data.length === 0 && !isLoading && <DefaultEmptyData />}
        {data.length > 0 && !isLoading && (
          <DataTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Buscar por nome ou email"
            page={page}
            size={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowClick={(row) => navigate({ to: '/patient/details', search: { id: row._id } })}
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
