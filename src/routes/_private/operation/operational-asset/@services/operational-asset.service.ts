import { addDays, endOfDay, format, fromUnixTime, parseISO, startOfDay } from 'date-fns';

export interface RawChartData {
  idMachine: string;
  status: string;
  startedAt: Date | null;
  endedAt: Date | null;
  factor: number;
  group: string;
  subgroup: string;
  lossValueBRL: number;
  revenueValueBRL: number;
  ptax: number;
}

export interface DailyDataItem {
  date: number;
  day: string;
  month: string;
  hoursOperation: number;
  hoursDowntime: number;
  hoursPartial: number;
}

export interface StatusDataItem {
  status: string;
  totalHours: number;
  totalGrossHours: number;
  date: number;
  dateString: string;
  month: string;
  competence: string;
  factor?: number | null;
}

export function sumDailyHours(dataNormalized: RawChartData[], dateStartRun: Date, dateEndRun: Date, status: string, isProcessOperationFromPartial = false) {
  return dataNormalized
    .filter((s) => {
      const isStatusMatch = s.status === status;
      if (!isStatusMatch || !s.startedAt) return false;

      const startedAt = s.startedAt.getTime();
      const endedAt = (s.endedAt || new Date()).getTime();
      const runStart = dateStartRun.getTime();
      const runEnd = dateEndRun.getTime();

      return (startedAt <= runStart || startedAt <= runEnd) && (endedAt >= runStart || endedAt >= runEnd);
    })
    .reduce((acc, curr) => {
      if (!curr.startedAt) return acc;

      let dateEnded = curr.endedAt;
      if (!dateEnded) {
        dateEnded = endOfDay(new Date());
      }

      const intersectStart = Math.max(curr.startedAt.getTime(), dateStartRun.getTime());
      const intersectEnd = Math.min(dateEnded.getTime(), dateEndRun.getTime());

      const valueDiff = Math.max(0, (intersectEnd - intersectStart) / (1000 * 60 * 60));
      const hours = valueDiff >= 23.9 ? 24 : valueDiff;

      if (curr.status === 'downtime-parcial' && isProcessOperationFromPartial) {
        return acc + hours * ((curr.factor || 0) / 100);
      }
      return acc + hours;
    }, 0);
}

function getCompetence(date: Date) {
  if (date.getDate() < 26) {
    return format(date, 'yyyy-MM');
  }

  const nextMonth = addDays(date, 7);
  return format(nextMonth, 'yyyy-MM');
}

export function processChartData(dataReturned: any[][], finalDateFilter?: string) {
  const dataNormalized: RawChartData[] = dataReturned?.map((x) => ({
    idMachine: String(x[0]),
    status: String(x[1]),
    startedAt: x[2] ? fromUnixTime(Number(x[2])) : null,
    endedAt: x[3] ? fromUnixTime(Number(x[3])) : null,
    factor: Number(x[4] || 0),
    group: String(x[5] || ''),
    subgroup: String(x[6] || ''),
    lossValueBRL: Number(x[7] || 0),
    revenueValueBRL: Number(x[8] || 0),
    ptax: Number(x[9] || 0),
  }));

  const minDateStart = dataNormalized.find((x) => !!x.startedAt)?.startedAt;
  if (!minDateStart) {
    return {
      dailyList: [],
      statusList: [],
      typesEvents: [],
      totalLoss: 0,
      totalRevenue: 0,
    };
  }

  const dailyList: DailyDataItem[] = [];
  const statusList: StatusDataItem[] = [];

  let dateStartRun = startOfDay(minDateStart);
  let dateEndRun = endOfDay(minDateStart);

  const dateEnd = finalDateFilter ? endOfDay(parseISO(finalDateFilter)) : new Date();

  while (dateEndRun <= dateEnd) {
    const totalHoursOperation = sumDailyHours(dataNormalized, dateStartRun, dateEndRun, 'operacao');
    const totalHoursDowntime = sumDailyHours(dataNormalized, dateStartRun, dateEndRun, 'downtime');
    const totalHoursParadaProgramada = sumDailyHours(dataNormalized, dateStartRun, dateEndRun, 'parada-programada');
    const totalHoursDockage = sumDailyHours(dataNormalized, dateStartRun, dateEndRun, 'dockage');
    const totalHoursDowntimeParcial = sumDailyHours(dataNormalized, dateStartRun, dateEndRun, 'downtime-parcial', true);
    const hoursTotalPartial = sumDailyHours(dataNormalized, dateStartRun, dateEndRun, 'downtime-parcial', false);

    const hoursInOperation = totalHoursOperation + totalHoursParadaProgramada + totalHoursDockage;

    dailyList.push({
      date: dateStartRun.getTime(),
      day: dateStartRun.toISOString(),
      month: format(dateStartRun, 'yyyy-MM'),
      hoursOperation: totalHoursDowntimeParcial ? 24 - totalHoursDowntimeParcial : hoursInOperation,
      hoursDowntime: totalHoursDowntime + totalHoursDowntimeParcial,
      hoursPartial: hoursTotalPartial,
    });

    const commonParams = {
      date: dateStartRun.getTime(),
      dateString: dateStartRun.toISOString(),
      month: format(dateStartRun, 'yyyy-MM'),
      competence: getCompetence(dateStartRun),
    };

    statusList.push({
      status: 'operacao',
      totalHours: totalHoursDowntimeParcial ? 24 - totalHoursDowntimeParcial : totalHoursOperation,
      totalGrossHours: totalHoursOperation,
      ...commonParams,
    });

    statusList.push({
      status: 'downtime',
      totalHours: totalHoursDowntime,
      totalGrossHours: totalHoursDowntime,
      ...commonParams,
    });

    if (totalHoursDowntimeParcial) {
      const dpData = dataNormalized.find(
        (x) =>
          x.status === 'downtime-parcial' &&
          x.startedAt &&
          ((x.startedAt >= dateStartRun && x.startedAt <= dateEndRun) || (x.startedAt <= dateStartRun && (!x.endedAt || x.endedAt >= dateStartRun))),
      );

      statusList.push({
        status: 'downtime-parcial',
        totalHours: totalHoursDowntimeParcial,
        totalGrossHours: hoursTotalPartial,
        factor: dpData?.factor || null,
        ...commonParams,
      });
    }

    if (totalHoursParadaProgramada) {
      statusList.push({
        status: 'parada-programada',
        totalHours: totalHoursParadaProgramada,
        totalGrossHours: totalHoursParadaProgramada,
        ...commonParams,
      });
    }

    if (totalHoursDockage) {
      statusList.push({
        status: 'dockage',
        totalHours: totalHoursDockage,
        totalGrossHours: totalHoursDockage,
        ...commonParams,
      });
    }

    dateStartRun = addDays(dateStartRun, 1);
    dateEndRun = addDays(dateEndRun, 1);
  }

  const typesEvents = dataNormalized.filter((x) => x.status === 'downtime' || x.status === 'downtime-parcial');

  const totalLoss = dataNormalized.filter((x) => x.lossValueBRL).reduce((acc, cur) => acc + cur.lossValueBRL, 0);
  const totalRevenue = dataNormalized.filter((x) => x.revenueValueBRL).reduce((acc, cur) => acc + cur.revenueValueBRL, 0);

  return {
    dailyList,
    statusList,
    typesEvents,
    totalLoss,
    totalRevenue,
  };
}
