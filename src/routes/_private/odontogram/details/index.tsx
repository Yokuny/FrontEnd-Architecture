import { createFileRoute } from '@tanstack/react-router';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOdontogramDetailQuery } from '@/query/odontogram';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';
import { OdontogramDetailContent } from './@components/odontogram-detail-content';
import { OdontogramEditForm } from './@components/odontogram-edit-form';
import { searchSchema } from './@interface/details.schema';

export const Route = createFileRoute('/_private/odontogram/details/')({
  component: OdontogramDetailPage,
  validateSearch: searchSchema,
  staticData: {
    title: 'Detalhes do Odontograma',
    description: 'Visualize o histórico e atualize o status dos procedimentos e anotações.',
  },
});

function OdontogramDetailPage() {
  const search = Route.useSearch();
  const id = search.id;

  const { data: odontogram, isLoading } = useOdontogramDetailQuery(id);
  const { data: patients } = usePatientsQuery();
  const { data: professionals } = useProfessionalsQuery();

  return (
    <Card asPage>
      <CardHeader />
      <CardContent className={isLoading || !odontogram ? 'p-12' : ''}>
        {isLoading ? (
          <DefaultLoading />
        ) : !odontogram ? (
          <DefaultEmptyData />
        ) : (
          <div className="flex flex-col gap-8">
            <OdontogramDetailContent odontogram={odontogram} patients={patients} professionals={professionals} />
            <Separator />
            <OdontogramEditForm id={odontogram._id} initialStatus={odontogram.finished} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
