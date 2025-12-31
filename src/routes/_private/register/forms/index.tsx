import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { FileText, MoreVertical, Pencil, Plus, Search, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { type Form, useFormsPaginated } from '@/hooks/use-forms-api';

const formsSearchSchema = z.object({
  page: z.number().catch(1).optional().default(1),
  size: z.number().catch(10).optional().default(10),
  search: z.string().optional(),
});

type FormsSearch = z.infer<typeof formsSearchSchema>;

export const Route = createFileRoute('/_private/register/forms/')({
  component: FormsListPage,
  validateSearch: (search: Record<string, unknown>): FormsSearch => formsSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'config.form',
  }),
});

interface PendingForm {
  id: string;
  data: {
    description?: string;
  };
}

function FormsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/register/forms/' });
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useFormsPaginated({
    idEnterprise: idEnterprise || '',
    page: page - 1,
    size: size,
    description: search,
  });

  // Get pending forms from localStorage
  const pendingForms: PendingForm[] = JSON.parse(localStorage.getItem('forms') || '[]');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const forms = data?.data || [];
  const total = data?.pageInfo?.count || 0;
  const totalPages = Math.ceil(total / size);

  const renderFormItem = (item: Form, isPending = false) => {
    return (
      <Item key={item.id || item._id} variant="outline" className={`flex items-center justify-between p-4 mb-2 ${isPending ? 'opacity-70 bg-muted/30' : ''}`}>
        <div className="flex items-center gap-4 flex-1">
          <ItemMedia className="size-10 rounded-full flex items-center justify-center bg-muted">
            <FileText className={`size-5 ${isPending ? 'text-muted-foreground' : 'text-primary'}`} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-base">{item.description}</ItemTitle>
            <ItemDescription className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="size-3" />
              {item.user?.name}
              {item.enterprise?.name && ` • ${item.enterprise.name}`}
            </ItemDescription>
          </ItemContent>
        </div>

        <div className="flex items-center gap-2">
          {isPending && (
            <Badge variant="secondary" className="text-xs">
              {t('not.save')}
            </Badge>
          )}

          {item.appliedPermissions?.canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    navigate({
                      to: '/register/forms/add',
                      search: { id: item.id || item._id, pending: isPending ? 'true' : undefined },
                    })
                  }
                >
                  <Pencil className="size-4 mr-2" />
                  {t('edit')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Item>
    );
  };

  return (
    <Card>
      <CardHeader title={t('config.form')}>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
          <Button onClick={() => navigate({ to: '/register/forms/add' })} disabled={!idEnterprise}>
            <Plus className="size-4 mr-2" />
            {t('btn.novo')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : forms.length === 0 && pendingForms.length === 0 ? (
          <EmptyData />
        ) : (
          <>
            {forms.length > 0 && <ItemGroup>{forms.map((item) => renderFormItem(item))}</ItemGroup>}

            {pendingForms.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-center mb-4">{t('unsaved.forms')}</p>
                <ItemGroup>
                  {pendingForms.map((form) =>
                    renderFormItem(
                      {
                        id: form.id,
                        description: form.data.description || t('no.title'),
                        user: user,
                        appliedPermissions: { canEdit: true },
                      },
                      true,
                    ),
                  )}
                </ItemGroup>
              </div>
            )}
          </>
        )}
      </CardContent>

      {total > 0 && (
        <CardFooter layout="multi">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              {t('total')}: {total}
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
    </Card>
  );
}
