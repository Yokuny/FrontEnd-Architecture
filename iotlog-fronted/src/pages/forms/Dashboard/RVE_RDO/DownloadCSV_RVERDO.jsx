import moment from "moment";
import { DownloadCSV } from "../../../../components";
import { getDataOperationsNormalized } from "./Utils";

export default function DownloadCSV_RVERDO({
  data
}) {

  const getData = () => {
    const dataNormalized = getDataOperationsNormalized(data)
    const assets = data?.assets
    return dataNormalized
    ?.sort((a, b) => b.date - a.date)
    ?.flatMap((item, index) => {
      const maxInThisDay = item
      .operations
      .reduce((acc, operation) => acc +
        (operation?.consumptionDailyContract
          ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
          : 0),
        0)

      return item
      ?.operations
      ?.map((operation, indexOp) => ({
        vessel: indexOp === 0 ? assets?.find(x => x.id === item.idAsset)?.name : "",
        date: indexOp === 0 ? moment(item.date).format("YYYY-MM-DD") : "",
        consumptionEstimated: indexOp === 0 ? item.consumptionEstimated !== undefined ? item.consumptionEstimated.toFixed(2).replace('.',',') : "Não informado" : "",
        consumptionMaxDay: indexOp === 0 ? maxInThisDay.toFixed(2).replace('.',',') : "",
        diff: indexOp === 0 && !isNaN(maxInThisDay) && !isNaN(item.consumptionEstimated) ? (item.consumptionEstimated - maxInThisDay).toFixed(2).replace('.',',') : "",
        operation: operation.code,
        start: moment(operation.dateStart).format("HH:mm"),
        end: moment(operation.dateEnd).format("HH:mm"),
        duration: operation.diffInHours.toFixed(2).replace('.',','),
        consumptionMaxOperation: operation?.consumptionDailyContract
          ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours).toFixed(2).replace('.',',')
          : 0,
      }))
    })
  }

  return (
    <DownloadCSV
      appearance="ghost"
      status="Basic"
      getData={getData}
      fileName={`rve_rdo_${moment().format("YYYYMMMDDHHmmss")}`}
    />)
}
