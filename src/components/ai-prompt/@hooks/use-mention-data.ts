import { Anchor, Gauge, Ship, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFleetsByEnterprise } from '@/hooks/use-fleets-api';
import { useMachinesByEnterprise } from '@/hooks/use-machines-api';
import { usePorts } from '@/hooks/use-ports-api';
import { useSensorsSelect } from '@/hooks/use-sensors-api';
import type { MentionCategory, MentionDataItem } from './use-mention-input';

export const MENTION_CATEGORIES: MentionCategory[] = [
  { type: 'vessel', label: 'Embarcações', icon: Ship },
  { type: 'sensor', label: 'Sensores', icon: Gauge },
  { type: 'port', label: 'Portos', icon: Anchor },
  { type: 'fleet', label: 'Frotas', icon: Users },
];

export function useMentionData() {
  const { idEnterprise } = useEnterpriseFilter();

  const vessels = useMachinesByEnterprise(idEnterprise || undefined);
  const sensors = useSensorsSelect(idEnterprise || undefined);
  const ports = usePorts();
  const fleets = useFleetsByEnterprise(idEnterprise || undefined);

  const dataMap = useMemo(() => {
    const vesselItems: MentionDataItem[] = (vessels.data || []).map((m) => ({
      id: m.id,
      label: m.name,
    }));

    const sensorItems: MentionDataItem[] = (sensors.data || []).map((s) => ({
      id: s.sensorId,
      label: s.sensor,
    }));

    const portItems: MentionDataItem[] = (ports.data || []).map((p) => ({
      id: p.id,
      label: `${p.code} - ${p.description}`,
    }));

    const fleetItems: MentionDataItem[] = (fleets.data || []).map((f) => ({
      id: f.id,
      label: f.description,
    }));

    return {
      vessel: { items: vesselItems, isLoading: vessels.isLoading },
      sensor: { items: sensorItems, isLoading: sensors.isLoading },
      port: { items: portItems, isLoading: ports.isLoading },
      fleet: { items: fleetItems, isLoading: fleets.isLoading },
    };
  }, [vessels.data, vessels.isLoading, sensors.data, sensors.isLoading, ports.data, ports.isLoading, fleets.data, fleets.isLoading]);

  const getItems = (categoryType: string, search: string) => {
    const entry = dataMap[categoryType as keyof typeof dataMap];
    if (!entry) return { items: [], isLoading: false };

    const filtered = search ? entry.items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())) : entry.items;

    return { items: filtered, isLoading: entry.isLoading };
  };

  return { categories: MENTION_CATEGORIES, getItems };
}
