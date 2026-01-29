import { differenceInHours } from 'date-fns';
import type { HeatmapFleetItem, HeatmapStats, SubgroupData } from '../@interface/heatmap.types';

export const isAssetOnline = (lastUpdate?: string): boolean => {
  if (!lastUpdate) return false;
  const hoursSinceUpdate = differenceInHours(new Date(), new Date(lastUpdate));
  return hoursSinceUpdate < 24;
};

export const calculateHeatmapStats = (data: HeatmapFleetItem[]): HeatmapStats => {
  if (!data || data.length === 0) {
    return {
      onlineAssets: 0,
      offlineAssets: 0,
      itemsOk: 0,
      itemsInProgress: 0,
      itemsInAlert: 0,
    };
  }

  let onlineAssets = 0;
  let offlineAssets = 0;
  let itemsOk = 0;
  let itemsInProgress = 0;
  let itemsInAlert = 0;

  data.forEach((fleet) => {
    // Check if asset is online (connected in last 24 hours)
    if (isAssetOnline(fleet.lastUpdate)) {
      onlineAssets++;
    } else {
      offlineAssets++;
    }

    // Count items by status
    fleet.equipments.forEach((equipment) => {
      equipment.subgroups.forEach((subg) => {
        if (!subg.idSensorOnOff) return;

        if (subg.isOn) {
          if (subg.isDanger) {
            itemsInAlert++;
          } else if (subg.isWarning) {
            itemsInProgress++;
          } else {
            itemsOk++;
          }
        }
      });
    });
  });

  return {
    onlineAssets,
    offlineAssets,
    itemsOk,
    itemsInProgress,
    itemsInAlert,
  };
};

export type SubgroupStatus = 'success' | 'warning' | 'danger' | 'basic';

export const getSubgroupStatus = (subgroup: SubgroupData, fleetLastUpdate?: string): SubgroupStatus => {
  if (!subgroup.idSensorOnOff) return 'basic';

  if (subgroup.isDanger) return 'danger';
  if (subgroup.isWarning) return 'warning';
  if (fleetLastUpdate && !isAssetOnline(fleetLastUpdate)) return 'basic';

  return 'success';
};
