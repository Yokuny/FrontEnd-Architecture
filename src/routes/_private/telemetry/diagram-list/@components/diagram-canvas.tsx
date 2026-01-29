import type Konva from 'konva';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, Group, Image as KonvaImage, Layer, Rect, Stage, Text } from 'react-konva';
import type { DiagramMarker } from '../@interface/diagram-details.types';

interface DiagramCanvasProps {
  imageUrl: string;
  markers: DiagramMarker[];
  isEditing: boolean;
  onAddMarker: (marker: DiagramMarker) => void;
  onUpdateMarker: (marker: DiagramMarker) => void;
  onSelectMarker: (marker: DiagramMarker | null) => void;
  onMarkerClick?: (marker: DiagramMarker) => void;
  selectedMarkerId?: string | null;
}

export function DiagramCanvas({ imageUrl, markers, isEditing, onAddMarker, onUpdateMarker, onSelectMarker, onMarkerClick, selectedMarkerId }: DiagramCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const updateStageSize = useCallback((img: HTMLImageElement) => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const aspectRatio = img.height / img.width;
    const height = containerWidth * aspectRatio;
    setStageSize({ width: containerWidth, height: Math.min(height, 700) });
  }, []);

  // Load image
  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      updateStageSize(img);
    };
  }, [imageUrl, updateStageSize]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (image) updateStageSize(image);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image, updateStageSize]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isEditing) return;

    const stage = e.target.getStage();
    if (!stage || e.target !== stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const xPercent = (pos.x / stageSize.width) * 100;
    const yPercent = (pos.y / stageSize.height) * 100;

    onAddMarker({
      id: crypto.randomUUID().slice(0, 8),
      left: xPercent,
      top: yPercent,
      type: 'on-off',
    });
  };

  const getMarkerColor = (marker: DiagramMarker): string => {
    if (marker.type === 'maintenance') {
      return marker.state === 'danger' ? '#ef4444' : marker.state === 'warning' ? '#f59e0b' : '#22c55e';
    }
    if (marker.type === 'on-off') {
      return marker.state ? '#22c55e' : '#6b7280';
    }
    return '#3b82f6';
  };

  const handleDragEnd = (marker: DiagramMarker, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const xPercent = (node.x() / stageSize.width) * 100;
    const yPercent = (node.y() / stageSize.height) * 100;
    onUpdateMarker({ ...marker, left: xPercent, top: yPercent });
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-md border">
      <Stage width={stageSize.width} height={stageSize.height} onClick={handleStageClick}>
        <Layer>{image && <KonvaImage image={image} width={stageSize.width} height={stageSize.height} />}</Layer>
        <Layer>
          {markers.map((marker) => {
            const x = (marker.left / 100) * stageSize.width;
            const y = (marker.top / 100) * stageSize.height;
            const isSelected = selectedMarkerId === marker.id;
            const color = getMarkerColor(marker);

            return (
              <Group
                key={marker.id}
                x={x}
                y={y}
                draggable={isEditing}
                onDragEnd={(e) => handleDragEnd(marker, e)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  if (isEditing) {
                    onSelectMarker(marker);
                  } else {
                    onMarkerClick?.(marker);
                  }
                }}
              >
                {marker.type === 'label' ? (
                  <>
                    <Rect
                      offsetX={5}
                      offsetY={10}
                      width={Math.max(80, (marker.description?.length || 5) * 7 + 40)}
                      height={24}
                      fill="white"
                      cornerRadius={4}
                      stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                      strokeWidth={isSelected ? 2 : 1}
                      shadowColor="black"
                      shadowBlur={4}
                      shadowOpacity={0.2}
                    />
                    <Text text={`${marker.description || ''}: ${marker.state ?? '-'} ${marker.unit || ''}`} fontSize={11} fill="#374151" offsetY={5} />
                  </>
                ) : (
                  <>
                    <Circle
                      radius={isSelected ? 14 : 12}
                      fill={color}
                      stroke={isSelected ? '#1d4ed8' : 'white'}
                      strokeWidth={2}
                      shadowColor="black"
                      shadowBlur={4}
                      shadowOpacity={0.3}
                    />
                    {marker.description && (
                      <>
                        <Rect x={10} y={-8} width={Math.max(50, (marker.description?.length || 3) * 6 + 10)} height={16} fill="white" cornerRadius={3} opacity={0.9} />
                        <Text x={14} y={-5} text={marker.description} fontSize={10} fill="#374151" />
                      </>
                    )}
                  </>
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
