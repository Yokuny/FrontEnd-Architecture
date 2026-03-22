# Padroes de Pagina

## Estrutura Obrigatoria

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardAction>
      {/* Acoes: botoes, filtros */}
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Conteudo */}
  </CardContent>
  <CardFooter>
    {/* Paginacao */}
  </CardFooter>
</Card>
```

## Pagina de Listagem (Exemplo Completo)

> **Regra**: Toda listagem de dados DEVE usar `DataTable` de `@/components/ui/data-table`.
> NUNCA use `ItemGroup` / `Item` para apresentar listagens de registros.

Exemplo real de `src/routes/_private/patient/index.tsx`:

```tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import Add from '@/components/icons/Add.Icon';
import Calender from '@/components/icons/Calender.Icon';
import Copy from '@/components/icons/Copy.Icon';
import Search from '@/components/icons/Search.Icon';
import Sort from '@/components/icons/Sort.Icon';
import User from '@/components/icons/User.Icon';

import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient';
import { usePatientsQuery } from '@/query/patients';

// 1. Schema de validacao dos search params
const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

// 2. Definicao da rota
export const Route = createFileRoute('/_private/patient/')(({
  component: PatientListPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

// 3. Componente da pagina
function PatientListPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/patient/' });

  // 4. Fetch de dados
  const { data, isLoading } = usePatientsQuery();

  // 5. Handlers
  const handleCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copiado para a área de transferência');
  }, []);

  // 6. Filtro/paginacao no cliente (quando o backend nao suporta)
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((p) => p.name.toLowerCase().includes(lowerSearch) || p.email?.toLowerCase().includes(lowerSearch));
  }, [data, search]);

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / size);
  const items = filteredData.slice((page - 1) * size, page * size);

  // 7. Definicao das colunas — SEMPRE com useMemo e tipagem correta
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
              <Badge variant={item.sex === 'M' ? 'secondary' : 'default'} className="h-5 px-1.5 text-[10px]">
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
      // Coluna de acoes: chave unica da entidade, header vazio, largura fixa
      {
        key: '_id',
        header: '',
        width: '50px',
        render: (_, item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon">
                <Sort className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: '/patient/details', search: { id: item._id } })}>
                <User className="mr-2 size-4 text-muted-foreground" />
                Visualizar cadastro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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

  // 8. Render com estrutura obrigatoria
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pacientes</CardTitle>
        <CardAction>
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:max-w-64">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar"
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
              <Add className="mr-2 size-4" />
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
          // DataTable com paginacao e busca DESATIVADAS (controladas externamente via URL)
          <DataTable
            data={items}
            columns={columns}
            searchable={false}
            showPagination={false}
            bordered={true}
            className="py-0"
            onRowClick={(row) => navigate({ to: '/patient/details', search: { id: row._id } })}
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
```


## Pagina de Formulario (Exemplo Completo)

Exemplo real de `src/routes/_private/register/geofences/add.tsx`:

```tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';

import { useGeofence, useGeofencesApi } from '@/hooks/use-geofences-api';
import { GeofenceForm } from './@components/geofence-form';
import { useGeofenceForm } from './@hooks/use-geofence-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/geofences/add')({
  component: GeofenceAddPage,
  validateSearch: searchSchema,
});

function GeofenceAddPage() {
  const { id } = useSearch({ from: '/_private/register/geofences/add' });
  const { data: geofence, isLoading } = useGeofence(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <GeofenceAddFormContent initialData={geofence} />;
}

function GeofenceAddFormContent({ initialData }: { initialData?: any }) {
  const navigate = useNavigate();
  const { deleteGeofence } = useGeofencesApi();

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      id: initialData.id,
      idEnterprise: initialData.idEnterprise,
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useGeofenceForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteGeofence.mutateAsync(initialData.id);
      toast.success('Excluído com sucesso');
      navigate({ to: '/register/geofences' });
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  return (
    <Card>
      <CardHeader />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <GeofenceForm />
          </CardContent>
          <CardFooter>
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={deleteGeofence.isPending || isPending}>
                    {deleteGeofence.isPending ? <Spinner className="mr-2 size-4" /> : <Delete className="mr-2 size-4" />}
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                      <Delete className="size-4" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit" disabled={isPending} className="ml-auto min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              Salvar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
```
