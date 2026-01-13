import type { Marker } from 'leaflet';
import { SendHorizontal } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { MapMarker, MapTooltip } from '@/components/ui/map';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { getNavigationStatusColor, getOperationStatusColor } from '../@hooks/status-utils';
import { useFleetMachines, useFleetPositions } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { useVesselTooltipLayout } from '../@hooks/use-vessel-tooltip-layout';
import type { FleetMachine } from '../@interface/fleet-api';

export function VesselMarkers() {
  const { idEnterprise } = useEnterpriseFilter();
  const {
    showNames,
    showCodes,
    selectedMachineId,
    setSelectedMachineId,
    setSelectedPanel,
    isNavigationIndicator,
    isOperationIndicator,
    statusMachine,
    operationMachines,
    mapTheme,
    nauticalChart,
  } = useFleetManagerStore();

  const { data: machines } = useFleetMachines({ idEnterprise });
  const machineIds = useMemo(() => machines?.map((m) => m.machine.id) || [], [machines]);
  const { data: positionsData } = useFleetPositions(machineIds, idEnterprise);

  const markerRefs = useRef<Map<string, Marker | null>>(new Map());

  const isDarkMap = useMemo(() => {
    const nauticalDark = nauticalChart === 'cmap_dark' || nauticalChart === 'cmap_relief';
    if (nauticalDark) return true;
    if (nauticalChart === 'nav') return false;
    const mapDark = mapTheme === 'smoothdark' || mapTheme === 'earth';
    if (mapDark) return true;
    return false;
  }, [nauticalChart, mapTheme]);

  useVesselTooltipLayout({
    markers: markerRefs.current,
    enabled: showNames || showCodes,
  });

  const vesselMarkers = useMemo(() => {
    const markersMap = new Map<string, { idMachine: string; position: [number, number]; machine: FleetMachine; heading: number }>();

    machines?.forEach((m) => {
      if (m.lastState?.coordinate) {
        markersMap.set(m.machine.id, {
          idMachine: m.machine.id,
          position: m.lastState.coordinate,
          machine: m,
          heading: m.lastState.heading || m.lastState.course || 0,
        });
      }
    });

    positionsData?.positions.forEach((pos) => {
      const machine = machines?.find((m) => m.machine.id === pos.idMachine);
      const course = positionsData.courses?.find((c) => c.idMachine === pos.idMachine);
      if (machine) {
        markersMap.set(pos.idMachine, {
          idMachine: pos.idMachine,
          position: pos.position,
          machine,
          heading: course?.course ?? machine.lastState?.heading ?? machine.lastState?.course ?? 0,
        });
      }
    });

    return Array.from(markersMap.values());
  }, [machines, positionsData]);

  return (
    <>
      {vesselMarkers.map((marker) => {
        const { machine, position, idMachine, heading } = marker;
        const isSelected = selectedMachineId === idMachine;

        let dynamicColor = machine?.modelMachine?.color;
        if (isNavigationIndicator) {
          const status = statusMachine?.find((x) => x.idMachine === idMachine)?.statusNavigation || machine?.lastState?.statusNavigation;
          dynamicColor = getNavigationStatusColor(status) || dynamicColor;
        } else if (isOperationIndicator) {
          const opStatus = operationMachines?.find((o) => o?.machine?.id === idMachine)?.value;
          dynamicColor = getOperationStatusColor(opStatus) || dynamicColor;
        }

        return (
          <MapMarker
            key={idMachine}
            position={position}
            ref={(ref) => {
              if (ref) {
                markerRefs.current.set(idMachine, ref);
              } else {
                markerRefs.current.delete(idMachine);
              }
            }}
            icon={
              <div className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-125 z-50' : ''}`}>
                <div className="p-0.5 transition-transform">
                  <SendHorizontal
                    className="size-6 drop-shadow-md transition-all"
                    fill="currentColor"
                    style={{
                      color: dynamicColor || 'currentColor',
                      transform: `rotate(${heading - 90}deg)`,
                      filter: isSelected ? 'brightness(1.2) drop-shadow(0 0 4px currentColor)' : undefined,
                    }}
                  />
                </div>
              </div>
            }
            eventHandlers={{
              click: () => {
                setSelectedMachineId(idMachine);
                setSelectedPanel('summary');
              },
            }}
          >
            {(showNames || showCodes) && (
              <MapTooltip
                permanent
                direction="top"
                sideOffset={10}
                className={cn('border shadow-sm rounded-sm backdrop-blur-[2px]', isDarkMap ? 'bg-black! text-white!' : 'bg-white! text-black!')}
              >
                <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                  {showNames && <span className="font-semibold">{machine?.machine.name}</span>}
                  {showNames && showCodes && <span className="opacity-50 text-[8px]">|</span>}
                  {showCodes && <span className="font-mono text-[9px]">{machine?.machine.code || machine?.machine.id}</span>}
                </div>
              </MapTooltip>
            )}
          </MapMarker>
        );
      })}
    </>
  );
}
