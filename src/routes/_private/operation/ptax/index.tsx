import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ItemContent } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { usePtax, usePtaxApi } from '@/hooks/use-ptax-api';
import { formatDate } from '@/lib/formatDate';
import { PtaxModal } from './@components/ptax-modal';
import type { PtaxFormData } from './@interface/ptax.schema';

// import { useHasPermission } from '@/hooks/use-permissions';

const ptaxSearchSchema = z.object({
  page: z.number().catch(1).optional().default(1),
  size: z.number().catch(10).optional().default(10),
  search: z.string().optional(),
});

export const Route = createFileRoute('/_private/operation/ptax/')({
  component: PtaxPage,
  validateSearch: (search: Record<string, unknown>) => ptaxSearchSchema.parse(search),
});

function PtaxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/operation/ptax/' });
  const { idEnterprise } = useEnterpriseFilter();

  // const hasPermissionAdd = useHasPermission('/ptax-add');

  const { data, isLoading } = usePtax({
    idEnterprise: idEnterprise || '',
  });
  const { deletePtax } = usePtaxApi();

  const allPtax = data?.data || [];

  // Local filtering & pagination
  const filteredPtax = allPtax
    .filter((ptax) => {
      if (!search) return true;
      const s = search.toLowerCase();
      const dateFormatted = formatDate(ptax.date, 'dd MMM yyyy').toLowerCase();
      const valueFormatted = Number(ptax.value).toString();
      return dateFormatted.includes(s) || valueFormatted.includes(s);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCount = filteredPtax.length;
  const totalPages = Math.ceil(totalCount / size);
  const ptaxList = filteredPtax.slice((page - 1) * size, page * size);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPtax, setSelectedPtax] = useState<PtaxFormData | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ptaxToDelete, setPtaxToDelete] = useState<string | null>(null);

  const handleNew = () => {
    setSelectedPtax(undefined);
    setModalOpen(true);
  };

  const handleEdit = (ptax: PtaxFormData) => {
    setSelectedPtax(ptax);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (ptaxToDelete) {
      try {
        await deletePtax.mutateAsync({ id: ptaxToDelete, idEnterprise: idEnterprise || '' });
        toast.success(t('delete.success'));
      } catch {
        toast.error(t('error.delete'));
      } finally {
        setDeleteDialogOpen(false);
        setPtaxToDelete(null);
      }
    }
  };

  const confirmDelete = (id: string) => {
    setPtaxToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader title="PTAX">
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onBlur={(e) => {
                if (e.target.value !== search) {
                  navigate({
                    search: (prev) => ({ ...prev, search: e.target.value || undefined, page: 1 }),
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev) => ({ ...prev, search: e.currentTarget.value || undefined, page: 1 }),
                  });
                }
              }}
            />
          </div>
          {/* {hasPermissionAdd && ( */}
          <Button onClick={handleNew} disabled={isLoading}>
            <Plus className="mr-2 size-4" />
            {t('new')}
          </Button>
          {/* )} */}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : ptaxList.length === 0 ? (
          <EmptyData />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('value')}</TableHead>
                  <TableHead className="w-[100px] text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ptaxList.map((ptax) => (
                  <TableRow key={ptax.id}>
                    <TableCell>
                      <ItemContent>{formatDate(ptax.date, 'dd MMM yyyy')}</ItemContent>
                    </TableCell>
                    <TableCell>
                      <ItemContent>
                        {Number(ptax.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                      </ItemContent>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(ptax)}>
                            <Pencil className="mr-2 size-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(ptax.id)}>
                            <Trash2 className="mr-2 size-4" />
                            {t('delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {totalCount > 0 && (
        <CardFooter layout="multi">
          <div className="order-2 flex items-center gap-2 text-muted-foreground text-sm sm:order-1">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev) => ({ ...prev, size: Number(val), page: 1 }) })}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>{t('per.page')}</span>
            <span className="ml-4 tabular-nums">
              {t('total')}: {totalCount}
            </span>
          </div>

          <div className="order-1 sm:order-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) navigate({ search: (prev) => ({ ...prev, page: page - 1 }) });
                    }}
                    aria-disabled={page <= 1}
                    className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate({ search: (prev) => ({ ...prev, page: pageNum }) });
                        }}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) navigate({ search: (prev) => ({ ...prev, page: page + 1 }) });
                    }}
                    aria-disabled={page >= totalPages}
                    className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardFooter>
      )}

      <PtaxModal open={modalOpen} onOpenChange={setModalOpen} initialData={selectedPtax} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirm.delete.message', { count: 1 })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPtaxToDelete(null)}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant="destructive">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
