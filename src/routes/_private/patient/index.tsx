import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Calendar as CalendarIcon, Copy, FileText, MoreVertical, Plus, Receipt, Search, User } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient';
import { usePatientsQuery } from '@/query/patients';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/patient/')({
  component: PatientListPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

function PatientListPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/patient/' });

  const { data, isLoading } = usePatientsQuery();

  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copiado para a área de transferência');
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((p) => p.name.toLowerCase().includes(lowerSearch) || p.email?.toLowerCase().includes(lowerSearch));
  }, [data, search]);

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / size);
  const items = filteredData.slice((page - 1) * size, page * size);

  const columns = useMemo<DataTableColumn<PartialPatient>[]>(
    () => [
      {
        key: 'name',
        header: 'Paciente',
        sortable: true,
        render: (_, item) => (
          <div className="flex items-center gap-4">
            <Avatar className="size-10">
              <AvatarImage src={item.image} alt={item.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="size-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-medium text-base">{item.name}</span>
              <Badge variant={item.sex === 'M' ? 'neutral' : 'pink'} className="h-5 px-1.5 text-[10px]">
                {item.sex === 'M' ? 'M' : 'F'}
              </Badge>
            </div>
          </div>
        ),
      },
      {
        key: 'email',
        header: 'Contato',
        render: (_, item) => (
          <div className="flex flex-col gap-1 text-muted-foreground text-sm">
            {item.phone1 && <span>{formatPhone(item.phone1)}</span>}
            {item.phone2 && <span>{formatPhone(item.phone2)}</span>}
            {item.email && <span className="lowercase">{item.email}</span>}
          </div>
        ),
      },
      {
        key: '_id',
        header: '',
        width: '50px',
        render: (_, item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: '/patient/details/$id', params: { id: item._id } })}>
                <User className="mr-2 size-4 text-muted-foreground" />
                Visualizar cadastro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 size-4 text-muted-foreground" />
                Criar odontograma
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Receipt className="mr-2 size-4 text-muted-foreground" />
                Criar cobrança
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                Criar agendamento
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {item.phone1 && (
                <DropdownMenuItem onClick={() => handleCopy(item.phone1!)}>
                  <Copy className="mr-2 size-4 text-muted-foreground" />
                  Copiar telefone
                </DropdownMenuItem>
              )}
              {item.email && (
                <DropdownMenuItem onClick={() => handleCopy(item.email!)}>
                  <Copy className="mr-2 size-4 text-muted-foreground" />
                  Copiar email
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleCopy(item.name)}>
                <Copy className="mr-2 size-4 text-muted-foreground" />
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
    <Card>
      <CardHeader>
        <CardTitle>Pacientes</CardTitle>
        <div className="flex w-full flex-col items-center gap-4 sm:ml-auto sm:w-auto sm:flex-row">
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou CPF"
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
          <Button onClick={() => navigate({ to: '/patient/add' })}>
            <Plus className="mr-2 size-4" />
            Adicionar
          </Button>
        </div>
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
            onRowClick={(row) => navigate({ to: '/patient/details/$id', params: { id: row._id } })}
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

          <Pagination className="ml-auto w-auto">
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
