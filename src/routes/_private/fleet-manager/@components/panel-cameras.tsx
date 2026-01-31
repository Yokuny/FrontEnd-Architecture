import { Camera, Play } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { useMachineCameras } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetCamerasPanel() {
  const { t } = useTranslation();
  const { selectedMachineId } = useFleetManagerStore();
  const { data: cameras, isLoading } = useMachineCameras(selectedMachineId);
  const [activeCamera, setActiveCamera] = useState<number | null>(null);

  if (isLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  const validCameras = cameras?.filter((c: any) => c.name && c.link) || [];

  if (validCameras.length === 0) {
    return (
      <ItemGroup className="flex-1 p-4">
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  const currentCamera = activeCamera !== null ? validCameras[activeCamera] : validCameras[0];

  return (
    <ItemGroup className="space-y-4 p-4">
      {/* Header Info */}
      <ItemContent className="flex items-center gap-2 border-b pb-2">
        <Camera className="size-4 text-primary" />
        <ItemTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('camera')}</ItemTitle>
      </ItemContent>

      <div className="space-y-4">
        {/* Video Player Container */}
        <div className="group relative aspect-video overflow-hidden rounded-xl border border-primary/10 bg-black">
          {currentCamera ? (
            <video key={currentCamera.link} src={currentCamera.link} autoPlay controls className="h-full w-full object-contain">
              {t('no.support.video')}
            </video>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play className="size-12 animate-pulse text-primary/40" />
            </div>
          )}

          {/* Overlay Camera Name */}
          {currentCamera && (
            <div className="absolute top-3 left-3 rounded border border-white/10 bg-black/60 px-2 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
              REC: {currentCamera.name}
            </div>
          )}
        </div>

        {/* Camera Selection Grid */}
        <ItemContent className="grid grid-cols-2 gap-2 rounded-lg border border-primary/5 bg-accent/20 p-2">
          {validCameras.map((camera: any, index: number) => (
            <Button
              key={`${camera.name}-${index}`}
              variant={activeCamera === index || (activeCamera === null && index === 0) ? 'default' : 'secondary'}
              onClick={() => setActiveCamera(index)}
              className="h-10 justify-start gap-2 px-3 font-bold text-[9px] uppercase tracking-tight"
            >
              <Camera className="size-3 shrink-0" />
              <span className="truncate">{camera.name}</span>
            </Button>
          ))}
        </ItemContent>
      </div>
    </ItemGroup>
  );
}
