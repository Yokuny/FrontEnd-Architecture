import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import IconCross from '@/components/icons/Cross.Icon';
import IconDelete from '@/components/icons/Delete.Icon';
import IconEdit from '@/components/icons/Edit.Icon';
import IconUpload from '@/components/icons/Upload.Icon';
import IconUploadCloud from '@/components/icons/UploadCloud.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { t } from '@/lib/helpers/translate.helper';
import { getPresignedUrl, uploadToS3 } from '@/lib/helpers/upload.helper';
import { cn } from '@/lib/utils/index';

interface MedicalRecordImageUploadProps {
  recordID: string;
  imgURL?: string;
  onUploadComplete?: (imageUrl: string, key: string) => void;
  onImageRemove?: () => void;
}

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed';
}

export function MedicalRecordImageUpload({ recordID, imgURL, onUploadComplete, onImageRemove }: MedicalRecordImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(imgURL);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const handleUpload = useCallback(
    async (file: File) => {
      const fileEntry: UploadingFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading',
      };

      setUploadingFile(fileEntry);

      try {
        setUploadingFile((prev) => (prev ? { ...prev, progress: 20 } : prev));
        const { uploadUrl, key } = await getPresignedUrl(recordID, file.type);

        setUploadingFile((prev) => (prev ? { ...prev, progress: 50 } : prev));
        const bucketImgURL = await uploadToS3(uploadUrl, file);
        const finalImageUrl = bucketImgURL?.split('?')[0];

        setUploadingFile((prev) => (prev ? { ...prev, progress: 90 } : prev));

        setTimeout(() => {
          setUploadingFile((prev) => {
            if (prev) URL.revokeObjectURL(prev.preview);
            return null;
          });
          setIsEditing(false);
          setImageUrl(finalImageUrl);
          if (onUploadComplete) {
            onUploadComplete(finalImageUrl ?? '', key);
          }
        }, 400);

        setUploadingFile((prev) => (prev ? { ...prev, progress: 100, status: 'completed' } : prev));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('upload.unknown.error');
        toast.error(errorMessage);
        setUploadingFile((prev) => {
          if (prev) URL.revokeObjectURL(prev.preview);
          return null;
        });
      }
    },
    [recordID, onUploadComplete],
  );

  const validateAndUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error(t('upload.images.only'));
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        toast.error(t('upload.max.size.30mb'));
        return;
      }
      handleUpload(file);
    },
    [handleUpload],
  );

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    setIsEditing(false);
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const cancelUpload = useCallback(() => {
    setUploadingFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview);
      return null;
    });
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        validateAndUpload(droppedFile);
      }
    },
    [validateAndUpload],
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/gif';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        validateAndUpload(target.files[0]);
      }
    };
    input.click();
  }, [validateAndUpload]);

  // Image exists and not editing — show preview grid with overlay buttons
  if (imageUrl && !isEditing) {
    return (
      <div className="mt-4 w-full">
        <div className="mb-3 grid grid-cols-4 gap-2.5">
          <Card className="group/item relative flex shrink-0 items-center justify-center rounded-md bg-accent/50 p-0 shadow-none">
            <img src={imageUrl} alt={t('record.image.alt')} className="h-[120px] w-full rounded-md object-cover" />
            <Button
              onClick={() => handleRemoveImage()}
              variant="info"
              size="icon"
              className="absolute inset-e-1 top-1 size-6 rounded-full opacity-0 shadow-sm group-hover/item:opacity-100 dark:bg-zinc-800 hover:dark:bg-zinc-700"
            >
              <IconCross className="size-3.5" />
            </Button>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button variant="info" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
            <IconEdit className="size-4" />
            {t('change')}
          </Button>
          <Button variant="info" size="sm" className="gap-2" onClick={() => handleRemoveImage()}>
            <IconDelete className="size-4" />
            {t('erase')}
          </Button>
        </div>
      </div>
    );
  }

  // Editing or no image — show upload interface
  return (
    <div className="mt-4 w-full">
      {/* Upload Area — Card dashed border */}
      <Card
        className={cn(
          'rounded-md border-dashed shadow-none transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="text-center">
          <div className="mx-auto mb-3 flex size-[32px] items-center justify-center rounded-full border border-border">
            <IconUploadCloud className="size-4" />
          </div>
          <h3 className="mb-0.5 font-semibold text-2sm text-foreground">{t('upload.drag.or.select')}</h3>
          <span className="mb-3 block font-normal text-secondary-foreground text-xs">{t('upload.image.formats')}</span>
          <Button size="sm" onClick={openFileDialog}>
            {t('select.file')}
          </Button>
        </CardContent>
      </Card>

      {/* Upload Progress Card */}
      {uploadingFile && (
        <div className="mt-6 space-y-3">
          <Card className="rounded-md p-0 shadow-none">
            <CardContent className="flex items-center gap-2 p-3">
              <div className="flex size-[32px] shrink-0 items-center justify-center rounded-md border border-border">
                <IconUpload className="size-4 text-muted-foreground" />
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <div className="-mt-2 flex w-full items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-foreground text-xs leading-none">{uploadingFile.name}</span>
                    <span className="font-normal text-muted-foreground text-xs leading-none">{formatBytes(uploadingFile.size)}</span>
                    {uploadingFile.status === 'uploading' && (
                      <span className="text-muted-foreground text-xs">
                        {t('uploading')} {Math.round(uploadingFile.progress)}%
                      </span>
                    )}
                  </div>
                  <Button onClick={cancelUpload} variant="blank" size="icon" className="size-6">
                    <IconCross className="size-3.5" />
                  </Button>
                </div>
                <Progress value={uploadingFile.progress} className={cn('h-1 transition-all duration-300', '[&>div]:bg-zinc-950 dark:[&>div]:bg-zinc-50')} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isEditing && (
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(false);
          }}
        >
          {t('cancel')}
        </Button>
      )}
    </div>
  );
}
