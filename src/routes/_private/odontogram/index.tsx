import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { DataTableAccordion } from '@/components/ui/data-table-accordion';
import { useOdontogramsQuery } from '@/query/odontogram';
import { OdontogramView } from './@components/odontogram-view';
import { odontogramColumns } from './@utils/columns';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(5),
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
  const { page, size } = useSearch({ from: '/_private/odontogram/' });
  const { data: odontograms, isLoading } = useOdontogramsQuery();

  const columns = useMemo(() => odontogramColumns(navigate), [navigate]);

  const handlePageChange = useCallback((newPage: number) => navigate({ search: (prev) => ({ ...prev, page: newPage }), replace: true }), [navigate]);

  const handlePageSizeChange = useCallback((newSize: number) => navigate({ search: (prev) => ({ ...prev, size: newSize, page: 1 }), replace: true }), [navigate]);

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button onClick={() => navigate({ to: '/odontogram/add' })}>
            <Add className="mr-2 size-4" />
            Adicionar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading && <DefaultLoading />}
        {!odontograms?.length && !isLoading && <DefaultEmptyData />}
        {odontograms?.length && !isLoading && (
          <DataTableAccordion
            data={odontograms}
            columns={columns}
            searchable
            page={page}
            size={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            bordered={false}
            onRowClick={(row) => navigate({ to: '/odontogram/details', search: { id: row._id } })}
            renderExpanded={(row, isOpen) => <OdontogramView id={row._id} isOpen={isOpen} />}
          />
        )}
      </CardContent>
    </Card>
  );
}
