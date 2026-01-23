import { useMemo, useState } from 'react';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import type { AIAsset } from '../@interface/anomaly-detector.types';
import { useAIAssets, useAIClassify, useAILastStates } from './use-anomaly-detector-api';

const FABRIC_ENTERPRISE_ID = '02bad20d-039e-4abf-8aeb-5308c41ffee4';

export function useAnomalyDetector() {
  const { idEnterprise } = useEnterpriseFilter();
  const isFabric = idEnterprise === FABRIC_ENTERPRISE_ID;

  const [anomalyData, setAnomalyData] = useState<AIAsset[]>([]);

  const { data: rawAssets, isLoading } = useAIAssets(idEnterprise);
  const classifyMutation = useAIClassify();

  const machineIds = useMemo(() => rawAssets?.map((a) => a.asset.id).join(','), [rawAssets]);
  const { data: lastStates } = useAILastStates(machineIds, idEnterprise);

  const normalizedData = useMemo(() => {
    if (!rawAssets) return [];

    return rawAssets
      .map((x) => {
        let operation = x.operation;
        let is_anomaly = x.is_anomaly;

        if (isFabric && lastStates) {
          const stateItems = lastStates.filter((s) => s.idMachine === x.asset.id);
          const opState = stateItems.find((s) => s.idSensor === 'operation');
          const anomalyState = stateItems.find((s) => s.idSensor === 'is_anomaly');
          if (opState) operation = opState.value;
          if (anomalyState) is_anomaly = anomalyState.value;
        }

        const updatedItem = anomalyData.find((a) => a.asset.id === x.asset.id);
        if (updatedItem) {
          operation = updatedItem.operation;
          is_anomaly = updatedItem.is_anomaly;
        }

        const status: AIAsset['status'] = is_anomaly !== undefined ? (is_anomaly ? 'anomaly' : 'ok') : 'off';

        return {
          ...x,
          operation,
          is_anomaly,
          status,
          order: operation && operation !== '-' ? 1 : 0,
        };
      })
      .sort((a, b) => b.order - a.order);
  }, [rawAssets, isFabric, lastStates, anomalyData]);

  const handleClassify = async (data: any) => {
    if (!idEnterprise) return;
    try {
      const response = await classifyMutation.mutateAsync({
        idEnterprise,
        idMachine: '710006717',
        data: [data],
      });

      if (Array.isArray(response) && response.length > 0) {
        const result = response[0] as AIAsset;
        setAnomalyData((prev) => {
          const index = prev.findIndex((a) => a.asset.name === 'WS CASTOR');
          const newItem: AIAsset = {
            ...result,
            asset: { ...result.asset, id: 'csv-mock', name: 'WS CASTOR' },
            status: result.is_anomaly ? 'anomaly' : 'ok',
            order: 1,
          };

          if (index >= 0) {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...result };
            return updated;
          }
          return [...prev, newItem];
        });
      }
    } catch {
      // Catch silently
    }
  };

  return {
    normalizedData,
    isLoading,
    isFabric,
    idEnterprise,
    handleClassify,
  };
}
