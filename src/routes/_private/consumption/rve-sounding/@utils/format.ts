export const formatNumber = (value: number | string, decimals = 2) => {
  return (
    Number(value || 0)
      .toFixed(decimals)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.') || '0,00'
  );
};
