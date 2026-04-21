import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { DataTableAccordion } from '@/components/ui/data-table-accordion';
import { t } from '@/lib/helpers/translate.helper';
import { useFinancialsPartialQuery } from '@/query/financials';
import { FinancialView } from './@components/financial-view';
import { financialColumns } from './@utils/columns';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(5),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/financial/')({
  component: FinancialListPage,
  staticData: {
    title: t('financial'),
    description: t('financial.records.summary'),
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

function FinancialListPage() {
  const navigate = useNavigate();
  const { page, size } = useSearch({ from: '/_private/financial/' });
  const { data: financials, isLoading } = useFinancialsPartialQuery();

  const columns = useMemo(() => financialColumns(navigate), [navigate]);

  const handlePageChange = useCallback(
    (newPage: number) =>
      navigate({
        search: ((prev: any) => ({ ...prev, page: newPage }) satisfies SearchParams) as any,
        replace: true,
      } as any),
    [navigate],
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) =>
      navigate({
        search: ((prev: any) => ({ ...prev, size: newSize, page: 1 }) satisfies SearchParams) as any,
        replace: true,
      } as any),
    [navigate],
  );

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button onClick={() => navigate({ to: '/financial/add' })}>
            <Add className="size-4" />
            <span className="sr-only md:not-sr-only">{t('add')}</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading && <DefaultLoading />}
        {!financials?.length && !isLoading && <DefaultEmptyData />}
        {financials?.length && !isLoading && (
          <DataTableAccordion
            data={financials}
            columns={columns}
            searchable
            page={page}
            size={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            bordered={false}
            onRowClick={(row) => navigate({ to: '/financial/details', search: { id: row._id } })}
            renderExpanded={(row, isOpen) => <FinancialView id={row._id} isOpen={isOpen} />}
          />
        )}
      </CardContent>
    </Card>
  );
}
