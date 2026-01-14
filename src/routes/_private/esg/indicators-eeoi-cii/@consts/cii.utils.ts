export enum TYPE_VESSEL {
  BULK_CARRIER = 'BULK_CARRIER',
  GAS_CARRIER = 'GAS_CARRIER',
  TANKER = 'TANKER',
  CONTAINER_SHIP = 'CONTAINER_SHIP',
  GENERAL_CARGO_SHIP = 'GENERAL_CARGO_SHIP',
  REFRIGERATED_CARGO_CARRIER = 'REFRIGERATED_CARGO_CARRIER',
  COMBINATION_CARRIER = 'COMBINATION_CARRIER',
  LNG_CARRIER = 'LNG_CARRIER',
  RO_RO_CARGO_SHIP = 'RO_RO_CARGO_SHIP',
  RO_RO_CARGO_SHIP_VC = 'RO_RO_CARGO_SHIP_VC',
  RO_RO_PASSENGER_SHIP = 'RO_RO_PASSENGER_SHIP',
  CRUISE_PASSENGER_SHIP = 'CRUISE_PASSENGER_SHIP',
}

export function getReferenceAC(typeVessel: string, dwt: number, grossTonage: number) {
  switch (typeVessel) {
    case TYPE_VESSEL.BULK_CARRIER:
      return { a: 4745, c: 0.622, capacity: dwt >= 279_000 ? 279_000 : dwt, dd: { d1: 0.86, d2: 0.94, d3: 1.06, d4: 1.18 } };
    case TYPE_VESSEL.GAS_CARRIER:
      return dwt >= 65_000
        ? { a: 14405e7, c: 2.071, capacity: dwt, dd: { d1: 0.81, d2: 0.91, d3: 1.12, d4: 1.44 } }
        : { a: 8104, c: 0.639, capacity: dwt, dd: { d1: 0.85, d2: 0.95, d3: 1.06, d4: 1.25 } };
    case TYPE_VESSEL.TANKER:
      return { a: 5247, c: 0.61, capacity: dwt, dd: { d1: 0.82, d2: 0.93, d3: 1.08, d4: 1.28 } };
    case TYPE_VESSEL.CONTAINER_SHIP:
      return { a: 1984, c: 0.489, capacity: dwt, dd: { d1: 0.83, d2: 0.94, d3: 1.07, d4: 1.19 } };
    case TYPE_VESSEL.GENERAL_CARGO_SHIP:
      return dwt >= 20_000
        ? { a: 31948, c: 0.792, capacity: dwt, dd: { d1: 0.83, d2: 0.94, d3: 1.06, d4: 1.19 } }
        : { a: 588, c: 0.3885, capacity: dwt, dd: { d1: 0.83, d2: 0.94, d3: 1.06, d4: 1.19 } };
    case TYPE_VESSEL.REFRIGERATED_CARGO_CARRIER:
      return { a: 4600, c: 0.557, capacity: dwt, dd: { d1: 0.78, d2: 0.91, d3: 1.07, d4: 1.2 } };
    case TYPE_VESSEL.COMBINATION_CARRIER:
      return { a: 40853, c: 0.812, capacity: dwt, dd: { d1: 0.87, d2: 0.96, d3: 1.06, d4: 1.14 } };
    case TYPE_VESSEL.LNG_CARRIER:
      return dwt >= 100_000
        ? { a: 9.827, c: 0, capacity: dwt, dd: { d1: 0.89, d2: 0.98, d3: 1.06, d4: 1.13 } }
        : { a: 1.4479e14, c: 2.673, capacity: dwt >= 65_000 ? dwt : 65_000, dd: { d1: 0.78, d2: 0.92, d3: 1.1, d4: 1.37 } };
    case TYPE_VESSEL.RO_RO_CARGO_SHIP:
      return { a: 10952, c: 0.637, capacity: grossTonage, dd: { d1: 0.66, d2: 0.9, d3: 1.11, d4: 1.37 } };
    case TYPE_VESSEL.RO_RO_CARGO_SHIP_VC:
      return { a: 5739, c: 0.631, capacity: dwt, dd: { d1: 0.86, d2: 0.94, d3: 1.06, d4: 1.16 } };
    case TYPE_VESSEL.RO_RO_PASSENGER_SHIP:
      return { a: 7540, c: 0.587, capacity: grossTonage, dd: { d1: 0.72, d2: 0.9, d3: 1.12, d4: 1.41 } };
    case TYPE_VESSEL.CRUISE_PASSENGER_SHIP:
      return { a: 930, c: 0.383, capacity: grossTonage, dd: { d1: 0.87, d2: 0.95, d3: 1.06, d4: 1.16 } };
    default:
      return null;
  }
}

export function calculateCiiReferenceValue(typeVessel: string, dwt: number, grossTonage: number): number | null {
  const reference = getReferenceAC(typeVessel, dwt, grossTonage);
  if (!reference || !reference.capacity || !Number.isFinite(reference.capacity) || Number.isNaN(reference.capacity)) return null;
  return reference.a * reference.capacity ** (reference.c * -1);
}

const MATRIX_DATE_REDUCTION_IN_PERCENT = [
  { year: 2022, reduction: 0 },
  { year: 2023, reduction: 0.05 },
  { year: 2024, reduction: 0.07 },
  { year: 2025, reduction: 0.09 },
  { year: 2026, reduction: 0.11 },
  { year: 2027, reduction: 0.13 },
];

export function getFactorByDate(date: string | Date): number {
  const year = new Date(date).getFullYear();
  const factor = MATRIX_DATE_REDUCTION_IN_PERCENT.find((item) => item.year === year);
  return factor ? factor.reduction : 0;
}

export function calculateCiiReq(ciiRef: number, date: string | Date): number {
  return ciiRef * (1 - getFactorByDate(date));
}

export function getRatingColor(rating: string) {
  switch (rating?.toUpperCase()) {
    case 'A':
      return 'bg-blue-600 text-white';
    case 'B':
      return 'bg-green-500 text-white';
    case 'C':
      return 'bg-yellow-400 text-black';
    case 'D':
      return 'bg-orange-500 text-white';
    case 'E':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

export function calculateRating(
  ciiAttained: number | null | undefined,
  ciiRef: number | null | undefined,
  date: string | Date,
  dd: { d1: number; d2: number; d3: number; d4: number } | null | undefined,
): string {
  if (ciiAttained == null || ciiRef == null || !dd) return '-';
  const ciiReq = calculateCiiReq(ciiRef, date);
  const ratio = ciiAttained / ciiReq;
  if (ratio <= dd.d1) return 'A';
  if (ratio <= dd.d2) return 'B';
  if (ratio <= dd.d3) return 'C';
  if (ratio <= dd.d4) return 'D';
  return 'E';
}
