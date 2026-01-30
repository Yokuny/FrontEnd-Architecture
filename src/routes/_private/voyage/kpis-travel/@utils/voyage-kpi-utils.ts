export interface KpiData {
  estimatedTotal: number;
  realTotal: number;
}

export const getEstimatedAndReal = (item: any): KpiData | null => {
  if (!item?.itinerary || item.itinerary.length <= 1) {
    return null;
  }

  const firstVoyage = item.itinerary[0];
  const lastVoyage = item.itinerary[item.itinerary.length - 1];

  if (!firstVoyage || !lastVoyage) {
    return null;
  }

  const dataToReturn: KpiData = {
    estimatedTotal: 0,
    realTotal: 0,
  };

  if (firstVoyage.ets && lastVoyage.ets) {
    dataToReturn.estimatedTotal = Math.abs(new Date(lastVoyage.ets).getTime() - new Date(firstVoyage.ets).getTime()) / 864e5;
  }
  if (firstVoyage.ats && lastVoyage.ats) {
    dataToReturn.realTotal = Math.abs(new Date(lastVoyage.ats).getTime() - new Date(firstVoyage.ats).getTime()) / 864e5;
  }

  return dataToReturn;
};

export const takeCareResponse = (dataList: any[]) => {
  return dataList.map((x) => ({
    ...x,
    calculated: getEstimatedAndReal(x),
  }));
};
