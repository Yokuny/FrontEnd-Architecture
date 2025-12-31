import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { FileIcon, ImagePlus, Trash2, Upload, X } from 'lucide-react';
import React from 'react';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';
import { useModelMachine, useModelMachinesApi } from '@/hooks/use-model-machines-api';
import { cn } from '@/lib/utils';
import { ModelMachineForm } from './@components/model-machine-form';
import { useModelMachineForm } from './@hooks/use-model-machine-form';
import type { ModelMachine, ModelMachineFormData } from './@interface/model-machine';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/model-machine/add')({
  component: ModelMachineAddPage,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  beforeLoad: () => ({
    title: 'models.machine',
  }),
});

function ModelMachineAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/model-machine/add' });
  const { data: model, isLoading } = useModelMachine(id);

  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t(id ? 'edit.model' : 'new.model')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <ModelMachineAddFormContent initialData={model} />;
}

function ModelMachineAddFormContent({ initialData }: { initialData?: ModelMachine }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteModelMachine, uploadFile, deleteFile } = useModelMachinesApi();

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | undefined>(initialData?.image?.url);

  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [iconPreview, setIconPreview] = React.useState<string | undefined>(initialData?.icon?.url);

  const [additionalFiles, setAdditionalFiles] = React.useState<Array<File | any>>(initialData?.files || []);
  const [filesToDelete, setFilesToDelete] = React.useState<string[]>([]);

  const formData: ModelMachineFormData | undefined = React.useMemo(() => {
    if (!initialData) return undefined;

    return {
      id: initialData.id,
      description: initialData.description,
      specification: initialData.specification,
      color: initialData.color,
      typeMachine: initialData.typeMachine,
      typeVesselCIIReference: initialData.typeVesselCIIReference,
      idEnterprise: initialData.idEnterprise || initialData.enterprise?.id || '',
    };
  }, [initialData]);

  const { form, onSubmit, isPending: isSavingData } = useModelMachineForm(formData);

  const isPending = isSavingData || uploadFile.isPending || deleteFile.isPending || deleteModelMachine.isPending;

  const handleSave = form.handleSubmit(async (data) => {
    try {
      const id = await onSubmit(data);

      if (id) {
        // Upload Main Image
        if (imageFile) {
          await uploadFile.mutateAsync({ id, file: imageFile, type: 'image' });
        }

        // Upload Icon
        if (iconFile) {
          await uploadFile.mutateAsync({ id, file: iconFile, type: 'icon' });
        }

        // Upload Additional Files
        const newFiles = additionalFiles.filter((f) => f instanceof File) as File[];
        for (const file of newFiles) {
          await uploadFile.mutateAsync({ id, file });
        }

        // Delete Files
        for (const filename of filesToDelete) {
          await deleteFile.mutateAsync({ idModelMachine: id, filename });
        }

        toast.success(t('save.successfull'));
        navigate({ to: '/register/model-machine', search: { page: 1, size: 10 } });
      }
    } catch {
      // Error handled in hook/toast
    }
  });

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteModelMachine.mutateAsync(initialData.id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/model-machine', search: { page: 1, size: 10 } });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  const onDropImage = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onDropIcon = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onDropFiles = (files: File[]) => {
    setAdditionalFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    const file = additionalFiles[index];
    if (file.filename) {
      setFilesToDelete((prev) => [...prev, file.filename]);
    }
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const attachmentFields = [
    <div key="attachments" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">{t('image')}</h4>
          <Dropzone onDrop={onDropImage} accept={{ 'image/*': [] }} multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={cn(
                  'relative h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer',
                  'hover:bg-muted/50 border-muted-foreground/20',
                )}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <>
                    <ImagePlus className="size-10 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">{t('drag.image')}</p>
                  </>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">{t('icon')}</h4>
          <Dropzone onDrop={onDropIcon} accept={{ 'image/svg+xml': ['.svg'] }} multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={cn(
                  'relative h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer',
                  'hover:bg-muted/50 border-muted-foreground/20',
                )}
              >
                <input {...getInputProps()} />
                {iconPreview ? (
                  <img src={iconPreview} alt="Icon Preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <>
                    <Upload className="size-10 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">{t('drag.icon')}</p>
                  </>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">{t('files')}</h4>
          <Dropzone onDrop={onDropFiles}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={cn(
                  'h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer',
                  'hover:bg-muted/50 border-muted-foreground/20',
                )}
              >
                <input {...getInputProps()} />
                <FileIcon className="size-10 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground text-center px-4">{t('drag.files')}</p>
              </div>
            )}
          </Dropzone>
        </div>
      </div>

      {additionalFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {additionalFiles.map((file, index) => (
            <Item key={file.id || file.filename || file.name || index} variant="outline" className="p-2 flex items-center gap-3">
              <ItemMedia>
                <FileIcon className="size-4" />
              </ItemMedia>
              <ItemContent className="flex-1 overflow-hidden">
                <ItemTitle className="text-xs truncate">{file.name || file.filename}</ItemTitle>
              </ItemContent>
              <Button type="button" variant="ghost" size="icon" className="size-6" onClick={() => removeFile(index)}>
                <X className="size-3" />
              </Button>
            </Item>
          ))}
        </div>
      )}
    </div>,
  ];

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.model') : t('new.model')} />
      <Form {...form}>
        <form onSubmit={handleSave}>
          <CardContent className="p-0">
            <ModelMachineForm attachmentFields={attachmentFields} />
          </CardContent>

          <CardFooter layout="multi">
            <div>
              {initialData && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={isPending}>
                      {deleteModelMachine.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                      {t('delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('delete.confirmation')}</AlertDialogTitle>
                      <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        {t('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/register/model-machine', search: { page: 1, size: 10 } })}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending && <Spinner className="mr-2 size-4" />}
                {t('save')}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
