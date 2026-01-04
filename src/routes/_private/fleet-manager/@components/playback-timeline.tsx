import { format } from 'date-fns';
import { Gauge, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Item, ItemContent } from '@/components/ui/item';
import { Slider } from '@/components/ui/slider';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function PlaybackTimeline() {
  const { playback, togglePlaybackPlay, setPlaybackTime, setPlaybackSpeed, setPlaybackActive } = useFleetManagerStore();
  const { isPlaying, speed, currentTime, startTime, endTime, isActive } = playback;

  if (!isActive || startTime === null || endTime === null) return null;

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlaybackPlay();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaybackActive(false, null);
  };

  const handleSpeedCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cycle speeds: 1x, 5x, 10x, 20x, 50x
    const speeds = [1, 5, 10, 20, 50, 100];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50 pointer-events-auto">
      <Item className="bg-background/80 backdrop-blur-md border-primary/20 shadow-2xl p-4 gap-4 flex items-center">
        <Button variant="default" size="icon" className="shrink-0 size-10 rounded-full shadow-lg" onClick={handleTogglePlay}>
          {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 fill-current" />}
        </Button>

        <ItemContent className="flex flex-col gap-2">
          <Slider value={[currentTime]} min={startTime} max={endTime} step={1000} onValueChange={([val]: number[]) => setPlaybackTime(val)} className="py-2 cursor-pointer" />
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold tabular-nums">{format(new Date(currentTime), 'HH:mm:ss')}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{format(new Date(currentTime), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-bold gap-1.5" onClick={handleSpeedCycle}>
                <Gauge className="size-3" />
                {speed}x
              </Button>
              <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-destructive" onClick={handleClose}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}
