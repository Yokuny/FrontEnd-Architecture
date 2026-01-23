import moment from "moment";
export const getParamsUrlFilter = (filterData) => {
  const queryIdEnterprise = filterData?.idEnterprise
    ? `idEnterprise=${filterData?.idEnterprise}`
    : "";

  const queryModels = filterData?.filteredModel
    ?.map((x, i) => `idModel[]=${x}`)
    ?.join("&");
  const queryMachine = filterData?.filteredMachine
    ?.map((x, i) => `idMachine[]=${x}`)
    ?.join("&");

  const queryDateMin = filterData?.dateMin ? `min=${filterData?.dateMin}` : "";
  const queryDateMax = filterData?.dateMax ? `max=${filterData?.dateMax}` : "";

  return [
    queryIdEnterprise,
    queryModels,
    queryMachine,
    queryDateMax,
    queryDateMin,
  ]
    .filter((x) => !!x)
    .join("&");
};

const convertToTonelada = (value, unit, densityReference) => {
  switch (unit.toLowerCase()) {
    case "l":
      return (value * densityReference) / 1000;
    case "m³":
      return value * densityReference;
    case "t":
      return value;
    default:
      return 0;
  }
};

const convertToLitre = (value, unit, densityReference) => {
  switch (unit.toLowerCase()) {
    case "t":
      return (value * 1000) / densityReference;
    case "m³":
      return value * 1000;
    case "l":
      return value;
    default:
      return 0;
  }
};

const convertToMeterCubic = (value, unit, densityReference) => {
  switch (unit.toLowerCase()) {
    case "l":
      return value * 0.001;
    case "t":
      return value / densityReference;
    case "m³":
      return value;
    default:
      return 0;
  }
};

export const normalizedUnitValue = ({
  value,
  unitValue,
  unitToDefault,
  densityReference,
}) => {
  try {
    switch (unitToDefault.toLowerCase()) {
      case "l":
        return convertToLitre(value, unitValue, densityReference);
      case "m³":
        return convertToMeterCubic(value, unitValue, densityReference);
      case "t":
        return convertToTonelada(value, unitValue, densityReference);
      default:
        return 0;
    }
  } catch {
    return 0;
  }
};

export const convertPeriodToDate = (periodInFilter) => {
  return periodInFilter !== "1m"
    ? `${moment()
        .subtract(parseInt(periodInFilter?.replace("m", "")), "months")
        .format("MMM YY")} - ${moment().format("MMM YY")}`
    : moment().format("MMM YY");
};
