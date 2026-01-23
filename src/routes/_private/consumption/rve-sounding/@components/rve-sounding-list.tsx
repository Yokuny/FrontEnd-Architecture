import { eachDayOfInterval, endOfDay, isWithinInterval, max as maxDateFunc, min as minDateFunc, startOfDay } from 'date-fns';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import type { NormalizedData, Operation } from '../@interface/rve-sounding.types';
import { RVESoundingItem } from './rve-sounding-item';

interface RVESoundingListProps {
  data?: NormalizedData;
  isLoading: boolean;
}

export function RVESoundingList({ data, isLoading }: RVESoundingListProps) {
  if (isLoading) {
    return <DefaultLoading />;
  }

  if (!data?.operations?.length || !data?.assets?.length) {
    return <DefaultEmptyData />;
  }

  // Normalization logic from legacy ListRVESounding.jsx
  const operationsSorted = [...data.operations].sort((a, b) => b.dateStart.getTime() - a.dateStart.getTime());

  const minDate = minDateFunc(data.operations.map((op) => op.dateStart));
  const maxDate = maxDateFunc(data.operations.map((op) => op.dateEnd));

  const dateRange = eachDayOfInterval({ start: startOfDay(minDate), end: endOfDay(maxDate) });

  const operationsNormalized = dateRange.flatMap((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    return data.assets.flatMap((asset) => {
      return operationsSorted
        .filter(
          (op) =>
            op.idAsset === asset.id &&
            (isWithinInterval(op.dateStart, { start: dayStart, end: dayEnd }) ||
              isWithinInterval(op.dateEnd, { start: dayStart, end: dayEnd }) ||
              (op.dateStart < dayStart && op.dateEnd > dayEnd)),
        )
        .map((op) => {
          const clampedStart = op.dateStart < dayStart ? dayStart : op.dateStart;
          const clampedEnd = op.dateEnd > dayEnd ? dayEnd : op.dateEnd;

          const diffInHours = (clampedEnd.getTime() - clampedStart.getTime()) / 36e5;

          if (diffInHours <= 0.1) return null;

          return {
            ...op,
            dateStart: clampedStart,
            dateEnd: clampedEnd,
            diffInHours,
            consumption: op.consumptionDailyContract ? (op.consumptionDailyContract / 24) * diffInHours : 0,
            date: day,
          };
        })
        .filter((op): op is Operation & { diffInHours: number; date: Date; consumption: number } => op !== null);
    });
  });

  return (
    <div className="space-y-6">
      {data.assets.map((asset) => (
        <RVESoundingItem
          key={asset.id}
          asset={asset}
          data={{
            operations: operationsNormalized.filter((op) => op?.idAsset === asset.id) as any,
            sounding: data.sounding.filter((s) => s.idAsset === asset.id),
            rdo: data.rdo.filter((r) => r.idAsset === asset.id),
          }}
        />
      ))}
    </div>
  );
}
