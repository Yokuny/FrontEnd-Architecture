import moment from "moment";
import chroma from 'chroma-js';

export function sumDailyHours(dataNormalized, dateStartRun, dateEndRun, status, isProcessOperationFromPartial = false) {
  return dataNormalized.filter(
    (s) => (
      s.status === status &&
      s.startedAt &&
      (
        s.startedAt.getTime() <= dateStartRun.getTime() ||
        s.startedAt.getTime() <= dateEndRun.getTime())
    )
      &&
      (
        (s.endedAt || new Date()).getTime() >= dateStartRun.getTime() ||
        (s.endedAt || new Date()).getTime() >= dateEndRun.getTime()
      )
  )
    .reduce((acc, curr) => {
      let dateEnded = curr.endedAt;
      if (!dateEnded) {
        dateEnded = moment(
          `${moment().format("YYYY-MM-DD")}T23:59:59.999`
        ).toDate();
      }

      const valueDiff = ((dateEnded > dateEndRun ? dateEndRun : dateEnded) -
        (curr.startedAt < dateStartRun ? dateStartRun : curr.startedAt)) /
        1000 /
        60 /
        60;
      return acc + (
        curr.status === "downtime-parcial" && isProcessOperationFromPartial
          ? ((valueDiff >= 23.9 ? 24 : valueDiff) * (curr.factor / 100))
          : (valueDiff >= 23.9 ? 24 : valueDiff)
      );
    }, 0);
}

function getCompetence(dateStartRun) {
  if (dateStartRun.getDate() < 26)
    return dateStartRun.toISOString().slice(0, 7);

  const dateMonth = moment(dateStartRun);
  const year = dateMonth.format("YYYY");
  let month = (Number(dateMonth.format("MM")) + 1);
  if (month > 12) {
    month = 1;
    year++;
  }

  return `${year}-${month.toString().padStart(2, '0')}`;

}

