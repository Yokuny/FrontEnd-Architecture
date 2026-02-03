import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Edit, ImageOff, Save, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ItemDescription } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useHasPermission } from '@/hooks/use-permissions';
import { formatDate } from '@/lib/formatDate';
import { CMMSCharts } from './@components/cmms-charts';
import { DiagramCanvas } from './@components/diagram-canvas';
import { MarkerEditor } from './@components/marker-editor';
import { useDiagramApi, useDiagramDetail, useEquipmentStatus, useSensorStates } from './@hooks/use-diagram-details';
import type { DiagramMarker } from './@interface/diagram-details.types';

const searchParamsSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/telemetry/diagram-list/diagram')({
  component: DiagramDetailsPage,
  validateSearch: (search: Record<string, unknown>) => searchParamsSchema.parse(search),
  beforeLoad: () => ({
    title: 'diagram',
  }),
});

function DiagramDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useSearch({ from: '/_private/telemetry/diagram-list/diagram' });
  const { idEnterprise } = useEnterpriseFilter();
  const hasPermissionAdd = useHasPermission('/diagram-add');

  const [isEditing, setIsEditing] = useState(!id);
  const [markers, setMarkers] = useState<DiagramMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<DiagramMarker | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<{ url: string; data?: File; new?: boolean } | null>(null);

  const lastDateRef = useRef<string | undefined>(undefined);

  // API Hooks
  const { data: diagramData, isLoading } = useDiagramDetail(id, idEnterprise);
  const { data: sensorStates } = useSensorStates(markers, !isEditing && markers.length > 0);
  const { data: equipmentStatus } = useEquipmentStatus(markers, !isEditing);
  const { uploadImage, saveDiagram } = useDiagramApi(idEnterprise);

  // Load diagram data
  useEffect(() => {
    if (diagramData) {
      setMarkers(diagramData.data || []);
      setDescription(diagramData.description || '');
      if (diagramData.image) {
        setImage({ url: typeof diagramData.image === 'string' ? diagramData.image : diagramData.image.url });
      }
    }
  }, [diagramData]);

  // Update markers with sensor states
  useEffect(() => {
    if (!sensorStates?.length) return;
    setMarkers((prev) =>
      prev.map((marker) => {
        const sensorData = sensorStates.find((s) => s.idMachine === marker.machine && s.idSensor === marker.sensor);
        if (sensorData) {
          lastDateRef.current = sensorData.date;
          return { ...marker, state: sensorData.value };
        }
        return marker;
      }),
    );
  }, [sensorStates]);

  // Update markers with equipment status
  useEffect(() => {
    if (!equipmentStatus?.length) return;
    setMarkers((prev) =>
      prev.map((marker) => {
        if (marker.type !== 'maintenance') return marker;
        const status = equipmentStatus.find((e) => e.machineId === marker.machine && e.equipment === marker.equipment);
        return status ? { ...marker, state: status.status } : marker;
      }),
    );
  }, [equipmentStatus]);

  const handleAddMarker = useCallback((marker: DiagramMarker) => {
    setMarkers((prev) => [...prev, marker]);
    setSelectedMarker(marker);
  }, []);

  const handleUpdateMarker = useCallback((marker: DiagramMarker) => {
    setMarkers((prev) => prev.map((m) => (m.id === marker.id ? marker : m)));
  }, []);

  const handleRemoveMarker = useCallback((markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    setSelectedMarker(null);
  }, []);

  const handleMarkerClick = useCallback(
    (marker: DiagramMarker) => {
      if (isEditing) return;
      if (marker.type === 'maintenance') {
        // Handle maintenance click if needed, e.g. navigate to CMMS or open detailed chart
      } else if (marker.machine && marker.sensor) {
        navigate({
          to: '/telemetry/performance',
          search: {
            machine: marker.machine,
            sensors: [marker.sensor],
          },
        } as any);
      }
    },
    [isEditing, navigate],
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({ url: URL.createObjectURL(file), data: file, new: true });
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setMarkers([]);
  };

  const handleSave = async () => {
    let finalImage = image;

    if (image?.new && image.data) {
      const uploaded = await uploadImage.mutateAsync(image.data);
      finalImage = { url: uploaded.url };
      setImage(finalImage);
    }

    await saveDiagram.mutateAsync({
      id: id,
      description,
      markers,
      image: finalImage,
    });

    navigate({ to: '/telemetry/diagram-list', search: { page: 0 } });
  };

  const isSaving = uploadImage.isPending || saveDiagram.isPending;

  // Render selected marker editor
  const renderMarkerEditor = useMemo(() => {
    if (!selectedMarker || !isEditing) return null;
    return (
      <div className="fixed top-20 right-4 z-50">
        <MarkerEditor marker={selectedMarker} onSave={handleUpdateMarker} onRemove={handleRemoveMarker} onClose={() => setSelectedMarker(null)}>
          <div />
        </MarkerEditor>
      </div>
    );
  }, [selectedMarker, isEditing, handleUpdateMarker, handleRemoveMarker]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('diagram')} />
        <CardContent>
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={isEditing ? (id ? `${t('edit')} ${t('diagram')}` : t('diagram.new')) : diagramData?.description || t('diagram')}>
        {isEditing && (
          <div className="flex items-center gap-2">
            <Label>{t('description')}</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('description')} className="w-64" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!image?.url ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8">
            <ImageOff className="size-16 text-muted-foreground" />
            <p className="text-muted-foreground">{t('upload.image')}</p>
            <Input type="file" accept="image/*" onChange={handleImageUpload} className="max-w-xs" />
          </div>
        ) : (
          <div className="relative">
            <DiagramCanvas
              imageUrl={image.url}
              markers={markers}
              isEditing={isEditing}
              onAddMarker={handleAddMarker}
              onUpdateMarker={handleUpdateMarker}
              onSelectMarker={setSelectedMarker}
              onMarkerClick={handleMarkerClick}
              selectedMarkerId={selectedMarker?.id}
            />
            {lastDateRef.current && !isEditing && (
              <ItemDescription>
                {t('last.update')}: {formatDate(lastDateRef.current, 'dd MMMM yyyy MM:hh')}
              </ItemDescription>
            )}
          </div>
        )}
        {renderMarkerEditor}

        {!isEditing && markers.some((m) => m.type === 'maintenance') && <CMMSCharts cmmsData={equipmentStatus} isLoading={isLoading} />}
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-between">
          <div>
            {isEditing && image?.url && (
              <Button variant="destructive" onClick={handleClearImage}>
                <Trash2 className="mr-2 size-4" />
                {t('remove.image')}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              hasPermissionAdd && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 size-4" />
                  {t('edit')}
                </Button>
              )
            ) : (
              <>
                <Button variant="outline" onClick={() => (id ? setIsEditing(false) : navigate({ to: '/telemetry/diagram-list', search: { page: 0 } }))}>
                  <X className="mr-2 size-4" />
                  {t('cancel')}
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !markers.length}>
                  <Save className="mr-2 size-4" />
                  {t('save')}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
