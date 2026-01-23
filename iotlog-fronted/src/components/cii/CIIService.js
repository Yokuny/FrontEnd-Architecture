import { TYPE_VESSSEL } from "../../constants"

class CII_Service {

  _getRefenceAC(typeVessel, dwt, grossTonage) {
    switch (typeVessel) {
      case TYPE_VESSSEL.BULK_CARRIER:
        return { a: 4745, c: 0.622, capacity: dwt >= 279_000 ? 279_000 : dwt, dd: { d1: 0.86, d2: 0.94, d3: 1.06, d4: 1.18 } }
      case TYPE_VESSSEL.GAS_CARRIER:
        return dwt >= 65_000
          ? { a: 14405e+7, c: 2.071, capacity: dwt, dd: { d1: 0.81, d2: 0.91, d3: 1.12, d4: 1.44 } }
          : { a: 8104, c: 0.639, capacity: dwt, dd: { d1: 0.85, d2: 0.95, d3: 1.06, d4: 1.25 } }
      case TYPE_VESSSEL.TANKER:
        return { a: 5247, c: 0.610, capacity: dwt, dd: { d1: 0.82, d2: 0.93, d3: 1.08, d4: 1.28 } }
      case TYPE_VESSSEL.CONTAINER_SHIP:
        return { a: 1984, c: 0.489, capacity: dwt, dd: { d1: 0.83, d2: 0.94, d3: 1.07, d4: 1.19 } }
      case TYPE_VESSSEL.GENERAL_CARGO_SHIP:
        return dwt >= 20_000
          ? { a: 31948, c: 0.792, capacity: dwt, dd: { d1: 0.83, d2: 0.94, d3: 1.06, d4: 1.19 } }
          : { a: 588, c: 0.3885, capacity: dwt, dd: { d1: 0.83, d2: 0.94, d3: 1.06, d4: 1.19 } }
      case TYPE_VESSSEL.REFRIGERATED_CARGO_CARRIER:
        return { a: 4600, c: 0.557, capacity: dwt, dd: { d1: 0.78, d2: 0.91, d3: 1.07, d4: 1.20 } }
      case TYPE_VESSSEL.COMBINATION_CARRIER:
        return { a: 40853, c: 0.812, capacity: dwt, dd: { d1: 0.87, d2: 0.96, d3: 1.06, d4: 1.14 } }
      case TYPE_VESSSEL.LNG_CARRIER:
        return dwt >= 100_000
          ? { a: 9.827, c: 0, capacity: dwt, dd: { d1: 0.89, d2: 0.98, d3: 1.06, d4: 1.13 } }
          : { a: 14479E+10, c: 2.673, capacity: dwt >= 65_000 ? dwt : 65_000 , dd: { d1: 0.78, d2: 0.92, d3: 1.10, d4: 1.37 } }
      case TYPE_VESSSEL.RO_RO_CARGO_SHIP:
        return { a: 10952, c: 0.637, capacity: grossTonage, dd: { d1: 0.66, d2: 0.9, d3: 1.11, d4: 1.37 } }
      case TYPE_VESSSEL.RO_RO_CARGO_SHIP_VC:
        return { a: 5739, c: 0.631, capacity: dwt, dd: { d1: 0.86, d2: 0.94, d3: 1.06, d4: 1.16 } }
      case TYPE_VESSSEL.RO_RO_PASSENGER_SHIP:
        return { a: 7540, c: 0.587, capacity: grossTonage, dd: { d1: 0.72, d2: 0.9, d3: 1.12, d4: 1.41 } }
      case TYPE_VESSSEL.CRUISE_PASSENGER_SHIP:
        return { a: 930, c: 0.383, capacity: grossTonage, dd: { d1: 0.87, d2: 0.95, d3: 1.06, d4: 1.16 } }
      default: return null;
    }
  }

  calculateCIIReference({ typeVessel, dwt, grossTonage }) {
    const reference = this._getRefenceAC(typeVessel, dwt, grossTonage);
    if (!reference ||
      !reference?.capacity ||
      !isFinite(reference?.capacity) ||
      isNaN(reference?.capacity)) return null;
    // Expression: CII ref = a * capacity ^ (-)c
    // CII reference is result by a multiply capacity elevate by negative c
    return reference.a * Math.pow(reference.capacity, reference.c * -1);
  }

}

export default new CII_Service();
