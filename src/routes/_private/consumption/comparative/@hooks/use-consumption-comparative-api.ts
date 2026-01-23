import { useQuery } from '@tanstack/react-query';
import * as pb from 'protobufjs';
import { api } from '@/lib/api/client';
import type { ConsumptionComparativeData, ConsumptionComparativeFilters, TimeSeriesReading } from '../@interface/consumption-comparative.types';

const PROTO_DEFINITION = `
syntax = "proto3";
package timeseries;

message Source {
  double value = 1;
  string unit = 2;
}

message TimeSeries {
  double timestamp = 1;
  Source consumptionManual = 2;
  Source consumptionTelemetry = 3;
}

message TimeSeriesCollection {
  repeated TimeSeries series = 1;
}
`;

const decodeProto = (buffer: Uint8Array) => {
  try {
    const root = pb.Root.fromJSON(pb.parse(PROTO_DEFINITION).root);
    const TimeSeriesCollection = root.lookupType('timeseries.TimeSeriesCollection');
    const message = TimeSeriesCollection.decode(buffer) as any;
    return message.series || [];
  } catch {
    return [];
  }
};

export function useConsumptionComparative(filters: ConsumptionComparativeFilters) {
  return useQuery({
    queryKey: ['consumption-comparative', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.dateMin) params.append('dateMin', filters.dateMin);
      if (filters.dateMax) params.append('dateMax', filters.dateMax);
      if (filters.unit) params.append('unit', filters.unit);
      if (filters.viewType) params.append('viewType', filters.viewType);
      if (filters.idEnterprise) params.append('idEnterprise', filters.idEnterprise);

      if (filters.machines) {
        filters.machines
          .split(',')
          .filter(Boolean)
          .forEach((id) => {
            params.append('idMachine[]', id);
          });
      }

      const response = await api.get<ConsumptionComparativeData[]>(`/consumption/comparative?${params.toString()}`);
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useConsumptionComparativeDetails(machineId: string, filters: ConsumptionComparativeFilters, enabled = true) {
  return useQuery({
    queryKey: ['consumption-comparative-details', machineId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.dateMin) params.append('dateMin', filters.dateMin);
      if (filters.dateMax) params.append('dateMax', filters.dateMax);
      if (filters.unit) params.append('unit', filters.unit);
      if (filters.viewType) params.append('viewType', filters.viewType);
      if (filters.idEnterprise) params.append('idEnterprise', filters.idEnterprise);

      const response = await api.get<ArrayBuffer>(`/consumption/comparative/${machineId}?${params.toString()}`, {
        responseType: 'arraybuffer',
      });

      return decodeProto(new Uint8Array(response.data)) as TimeSeriesReading[];
    },
    enabled: enabled && !!machineId && !!filters.idEnterprise,
  });
}
