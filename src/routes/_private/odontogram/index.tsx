import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useOdontogramsQuery } from '@/query/odontogram';
import { odontogramColumns } from './@utils/columns';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/odontogram/')({
  component: OdontogramListPage,
  staticData: {
    title: 'Odontogramas',
    description: 'Listagem e gerenciamento de odontogramas dos pacientes',
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

function OdontogramListPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { data = [], isLoading } = useOdontogramsQuery();

  const columns = useMemo(() => odontogramColumns(navigate), [navigate]);

  return (
    <Card asPage>
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <CardAction className="sm:self-center">
          <Button onClick={() => navigate({ to: '/odontogram/add' })}>
            <Add className="mr-2 size-4" />
            Adicionar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && <DefaultLoading />}
        {data.length === 0 && !isLoading && <DefaultEmptyData />}
        {data.length > 0 && !isLoading && (
          <DataTable
            data={data}
            columns={columns}
            searchable
            searchPlaceholder="Buscar paciente..."
            onRowClick={(row) => navigate({ to: '/odontogram/details', search: { id: row._id } })}
            bordered={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
