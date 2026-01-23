import moment from 'moment';

export function normalizeRVEDataByMonth(dataReturned, finalDateFilter) {
  // Verifica se há dados
  if (!Array.isArray(dataReturned) || dataReturned.length === 0) {
    return { monthlyData: [] };
  }

  const getContractPeriodBoundaries = (date, contract) => {
    if (contract?.competence === 'dayInMonth') {
      const day = contract.day;
      const currentDay = date.date();

      if (currentDay >= day) {
        return {
          start: moment(date).date(day).startOf('day'),
          end: moment(date).add(1, 'month').date(day - 1).endOf('day')
        };
      }
    }
    return {
      start: moment(date).startOf('month'),
      end: moment(date).endOf('month')
    };
  };

  // Função para agrupar eventos por período contratual
  const groupEventsByContractPeriod = (events) => {
    const periods = new Map();

    events.forEach(event => {
      const eventStart = moment(event.data.dataHoraInicio);
      const boundaries = getContractPeriodBoundaries(eventStart, {
        competence: 'dayInMonth',
        day: 26
      });

      // Chave única para o período (usando o início do período e o dia do contrato)
      const periodKey = `${boundaries.start.format('YYYY-MM-DD')}`;

      if (!periods.has(periodKey)) {
        periods.set(periodKey, {
          periodStart: boundaries.start,
          periodEnd: boundaries.end,
          contract: event.contract,
          events: []
        });
      }

      periods.get(periodKey).events.push(event);
    });
    return Array.from(periods.values());
  };

  const contractPeriods = groupEventsByContractPeriod(dataReturned);
  let monthlyData = [];

  contractPeriods.forEach(period => {
    const periodStart = period.periodStart;
    const periodEnd = period.periodEnd;
    const periodEvents = period.events;
    // Agrupa eventos por código operacional
    const eventsByCode = periodEvents
      .reduce((acc, event) => {
        const code = event.data.codigoOperacional.value.substring(0, 2); // Pega apenas o prefixo (AM, IN, OM)
        if (!acc[code]) {
          acc[code] = {
            totalHours: 0,
            events: []
          };
        }

        const diffInHours = (new Date(event.data.dataHoraFim).getTime() - new Date(event.data.dataHoraInicio).getTime()) / (1000 * 60 * 60);

        acc[code].totalHours += diffInHours;
        acc[code].events.push({
          ...event,
          hoursInPeriod: diffInHours
        });

        return acc;
      }, {});

    // Calcula total de horas no mês
    const totalHoursInPeriod = periodEnd.diff(periodStart, 'hours') + 1;

    // Prepara os dados do mês
    const periodData = {
      month: periodStart.format('YYYY-MM'),
      contract: period.contract,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      monthLabel: periodStart.locale('en').format('MMMM').toLowerCase(),
      totalHours: Object.values(eventsByCode).reduce((sum, data) => sum + data.totalHours, 0),
      codeGroups: Object.entries(eventsByCode).map(([code, data]) => ({
        code,
        totalHours: data.totalHours,
        percentage: ((data.totalHours / totalHoursInPeriod) * 10000) / 100,
        eventsCount: data.events.length,
        events: data.events
      })),
      totalEvents: periodEvents.length,
      events: periodEvents
        .sort((a, b) => new Date(a.data.dataHoraInicio) - new Date(b.data.dataHoraInicio))
    };

    monthlyData.push(periodData);
  });

  const result = {
    monthlyData: monthlyData.sort((a, b) => moment(a.periodStart).diff(moment(b.periodStart)))
  };

  return result;
}

export function normalizeOEEDataByMonth(dataReturned, finalDateFilter) {
  // Verifica se há dados
  if (!Array.isArray(dataReturned) || dataReturned.length === 0) {
    return [];
  }

  // Agrupa os dados por mês e status
  const monthlyData = dataReturned.reduce((acc, item) => {
    const month = item.competence || item.month;
    const status = item.status;
    const totalHours = item.totalHours || 0;
    const date = item.date;
    const dateString = item.dateString;
    const factor = item.factor || 100;

    if (!acc[month]) {
      acc[month] = {
        month,
        date,
        dateString,
        items: []
      };
    }

    // Adiciona o item ao mês correspondente
    acc[month].items.push({
      status,
      totalHours: (totalHours * 100) / 100,
      date,
      dateString,
      month,
      factor
    });

    return acc;
  }, {});

  // Converte o objeto em array e ordena por mês
  return Object.values(monthlyData)
    .sort((a, b) => moment(a.month).diff(moment(b.month)));
}
