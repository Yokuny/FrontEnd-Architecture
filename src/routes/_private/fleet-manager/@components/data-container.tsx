import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Panel } from './panel';
import { PlaybackTimeline } from './playback-timeline';

export function DataContainer({ idEnterprise }: DataContainerProps) {
  const isMobile = useIsMobile();

  return (
    <div className={cn('pointer-events-none z-1000', isMobile ? 'absolute inset-0 flex flex-col p-2 gap-2' : 'absolute inset-0 ml-13')}>
      <div className={cn('pointer-events-none', isMobile ? 'flex-1 min-h-0' : 'absolute top-4 bottom-4 left-4 w-96')}>
        <Panel idEnterprise={idEnterprise} />
      </div>

      <PlaybackTimeline />
    </div>
  );
}

interface DataContainerProps {
  idEnterprise?: string;
}
