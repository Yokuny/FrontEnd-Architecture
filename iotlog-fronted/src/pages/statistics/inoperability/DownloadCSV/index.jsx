import moment from "moment";
import { DownloadCSV } from "../../../../components";

export default function DownloadPerformanceCSV(props) {

  const { data, hasPermissionViewFinancial } = props;

  const mountDataCSV = () => {
    return data
      ?.map(x => ({
        status: x[1],
        date_start: moment(new Date(x[2] * 1000)).format("YYYY-MM-DD"),
        hour_start: moment(new Date(x[2] * 1000)).format("HH:mm"),
        date_end: moment(new Date(x[3] * 1000)).format("YYYY-MM-DD"),
        hour_end: moment(new Date(x[3] * 1000)).format("HH:mm"),
        duration_in_days: ((new Date(x[3] * 1000).getTime() - new Date(x[2] * 1000).getTime()) / (1000 * 60 * 60 * 24)).toFixed(2),
        ...(hasPermissionViewFinancial
          ? {
            profit: (x[8] || 0).toFixed(2),
            loss: (x[7] || 0).toFixed(2),
            ptax: (x[9] || 0),
          }
          : {})
      }))
  }


  return <>
    <DownloadCSV
      getData={mountDataCSV}
      appearance="ghost"
      fileName={`operability_performance_${moment().format("YYYYMMMDDHHmmss")}`}
    />
  </>
}
