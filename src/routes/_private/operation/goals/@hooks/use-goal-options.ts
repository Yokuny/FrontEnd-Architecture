export function useGoalOptions() {
  const goalTypes = [
    { value: 'DOWNTIME', label: 'Downtime' },
    { value: 'PRODUCTION', label: 'Production' },
    { value: 'AVAILABILITY', label: 'Availability' },
    { value: 'OEE', label: 'OEE' },
  ];

  const years = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year, label: year.toString() };
  });

  return { goalTypes, years };
}
