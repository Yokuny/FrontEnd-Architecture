import moment from "moment";
import { SkeletonThemed } from "../../../../components/Skeleton";
import { TextSpan } from "../../../../components";
import ItemRVESounding from "./ItemRVESounding";

export default function ListRVESounding(props) {
  const {
    data,
    isLoading,
  } = props;

  if (isLoading) {
    return <>
      <SkeletonThemed height={100} />
      <br />
      <SkeletonThemed height={100} />
      <br />
      <SkeletonThemed height={100} />
      <br />
      <SkeletonThemed height={100} />
    </>
  }

  const generateArrayDateRange = (start, end) => {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  if (!data?.operations?.length) {
    return <TextSpan>Nenhum dado encontrado</TextSpan>
  }

  const operationsSorted = data?.operations?.sort((a, b) => b.dateStart - a.dateStart)

  const minDate = Math.min(...data?.operations?.map((item) => new Date(item.dateStart).getTime()))
  const maxDate = Math.max(...data?.operations?.map((item) => new Date(item.dateEnd).getTime()))

  const dateRange = generateArrayDateRange(new Date(minDate), new Date(maxDate))


  const operationsNormalized = dateRange?.flatMap((itemDateRange) => {
    return data?.assets
      ?.flatMap((asset) => {
        return (operationsSorted?.filter((operation) =>
          operation.idAsset === asset.id &&
          Number(moment(itemDateRange).format("YYYYMMDD")) >= Number(moment(operation.dateStart).format("YYYYMMDD")) &&
          Number(moment(itemDateRange).format("YYYYMMDD")) <= Number(moment(operation.dateEnd).format("YYYYMMDD"))
        ) || []).map((operation) => {
          const dateMin = new Date(itemDateRange)
          dateMin.setHours(0, 0, 0, 0)
          const dateMax = new Date(itemDateRange)
          dateMax.setHours(23, 59, 59, 999)

          const dateStart = operation.dateStart < dateMin ? dateMin : operation.dateStart
          const dateEnd = operation.dateEnd > dateMax ? dateMax : operation.dateEnd

          const diffInHours = Math.abs(dateEnd - dateStart) / 36e5

          if (diffInHours <= 0.1) {
            return null
          }

          return {
            ...operation,
            dateStart,
            dateEnd,
            diffInHours,
            consumption:
              operation.consumptionDailyContract
                ? (operation.consumptionDailyContract / 24) * diffInHours
                : 0,
            date: itemDateRange,
            dateNumber: Number(moment(itemDateRange).format("YYYYMMDD")),
          }
        }).filter((x) => x) || []
      }) || []
  }) || []

  return <>
    {data?.assets?.map((asset, i) =>
      <ItemRVESounding key={i}
        asset={asset}
        data={{
          operations: operationsNormalized?.filter((x) => x.idAsset === asset.id) || [],
          sounding: data?.sounding?.filter((x) => x.idAsset === asset.id) || [],
          rdo: data?.rdo?.filter((x) => x.idAsset === asset.id) || [],
        }}
      />
    )}
  </>
}
