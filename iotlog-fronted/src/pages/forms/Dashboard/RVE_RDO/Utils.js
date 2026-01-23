import moment from "moment";

const generateArrayDateRange = (start, end) => {
  const arr = [];
  const dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

export const getDataOperationsNormalized = (data, filterStartDate, filterEndDate) => {
  const operationsSorted = data?.operations?.sort((a, b) => b.dateStart - a.dateStart)

  const minDate = Math.min(...data?.operations?.map((item) => new Date(item.dateStart).getTime()))
  const maxDate = Math.max(...data?.operations?.map((item) => new Date(item.dateEnd).getTime()))

  const dateRange = generateArrayDateRange(new Date(minDate), new Date(maxDate))

  const dataNormalized = dateRange?.flatMap((itemDateRange) => {

    return data?.assets?.map((asset) => {

      const rdo = data?.rdo?.find((item) =>
        Number(moment(item.date).format("YYYYMMDD"))
        === Number(moment(itemDateRange).format("YYYYMMDD")) &&
        item.idAsset === asset.id
      ) || {}

      return {
        ...rdo,
        idAsset: asset.id,
        date: new Date(itemDateRange),
        operations: (operationsSorted?.filter((operation) =>
          operation.idAsset === asset.id &&
          Number(moment(itemDateRange).format("YYYYMMDD")) >= Number(moment(operation.dateStart).format("YYYYMMDD")) &&
          Number(moment(itemDateRange).format("YYYYMMDD")) <= Number(moment(operation.dateEnd).format("YYYYMMDD"))
        ) || [])
          .map((operation) => {
            const currentDayStart = new Date(itemDateRange)
            currentDayStart.setHours(0, 0, 0, 0)
            const currentDayEnd = new Date(itemDateRange)
            currentDayEnd.setHours(23, 59, 59, 999)

            let dateMin = currentDayStart
            let dateMax = currentDayEnd

            if (filterStartDate || filterEndDate) {
              if (filterStartDate) {
                const filterStart = new Date(filterStartDate)
                dateMin = filterStart > currentDayStart ? filterStart : currentDayStart
              }
              
              if (filterEndDate) {
                const filterEnd = new Date(filterEndDate)
                dateMax = filterEnd < currentDayEnd ? filterEnd : currentDayEnd
              }
            }

            const dateStart = operation.dateStart < dateMin ? dateMin : operation.dateStart
            const dateEnd = operation.dateEnd > dateMax ? dateMax : operation.dateEnd

            if (dateStart >= dateMax || dateEnd <= dateMin) {
              return null
            }

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
            }
          })?.filter((operation) => operation) || []
      }
    }) || []
  }) || []

  return dataNormalized
}
