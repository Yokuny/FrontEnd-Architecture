import { createFileRoute } from '@tanstack/react-router';
import { Download, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { ReportFormDialog } from './@components/report-form-dialog';
import { STATUS_VARIANTS } from './@consts/download-request.consts';
import { useDownloadQueueApi, useDownloadQueueQuery } from './@hooks/use-download-queue';
import type { DownloadQueueRequest } from './@interface/download-request.types';
import { calculateRemainingDays, formatInterval } from './@utils/download-request.utils';

export const Route = createFileRoute('/_private/telemetry/download-data-asset-request/')({
  component: DownloadDataAssetRequestPage,
});

function DownloadDataAssetRequestPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const hasPermission = true; // TODO: Implement actual permission check if needed

  const { data, isLoading } = useDownloadQueueQuery(idEnterprise);
  const { createRequest, deleteRequest } = useDownloadQueueApi(idEnterprise);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleCreate = (request: DownloadQueueRequest) => {
    createRequest.mutate(request, {
      onSuccess: () => setModalOpen(false),
    });
  };

  const handleDownload = (fileUrl?: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteRequest.mutate(itemToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader title={t('download')}>
          {hasPermission && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 size-4" />
              {t('new')}
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <DefaultLoading />
          ) : !data?.length ? (
            <DefaultEmptyData />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t('status')}</TableHead>
                    <TableHead className="text-center">{t('machine')}</TableHead>
                    <TableHead className="text-center">{t('date.start')}</TableHead>
                    <TableHead className="text-center">{t('date.end')}</TableHead>
                    <TableHead className="text-center">{t('interval')}</TableHead>
                    <TableHead className="text-center">{t('requested.by')}</TableHead>
                    <TableHead className="text-center">{t('created.at')}</TableHead>
                    <TableHead className="text-center">{t('days.remaining')}</TableHead>
                    {hasPermission && <TableHead className="w-[100px] text-right">{t('actions')}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => {
                    const createdDate = item.createdAt || item.created_at;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          <Badge variant={STATUS_VARIANTS[item.status] || 'secondary'}>{t(item.status || 'unknown')}</Badge>
                        </TableCell>
                        <TableCell className="text-center">{item.machines?.map((m) => m.name).join(', ') || '-'}</TableCell>
                        <TableCell className="text-center">{item.dateStart ? formatDate(new Date(item.dateStart), 'dd MMM, HH:mm') : '-'}</TableCell>
                        <TableCell className="text-center">{item.dateEnd ? formatDate(new Date(item.dateEnd), 'dd MMM, HH:mm') : '-'}</TableCell>
                        <TableCell className="text-center">{formatInterval(item.interval)}</TableCell>
                        <TableCell className="text-center">{item.user?.name || '-'}</TableCell>
                        <TableCell className="text-center">{formatDate(createdDate || new Date(), 'dd MMM, HH:mm')}</TableCell>
                        <TableCell className="text-center">{calculateRemainingDays(createdDate)}</TableCell>
                        {hasPermission && (
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownload(item.file)} disabled={!item.file || item.status !== 'ready'}>
                                  <Download className="mr-2 size-4" />
                                  {t('download')}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(item.id)}>
                                  <Trash2 className="mr-2 size-4" />
                                  {t('delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ReportFormDialog open={modalOpen} onOpenChange={setModalOpen} idEnterprise={idEnterprise} onSubmit={handleCreate} isLoading={createRequest.isPending} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm.delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirm.delete.message', { count: 1 })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant="destructive">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
