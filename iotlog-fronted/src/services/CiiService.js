
const MATRIX_DATE_REDUCTION_IN_PERCENT = [
  {
    year: 2022,
    reduction: 0,
  },
  {
    year: 2023,
    reduction: 0.05,
  },
  {
    year: 2024,
    reduction: 0.07,
  },
  {
    year: 2025,
    reduction: 0.09,
  },
  {
    year: 2026,
    reduction: 0.11,
  },
  {
    year: 2027,
    reduction: 0.13,
  },
]

class CiiService {
  getFactorByDate(date) {
    const year = new Date(date).getFullYear();
    const factor = MATRIX_DATE_REDUCTION_IN_PERCENT.find((item) => item.year === year);
    return factor ? factor.reduction : 0;
  }
}

export default new CiiService();
