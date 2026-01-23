function truncate(n) {
  return n > 0 ? Math.floor(n) : Math.ceil(n);
}

const dmsRe =
  /^(-?\d+(?:\.\d+)?)[°:d]?\s?(?:(\d+(?:\.\d+)?)['′ʹ:]?\s?(?:(\d+(?:\.\d+)?)["″ʺ]?)?)?\s?([NSEW])?/i;

class Dms {
  _dd;
  _hemisphere;

  get dd() {
    return this._dd;
  }

  get hemisphere() {
    return this._hemisphere;
  }

  constructor(dd, longOrLat) {
    this._dd = dd;
    this._hemisphere = /^[WE]|(?:lon)/i.test(longOrLat)
      ? dd < 0
        ? "W"
        : "E"
      : dd < 0
      ? "S"
      : "N";
  }

  getDmsArray() {
    return this.dmsArray;
  }

  get dmsArray() {
    const absDD = Math.abs(this._dd);
    const degrees = truncate(absDD);
    const minutes = truncate((absDD - degrees) * 60);
    const seconds = (absDD - degrees - minutes / 60) * Math.pow(60, 2);
    return [degrees, minutes, seconds, this._hemisphere];
  }

  toString() {
    const dmsArray = this.getDmsArray();
    return dmsArray?.length > 3 ? `${dmsArray[0]}° ${dmsArray[1]}′ ${dmsArray[2].toFixed(2)}″ ${dmsArray[3]}` : '';
    //return `${dmsArray[0]}° ${dmsArray[1]}′ ${dmsArray[3]}`;
  }
}
export class DmsCoordinates {
  static dmsRe = dmsRe;
  _longitude;
  _latitude;

  get longitude() {
    return this._longitude;
  }

  get latitude() {
    return this._latitude;
  }

  constructor(lat, lon) {
    if (typeof lat !== "number" || typeof lon !== "number") {
      throw TypeError("The longitude and latitude parameters must be numbers.");
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      throw RangeError("longitude must be between -180 and 180");
    }
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw RangeError("latitude must be between -90 and 90");
    }
    this._longitude = new Dms(lon, "long");
    this._latitude = new Dms(lat, "lat");
  }

  getDmsArrays() {
    return this.dmsArrays;
  }

  get dmsArrays() {
    return {
      longitude: this.longitude.getDmsArray(),
      latitude: this.latitude.getDmsArray(),
    };
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }

  toString() {
    return [this.latitude, this.longitude].join(", ");
  }
}
