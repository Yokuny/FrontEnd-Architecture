

const findCompetence = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const dateBrokenContract = new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-26T00:00:00-03:00`)

  if (date < dateBrokenContract) {
      return new Date(year, month, 26);
  } else {
      return new Date(year, month + 1, 26);
  }
}
export const getPtax = (ptaxList, date) => {
  if (!ptaxList?.length) return 0;

  const competenceReference = findCompetence(new Date(date));

  const ptaxNormalized = ptaxList?.map(ptax =>({
    ...ptax,
    dateReference: findCompetence(new Date(ptax.date))
  }));
  const ptaxFinded = ptaxNormalized?.find(ptax => ptax.dateReference.getTime() === competenceReference.getTime());
  return ptaxFinded?.value || 0;
}

export const sumOthers = (item, ptax) => {
  return item.others.reduce((acc, curr) => {
    return acc + ((curr.valueBRL || 0) + ((curr.valueUSD || 0) * ptax));
  }, 0);
}

export const calcFactor = (dailyValue, item, factorOfContract) => {
  const valueInMinutes = dailyValue === 0 ? 0 : dailyValue / (24 * 60);
  const minutesDiff = (new Date(item.endedAt || new Date()).getTime() - new Date(item.startedAt || new Date()).getTime()) / 60000;
  const valueInPeriod = valueInMinutes * minutesDiff;
  const valueInPeriodWithFactor = valueInPeriod * (factorOfContract ? (factorOfContract / 100) : 1);
  return valueInPeriodWithFactor;
}
