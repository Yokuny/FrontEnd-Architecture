import { SendHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { MapMarker } from '@/components/ui/map';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { getNavigationStatusColor, getOperationStatusColor } from '../@hooks/status-utils';
import { useFleetMachines, useFleetPositions } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import type { FleetMachine } from '../@interface/fleet-api';

export function VesselMarkers() {
  const { idEnterprise } = useEnterpriseFilter();
  const { showNames, showCodes, selectedMachineId, setSelectedMachineId, setSelectedPanel, isNavigationIndicator, isOperationIndicator, statusMachine, operationMachines } =
    useFleetManagerStore();

  const { data: machines } = useFleetMachines({ idEnterprise });
  const machineIds = useMemo(() => machines?.map((m) => m.machine.id) || [], [machines]);
  const { data: positionsData } = useFleetPositions(machineIds, idEnterprise);

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
            icon={
              <div className={`flex flex-col items-center transition-transform ${isSelected ? 'scale-125 z-50' : ''}`}>
                {/* TODO: Espalhar o nome com linhas guias demonstrando o nome e o código */}
                {(showNames || showCodes) && (
                  <div className="bg-background/80 p-0.5 px-1 border text-[10px] font-medium shadow-sm whitespace-nowrap">
                    {showNames && machine?.machine.name}
                    <span className="text-foreground font-light">
                      {showNames && showCodes && ' - '}
                      {showCodes && (machine?.machine.code || machine?.machine.id)}
                    </span>
                  </div>
                )}
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
          />
        );
      })}
    </>
  );
}
