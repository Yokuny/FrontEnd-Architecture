import { TYPE_VESSEL } from '../@consts/fleet-manager';

export function calculateCIIReference(typeVessel: string, dwt: number, grossTonnage: number) {
  const getReferenceAC = (type: string, d: number, gt: number) => {
    switch (type) {
      case TYPE_VESSEL.BULK_CARRIER:
        return { a: 4745, c: 0.622, capacity: d >= 279_000 ? 279_000 : d };
      case TYPE_VESSEL.GAS_CARRIER:
        return d >= 65_000 ? { a: 14405e7, c: 2.071, capacity: d } : { a: 8104, c: 0.639, capacity: d };
      case TYPE_VESSEL.TANKER:
        return { a: 5247, c: 0.61, capacity: d };
      case TYPE_VESSEL.CONTAINER_SHIP:
        return { a: 1984, c: 0.489, capacity: d };
      case TYPE_VESSEL.GENERAL_CARGO_SHIP:
        return d >= 20_000 ? { a: 31948, c: 0.792, capacity: d } : { a: 588, c: 0.3885, capacity: d };
      case TYPE_VESSEL.REFRIGERATED_CARGO_CARRIER:
        return { a: 4600, c: 0.557, capacity: d };
      case TYPE_VESSEL.COMBINATION_CARRIER:
        return { a: 40853, c: 0.812, capacity: d };
      case TYPE_VESSEL.LNG_CARRIER:
        return d >= 100_000 ? { a: 9.827, c: 0, capacity: d } : { a: 14479e10, c: 2.673, capacity: d >= 65_000 ? d : 65_000 };
      case TYPE_VESSEL.RO_RO_CARGO_SHIP:
        return { a: 10952, c: 0.637, capacity: gt };
      case TYPE_VESSEL.RO_RO_CARGO_SHIP_VC:
        return { a: 5739, c: 0.631, capacity: d };
      case TYPE_VESSEL.RO_RO_PASSENGER_SHIP:
        return { a: 7540, c: 0.587, capacity: gt };
      case TYPE_VESSEL.CRUISE_PASSENGER_SHIP:
        return { a: 930, c: 0.383, capacity: gt };
      default:
        return null;
    }
  };

  const reference = getReferenceAC(typeVessel, dwt, grossTonnage);
  if (!reference || !reference.capacity || !Number.isFinite(reference.capacity)) return null;

  return reference.a * reference.capacity ** (reference.c * -1);
}
