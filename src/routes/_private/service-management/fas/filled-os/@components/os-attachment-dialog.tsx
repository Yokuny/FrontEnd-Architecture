import { Download, ExternalLink, Paperclip, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useAddOrderAttachment, useDeleteOrderAttachment, useFasPresignedUrl } from '@/hooks/use-fas-api';
import type { OsFile, OsState } from '../@interface/os.schema';
import { canAddAttachment, canDeleteAttachment } from '../@utils/os-permissions';

interface OsAttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  files?: OsFile[];
  state?: OsState;
  onSuccess?: () => void;
}

export function OsAttachmentDialog({ open, onOpenChange, orderId, files = [], state, onSuccess }: OsAttachmentDialogProps) {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [supplierCanView, setSupplierCanView] = useState(false);

  const addAttachment = useAddOrderAttachment();
  const deleteAttachment = useDeleteOrderAttachment();
  const getPresignedUrl = useFasPresignedUrl();

  const canAdd = canAddAttachment(state);
  const canDelete = canDeleteAttachment(state);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    addAttachment.mutate(
      { id: orderId, files: selectedFiles, supplierCanView },
      {
        onSuccess: () => {
          setSelectedFiles([]);
          setSupplierCanView(false);
          onSuccess?.();
        },
      },
    );
  };

  const handleDelete = (fileName: string) => {
    deleteAttachment.mutate(
      { id: orderId, fileName },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  const handleDownload = (file: OsFile) => {
    if (!file.location) return;

    getPresignedUrl.mutate(
      { location: file.location },
      {
        onSuccess: (data) => {
          if (data?.url) {
            window.open(data.url, '_blank');
          }
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paperclip className="size-5" />
            {t('attachments')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* List existing files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <ItemDescription className="font-semibold">{t('fas.existing.attachments')}</ItemDescription>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Paperclip className="size-4 text-muted-foreground" />
                      <div>
                        <ItemTitle>{file.name}</ItemTitle>
                        {file.supplierCanView && <ItemDescription className="text-green-600 text-xs">{t('fas.supplier.can.view')}</ItemDescription>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(file)} disabled={!file.location}>
                        <Download className="size-4" />
                      </Button>
                      {file.location && (
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(file)}>
                          <ExternalLink className="size-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.name)}
                          disabled={deleteAttachment.isPending}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new files */}
          {canAdd && (
            <div className="space-y-4">
              <ItemDescription className="font-semibold">{t('fas.add.attachment')}</ItemDescription>

              <div className="space-y-4">
                <Input type="file" multiple onChange={handleFileChange} accept="*/*" />

                {selectedFiles.length > 0 && (
                  <div className="rounded-lg border p-3">
                    <ItemDescription className="mb-2">{t('fas.selected.files')}</ItemDescription>
                    <ul className="list-inside list-disc space-y-1">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="text-sm">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox id="supplierCanView" checked={supplierCanView} onCheckedChange={(checked) => setSupplierCanView(!!checked)} />
                  <Label htmlFor="supplierCanView" className="cursor-pointer">
                    {t('fas.supplier.can.view.attachment')}
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('close')}
          </Button>
          {canAdd && selectedFiles.length > 0 && (
            <Button onClick={handleUpload} disabled={addAttachment.isPending}>
              <Upload className="mr-2 size-4" />
              {addAttachment.isPending ? t('uploading') : t('upload')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
