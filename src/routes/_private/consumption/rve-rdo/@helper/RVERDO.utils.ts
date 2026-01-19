import { format } from 'date-fns';
import type { NormalizedRVERDO, RVERDOData } from '../@interface/rve-rdo.types';

const generateArrayDateRange = (start: Date, end: Date) => {
  const arr: Date[] = [];
  const dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

export const getDataOperationsNormalized = (data: RVERDOData): NormalizedRVERDO[] => {
  if (!data?.operations?.length) return [];

  const operationsSorted = [...data.operations].sort((a, b) => b.dateStart.getTime() - a.dateStart.getTime());

  const minDate = Math.min(...data.operations.map((item) => item.dateStart.getTime()));
  const maxDate = Math.max(...data.operations.map((item) => item.dateEnd.getTime()));

  const dateRange = generateArrayDateRange(new Date(minDate), new Date(maxDate));

  const dataNormalized: NormalizedRVERDO[] = dateRange.flatMap((itemDateRange) => {
    return data.assets.map((asset) => {
      const rdo = data.rdo.find((item) => format(item.date, 'yyyyMMdd') === format(itemDateRange, 'yyyyMMdd') && item.idAsset === asset.id);

      const dayOperations = operationsSorted
        .filter(
          (operation) =>
            operation.idAsset === asset.id &&
            format(itemDateRange, 'yyyyMMdd') >= format(operation.dateStart, 'yyyyMMdd') &&
            format(itemDateRange, 'yyyyMMdd') <= format(operation.dateEnd, 'yyyyMMdd'),
        )
        .map((operation) => {
          const dateMin = new Date(itemDateRange);
          dateMin.setHours(0, 0, 0, 0);
          const dateMax = new Date(itemDateRange);
          dateMax.setHours(23, 59, 59, 999);

          const dateStart = operation.dateStart < dateMin ? dateMin : operation.dateStart;
          const dateEnd = operation.dateEnd > dateMax ? dateMax : operation.dateEnd;

          const diffInHours = Math.abs(dateEnd.getTime() - dateStart.getTime()) / 36e5;

          if (diffInHours <= 0.1) {
            return null;
          }

          return {
            ...operation,
            dateStart,
            dateEnd,
            diffInHours,
            consumption: operation.consumptionDailyContract ? (operation.consumptionDailyContract / 24) * diffInHours : 0,
          };
        })
        .filter((op): op is any => op !== null);

      return {
        idAsset: asset.id,
        date: new Date(itemDateRange),
        consumptionEstimated: rdo?.consumptionEstimated,
        operations: dayOperations,
      };
    });
  });

  return dataNormalized;
};
