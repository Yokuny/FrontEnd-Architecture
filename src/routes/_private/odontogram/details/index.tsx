import { createFileRoute } from '@tanstack/react-router';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Save from '@/components/icons/Save.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useOdontogramDetailQuery } from '@/query/odontogram';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';
import { OdontogramDetailContent } from './@components/odontogram-detail-content';
import { OdontogramEditForm } from './@components/odontogram-edit-form';
import { useOdontogramStatusForm } from './@hooks/use-odontogram-status-form';
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
  const { selectedStatus, setSelectedStatus, handleSave, isPending } = useOdontogramStatusForm(odontogram?._id || id || '', odontogram?.finished || false);

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="button" onClick={handleSave} disabled={isPending || isLoading || !odontogram}>
            {isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            <span className="sr-only md:not-sr-only">Salvar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className={isLoading || !odontogram ? 'p-12' : ''}>
        {isLoading ? (
          <DefaultLoading />
        ) : !odontogram ? (
          <DefaultEmptyData />
        ) : (
          <div className="flex flex-col gap-8">
            <OdontogramDetailContent odontogram={odontogram} patients={patients} professionals={professionals} />
            <Separator />
            <OdontogramEditForm selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} isPending={isPending} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button type="button" onClick={handleSave} disabled={isPending || isLoading || !odontogram}>
            {isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            <span className="sr-only md:not-sr-only">Salvar</span>
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
