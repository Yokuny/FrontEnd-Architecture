import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import Dot from '@/components/icons/Dot.Icon';
import Pulse from '@/components/icons/Pulse.Icon';
import Search from '@/components/icons/Search.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/helpers/formatter.helper';
import type { PartialOdontogram } from '@/lib/interfaces/odontogram';
import { useOdontogramsQuery } from '@/query/odontogram';

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
  const { page, size, search } = useSearch({ from: '/_private/odontogram/' });

  const { data: allOdontograms, isLoading } = useOdontogramsQuery();

  // Filtro local pois não temos query params de paginação no backend até o momento
  const filteredData =
    allOdontograms?.filter((o) => {
      if (!search) return true;
      return o.patient.toLowerCase().includes(search.toLowerCase());
    }) || [];

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / size);
  const items = filteredData.slice((page - 1) * size, page * size);

  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copiado para a área de transferência');
  }, []);

  const columns = useMemo<DataTableColumn<PartialOdontogram>[]>(
    () => [
      {
        key: 'patient',
        header: 'Paciente',
        sortable: true,
        render: (_, item) => (
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary">
              <Pulse className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-base">{item.patient}</span>
              <span className="text-muted-foreground text-sm">
                {formatDate(String(item.createdAt))} • {item.procedureCount} Procedimentos
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'finished',
        header: 'Status',
        render: (_, item) => <div className="flex">{item.finished ? <Badge variant="completed">Finalizado</Badge> : <Badge variant="pending">Em andamento</Badge>}</div>,
      },
      {
        key: '_id',
        header: '',
        width: '50px',
        render: (_, item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon">
                <Dot className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate({ to: '/odontogram/details/$id', params: { id: item._id } })}>Visualizar</DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: '/financial/details/$id', params: { id: item.Financial } });
                }}
              >
                Orçamento
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: '/patient/details/$id', params: { id: item.patientID } });
                }}
              >
                Paciente
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(item.patient);
                }}
              >
                Copiar nome
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [navigate, handleCopy],
  );

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente..."
              className="pl-9"
              defaultValue={search || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: SearchParams) => ({
                      ...prev,
                      search: e.currentTarget.value || undefined,
                      page: 1,
                    }),
                  });
                }
              }}
            />
          </div>
          <Button onClick={() => navigate({ to: '/odontogram/add' })}>
            <Add className="mr-2 size-4" />
            Adicionar
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : items.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <DataTable
            data={items}
            columns={columns}
            searchable={false}
            showPagination={false}
            bordered={true}
            className="py-0"
            onRowClick={(row) => navigate({ to: '/odontogram/details/$id', params: { id: row._id } })}
          />
        )}
      </CardContent>

      {totalCount > 0 && (
        <CardFooter>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Exibir</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev: SearchParams) => ({ ...prev, size: Number(val), page: 1 }) })}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>por página</span>
            <span className="ml-4 tabular-nums">Total: {totalCount}</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && navigate({ search: (prev: SearchParams) => ({ ...prev, page: page - 1 }) })}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && navigate({ search: (prev: SearchParams) => ({ ...prev, page: page + 1 }) })}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
