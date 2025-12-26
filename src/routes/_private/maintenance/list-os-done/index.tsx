import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { OsDoneItem } from './@components/os-done-item';
import { useListOrderServiceDone } from './@hooks/use-list-os-done-api';

const listOsDoneSearchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
  search: z.string().optional(),
});

type ListOsDoneSearch = z.infer<typeof listOsDoneSearchSchema>;

export const Route = createFileRoute('/_private/maintenance/list-os-done/')({
  component: ListOsDonePage,
  validateSearch: (search: Record<string, unknown>): ListOsDoneSearch => listOsDoneSearchSchema.parse(search),
});

function ListOsDonePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = Route.useSearch() as ListOsDoneSearch;
  const page = searchParams.page ?? 1;
  const size = searchParams.size ?? 10;
  const search = searchParams.search;

  const idEnterprise = localStorage.getItem('id_enterprise_filter') || '';

  const { data, isLoading } = useListOrderServiceDone({
    page: page - 1,
    size,
    search,
    idEnterprise,
  });

  const hasViewPermission = true;

  const totalItems = data?.pageInfo?.[0]?.count ?? 0;

  return (
    <Card>
      <CardHeader title={t('done.os')} />

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        ) : data?.data && data.data.length > 0 ? (
          <div className="space-y-4">
            {data.data.map((item) => (
              <OsDoneItem key={item.id} item={item} hasViewPermission={hasViewPermission} />
            ))}

            {totalItems > size && (
              <div className="flex justify-center gap-2 pt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ to: '.', search: { page: page - 1, size, search } as any })}>
                  {t('previous')}
                </Button>
                <span className="flex items-center px-3 text-sm text-muted-foreground">
                  {t('page')} {page} / {Math.ceil(totalItems / size)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(totalItems / size)}
                  onClick={() => navigate({ to: '.', search: { page: page + 1, size, search } as any })}
                >
                  {t('next')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">{t('not.found')}</div>
        )}
      </CardContent>
    </Card>
  );
}
