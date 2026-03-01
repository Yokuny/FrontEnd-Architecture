import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Activity, MoreVertical, Plus, Search } from 'lucide-react';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/helpers/formatter.helper';
import { useOdontogramsQuery } from '@/query/odontogram';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/odontogram/')({
  component: OdontogramListPage,
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

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Odontogramas</CardTitle>
        <CardAction>
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
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
              <Plus className="mr-2 size-4" />
              Adicionar
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : items.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {items.map((item) => (
              <Item key={item._id} variant="outline" className="cursor-pointer" onClick={() => navigate({ to: '/odontogram/$id', params: { id: item._id } })}>
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="icon">
                    <Activity className="size-5" />
                  </ItemMedia>
                  <ItemContent className="w-full flex-1 gap-0 sm:w-auto">
                    <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col">
                        <ItemTitle className="text-base">{item.patient}</ItemTitle>
                        <ItemDescription>
                          {formatDate(String(item.createdAt))} • {item.procedureCount} Procedimentos
                        </ItemDescription>
                      </div>
                      <div className="mt-2 sm:mt-0">{item.finished ? <Badge variant="success">Finalizado</Badge> : <Badge variant="warning">Em andamento</Badge>}</div>
                    </div>
                  </ItemContent>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate({ to: '/odontogram/$id', params: { id: item._id } })}>Visualizar</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigate({ to: '/financial/$id', params: { id: item.Financial } });
                      }}
                    >
                      Orçamento
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // @ts-expect-error
                        navigate({ to: '/patient/$id', params: { id: item.patientID } });
                      }}
                    >
                      Paciente
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCopy(item.patient)}>Copiar nome</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Item>
            ))}
          </ItemGroup>
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
