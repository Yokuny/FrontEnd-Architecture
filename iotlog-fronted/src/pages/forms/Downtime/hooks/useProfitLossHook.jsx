
import { calcFactor } from "../Utils";

export default function useProfitLossHook({ item, ptax }) {

  if (!item?.contractAsset) {
    return {
      contractAsset: null,
      loss: 0,
      revenue: 0,
      valueInPeriodWithFactor: 0,
      operationIsDownTime: false,
      operationIsRunning: false,
      isPartialDowntime: false,
      consumptionsValue: 0,
      sumOthers: 0
    };
  }

  const valueInBrl = calcFactor(item.contractAsset?.daily?.BRL, item, item.factor || 100);
  const valueInUsd = calcFactor(item.contractAsset?.daily?.USD, item, item.factor || 100) * ptax;
  let valueInPeriodWithFactor = valueInBrl + valueInUsd;

  const sumOthers = item?.others?.reduce((acc, curr) => {
    return acc + ((curr.valueBRL || 0) + ((curr.valueUSD || 0) * ptax));
  }, 0) || 0;

  const consumptionsValue = (item?.consumption?.volume || 0) * (item?.consumption?.price || 0)

  const operationIsDownTime = item.status === 'downtime' || item.status === 'downtime-parcial' || item.status === 'parada-programada';
  const operationIsRunning = item.status === 'operacao';
  const isPartialDowntime = item.status === 'downtime-parcial';

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
    valueInPeriodWithFactor = loss
  }
  else if (operationIsDownTime) {
    loss = valueInPeriodWithFactor;
    valueInPeriodWithFactor = valueInPeriodWithFactor + (sumOthers + consumptionsValue);
  } else {
    revenue = valueInPeriodWithFactor - (sumOthers + consumptionsValue);
  }

  return {
    loss,
    revenue,
    operationIsDownTime,
    operationIsRunning,
    isPartialDowntime,
    consumptionsValue,
    sumOthers,
    valueInPeriodWithFactor,
    contractAsset: item.contractAsset
  }
}