export function brokenByDay(dataReturned, finalDateFilter) {
  const dataNormalized = dataReturned?.map(x => ({
    idMachine: x[0],
    status: x[1],
    startedAt: x[2] ? new Date(x[2] * 1000) : null,
    endedAt: x[3] ? new Date(x[3] * 1000) : null,
    factor: x[4],
    group: x[5],
    subgroup: x[6],
    lossValueBRL: x[7],
    revenueValueBRL: x[8]
  }))

  const minDateStartInStatus = dataNormalized.find(x => !!x.startedAt)?.startedAt;

  let dailyList = [];
  let statusList = [];

  const dateToApplyStart = moment(minDateStartInStatus).format("YYYY-MM-DD");

  const dateStartRun = moment(
    `${dateToApplyStart}T00:00:00.000`
  ).toDate();
  const dateEndRun = moment(
    `${dateToApplyStart}T23:59:59.999`
  ).toDate();

  const dateEnd = finalDateFilter
    ? moment(
      `${finalDateFilter}T23:59:59.999`
    ).toDate()
    : new Date();

  while (dateEndRun <= dateEnd) {

    try {

      let totalHoursOperation = sumDailyHours(
        dataNormalized,
        dateStartRun,
        dateEndRun,
        "operacao");
      let totalHoursDonwtime = sumDailyHours(
        dataNormalized,
        dateStartRun,
        dateEndRun,
        "downtime");

      let totalHoursParadaProgramada = sumDailyHours(
        dataNormalized,
        dateStartRun,
        dateEndRun,
        "parada-programada");

      let totalHoursDockage = sumDailyHours(
        dataNormalized,
        dateStartRun,
        dateEndRun,
        "dockage");

      let totalHoursDonwtimeParcial = sumDailyHours(
        dataNormalized,
        dateStartRun,
        dateEndRun,
        "downtime-parcial",
        true
      );

      let hoursTotalPartial = sumDailyHours(
        dataNormalized,
        dateStartRun,
        dateEndRun,
        "downtime-parcial",
        false
      );

      const hoursInOperation = totalHoursOperation + totalHoursParadaProgramada + totalHoursDockage;
      dailyList.push({
        date: dateStartRun.getTime(),
        day: dateStartRun.toISOString(),
        month: moment(dateStartRun).format("YYYY-MM"),
        hoursOperation: totalHoursDonwtimeParcial
          ? 24 - totalHoursDonwtimeParcial
          : hoursInOperation,
        hoursDowntime: totalHoursDonwtime + totalHoursDonwtimeParcial,
        hoursPartial: hoursTotalPartial
      });
      statusList.push(...[
        {
          status: "operacao",
          totalHours:
            totalHoursDonwtimeParcial
              ? 24 - totalHoursDonwtimeParcial
              : totalHoursOperation,
          totalGrossHours: totalHoursOperation,
          date: dateStartRun.getTime(),
          dateString: dateStartRun.toISOString(),
          month: moment(dateStartRun).format("YYYY-MM"),
          competence: getCompetence(dateStartRun)
        },
        {
          status: "downtime",
          totalHours: totalHoursDonwtime,
          totalGrossHours: totalHoursDonwtime,
          date: dateStartRun.getTime(),
          dateString: dateStartRun.toISOString(),
          month: moment(dateStartRun).format("YYYY-MM"),
          competence: getCompetence(dateStartRun)
        },
      ]);

      if (totalHoursDonwtimeParcial) {
        // Get the factor from the filtered data for this day
        const downtimeParcialData = dataNormalized.find(
          x => x.status === "downtime-parcial" &&
            x.startedAt &&
            ((x.startedAt.getTime() >= dateStartRun.getTime() && x.startedAt.getTime() <= dateEndRun.getTime()) ||
              (x.startedAt.getTime() <= dateStartRun.getTime() && (!x.endedAt || x.endedAt.getTime() >= dateStartRun.getTime())))
        );

        statusList.push({
          status: "downtime-parcial",
          totalHours: totalHoursDonwtimeParcial,
          totalGrossHours: hoursTotalPartial,
          date: dateStartRun.getTime(),
          dateString: dateStartRun.toISOString(),
          month: moment(dateStartRun).format("YYYY-MM"),
          competence: getCompetence(dateStartRun),
          factor: downtimeParcialData?.factor || null
        });
      }

      if (totalHoursParadaProgramada) {
        statusList.push({
          status: "parada-programada",
          totalHours: totalHoursParadaProgramada,
          totalGrossHours: totalHoursParadaProgramada,
          date: dateStartRun.getTime(),
          dateString: dateStartRun.toISOString(),
          month: moment(dateStartRun).format("YYYY-MM"),
          competence: getCompetence(dateStartRun)
        });
      }

      if (totalHoursDockage) {
        statusList.push({
          status: "dockage",
          totalHours: totalHoursDockage,
          totalGrossHours: totalHoursDockage,
          date: dateStartRun.getTime(),
          dateString: dateStartRun.toISOString(),
          month: moment(dateStartRun).format("YYYY-MM"),
          competence: getCompetence(dateStartRun)
        });
      }
    }
    catch (error) {
    }
    dateStartRun.setDate(dateStartRun.getDate() + 1);
    dateEndRun.setDate(dateEndRun.getDate() + 1);
  }

  let typesEvents = [];
  dataNormalized
    ?.filter(x => x.status === "downtime" || x.status === "downtime-parcial")
    ?.forEach(x => {
      const lastEvent = typesEvents[typesEvents.length - 1];
      if (!lastEvent || !(
        lastEvent.status === x.status &&
        lastEvent.group === x.group &&
        lastEvent.subgroup === x.subgroup &&
        lastEvent.endedAt === x.startedAt
      )) {
        typesEvents.push(x);
      }
    });

  let totalLoss = dataNormalized.filter(x => x.lossValueBRL).reduce((acc, cur) => acc + cur.lossValueBRL, 0)
  const totalRevenue = dataNormalized.filter(x => x.revenueValueBRL).reduce((acc, cur) => acc + cur.revenueValueBRL, 0)

  return {
    dailyList,
    statusList,
    typesEvents,
    totalLoss,
    totalRevenue
  };
}

export function getColorByIndex(index, totalColors) {
  const palette = chroma.scale(['#DB2E33', '#600687', '#db0d86', '#FCBB9F'])
    .colors(totalColors);

  return palette[index % totalColors];
}
