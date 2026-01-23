
export const getEstimatedAndReal = (item) => {
  const dataToReturn = {
    // estimatedVoyage: 0,
    // realVoyage: 0,
    // estimatedPort: 0,
    // realPort: 0,
    estimatedTotal: 0,
    realTotal: 0
  }

  if (item?.itinerary?.length <= 1) {
    return null
  }

  const firstVoyage = item?.itinerary[0];
  const lastVoyage = item?.itinerary[item?.itinerary.length - 1];

  if (!firstVoyage || !lastVoyage) {
    return null
  }

  if (firstVoyage.ets && lastVoyage.ets) {
    dataToReturn.estimatedTotal = Math.abs(new Date(lastVoyage.ets) - new Date(firstVoyage.ets)) / 864e5;
  }
  if (firstVoyage.ats && lastVoyage.ats) {
    dataToReturn.realTotal = Math.abs(new Date(lastVoyage.ats) - new Date(firstVoyage.ats)) / 864e5;
  }

  return dataToReturn
}

export const takeCareResponse = (dataList) => {
  return dataList.map(x => ({
    ...x,
    calculated: getEstimatedAndReal(x)
  }))
}
