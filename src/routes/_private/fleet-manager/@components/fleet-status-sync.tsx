import { useEffect } from 'react';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetStatus } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetStatusSync() {
  const { idEnterprise } = useEnterpriseFilter();
  const { setStatusMachine, setOperationMachines, isNavigationIndicator, isOperationIndicator } = useFleetManagerStore();

  const { data: navData } = useFleetStatus({ type: 'navigation', idEnterprise, enabled: isNavigationIndicator });
  const { data: opData } = useFleetStatus({ type: 'operation', idEnterprise, enabled: isOperationIndicator });

  useEffect(() => {
    if (navData) {
      setStatusMachine(navData);
    }
  }, [navData, setStatusMachine]);

  useEffect(() => {
    if (opData) {
      setOperationMachines(opData);
    }
  }, [opData, setOperationMachines]);

  return null;
}
