import moment from "moment";
import { DownloadCSV } from "../../../components";
import { calcFactor, getPtax } from "./Utils";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../components/Utils";

export default function DownloadDataCSV(props) {

  const { data, ptaxList, hasPermissionViewFinancial } = props;

  const mountDataCSV = () => {
    return data
    ?.filter(x => x.status !== "operacao")
    ?.map((item, i) => {
      const ptax = hasPermissionViewFinancial ? getPtax(ptaxList, item.startedAt || new Date()) : 0;

      const diffInMinutes =
        item.endedAt && item.startedAt ?
          (new Date(item.endedAt).getTime() -
            new Date(item.startedAt).getTime()) /
          3600000
          : 0;

      const sumOthers = item?.others?.reduce((acc, curr) => {
        return acc + ((curr.valueBRL || 0) + ((curr.valueUSD || 0) * ptax));
      }, 0) || 0;

      const valueInBrl = hasPermissionViewFinancial ? calcFactor(item.contractAsset?.daily?.BRL, item, item.factor || 100) : 0;
      const valueInUsd = hasPermissionViewFinancial ? calcFactor(item.contractAsset?.daily?.USD, item, item.factor || 100) * ptax : 0;
      let valueInPeriodWithFactor = valueInBrl + valueInUsd;

      const operationIsDownTime = item.status === 'downtime' || item.status === 'downtime-parcial';
      const isPartialDowntime = item.status === 'downtime-parcial';
      const consumptionsValue = (item?.consumption?.volume || 0) * (item?.consumption?.price || 0)

      let loss;
      let revenue;
      if (isPartialDowntime) {
        const factor = item.factor || 100;

        const lossInBrl = calcFactor(item.contractAsset?.daily?.BRL, item, factor);
        const lossInUsd = calcFactor(item.contractAsset?.daily?.USD, item, factor) * ptax;
        loss = lossInBrl + lossInUsd;

        const factorPositive = 100 - factor;
        const revenueInBrl = calcFactor(item.contractAsset?.daily?.BRL, item, factorPositive);
        const revenueInUsd = calcFactor(item.contractAsset?.daily?.USD, item, factorPositive) * ptax;
        revenue = revenueInBrl + revenueInUsd;
      }
      else if (operationIsDownTime) {
        loss = valueInPeriodWithFactor;
        valueInPeriodWithFactor = valueInPeriodWithFactor + (sumOthers + consumptionsValue);
      } else {
        revenue = valueInPeriodWithFactor - (sumOthers + consumptionsValue);
      }

      return {
        vessel: item.machine.name,
        status: item.status,
        startAt: item.startedAt ? moment(item.startedAt).format("DD/MM/YYYY HH:mm") : "",
        endAt: item.endedAt ? moment(item.endedAt).format("DD/MM/YYYY HH:mm") : "",
        totalHours: item.status === "downtime-parcial" ? floatToStringExtendDot(diffInMinutes * ((item.factor || 100) / 100), 2) : floatToStringExtendDot(diffInMinutes, 2),
        totalDays: item.status === "downtime-parcial" ? floatToStringExtendDot((diffInMinutes / 24) * ((item.factor || 100) / 100), 3) : floatToStringExtendDot(diffInMinutes / 24, 3),
        consumptionM3: item?.consumption?.price ? floatToStringExtendDot(item?.consumption?.volume, 3) : floatToStringExtendDot(item?.consumption?.consumed || item?.consumption?.volume, 2),
        letter: item?.letter,
        group: item?.group,
        subgroup: item?.subgroup,
        description: item?.description?.replaceAll(";", " "),
        ...(hasPermissionViewFinancial ?
          {
            ptax: ptax ? floatToStringBrazilian(ptax, 4) : 0,
            factor: `${item?.factor ? item?.factor : "100"}%`,
            consumptionBRL: item?.consumption?.price ? floatToStringExtendDot(consumptionsValue * -1, 2) : "",
            othersBRL: item?.others?.length ? floatToStringExtendDot(sumOthers * -1, 2) : "",
            lossBRL: floatToStringExtendDot(loss * -1, 2),
            totalBRL: floatToStringExtendDot(valueInPeriodWithFactor * (operationIsDownTime && !isPartialDowntime ? -1 : 1), 2),
          } : {}),
        filledUser: item.user?.name,
      }
    }) || []
  }


  return <>
    <DownloadCSV
      getData={mountDataCSV}
      appearance="ghost"
      fileName={`operability_${moment().format("YYYYMMMDDHHmmss")}`}
    />
  </>
}
