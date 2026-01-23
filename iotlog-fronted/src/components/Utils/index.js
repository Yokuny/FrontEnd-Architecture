import jwt_decode from "jwt-decode";
import moment from "moment";

export const formatterMbKb = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const totalMB = (bytes / 1048576).toFixed(2);
  return totalMB > 0 ? `${totalMB} MB` : `${(bytes / 1024).toFixed(2)} KB`;
};

export const getTokenDecoded = () => {
  try {
    return jwt_decode(localStorage.getItem("token"));
  } catch {
    return undefined;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt_decode(token);
  } catch {
    return undefined;
  }
};

export const verifyTime = (value) => {
  let valueProxied = value.match(
    /([0-9])?([0-9])?([0-9])?(:)?([0-9])?([0-9])?/
  );
  if (valueProxied?.length) {
    let valueFinded = valueProxied[0];
    return valueFinded?.length == 2 ? `${valueFinded}:00` : valueFinded;
  }

  return undefined;
};

export const verifyIDInvalid = (value) => {
  const format =
    /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~çÇãÃÕõáéíóúÁÉÍÓÚÀÈÌÒÙàèìòù]/;
  return format.test(value);
};

export const formatFloat = (value) => {
  return !value
    ? ""
    : value && value[0] === "-"
      ? value
      : value &&
        !value
          ?.toString()
          ?.slice(0, value.length - 1)
          .includes(",") &&
        value[value.length - 1] === ","
        ? value
        : value?.toString()?.match(/[+-]?([0-9]*[,])?[0-9]+/)[0];
};

export const parseToFloatValid = (value) => {
  if (!value) return 0;
  const parsedFloat = parseFloat(value.toString().replace(",", "."));
  return isNaN(parsedFloat) ? 0 : parsedFloat;
};

export const floatToStringNormalize = (value) => {
  return value === null || value === undefined || value === "" ? "" : value?.toString()?.replace(".", ",");
};

export const isInt = (n) => {
  return n % 1 === 0;
};

export const floatToStringBrazilian = (value, decimals = 2) => {
  if (!value || Array.isArray(value)) return "0";
  return isInt(value)
    ? value
    : !isNaN(parseFloat(value))
      ? isInt(parseFloat(value.toFixed(decimals)))
        ? parseFloat(value.toFixed(decimals))
        : value.toFixed(decimals)?.toString()?.replace(".", ",")
      : "0";
};

export const floatToStringExtendDot = (value, decimals = 2) => {
  return (
    Number(value || 0)
      ?.toFixed(decimals)
      ?.replace(".", ",")
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0,00"
  );
};

export const floatToStringFixedNormalize = (value, decimals = 2) => {
  if (!value) return 0;
  if (/[a-zA-Z]/g.test(value)) return value;
  return parseFloat(value).toFixed(decimals);
};

export const convertBrazillianDate = (value) => {
  return `${value.slice(6, 10)}-${value.slice(3, 5)}-${value.slice(
    0,
    2
  )}T${value.slice(11)}`;
};

export const normalizeFixed = (floatValue, sizeDecimals = undefined) => {
  return sizeDecimals
    ? parseFloat(floatValue?.toFixed(sizeDecimals))
    : floatValue;
};

export const normalizeFixedValidInt = (
  floatValue,
  sizeDecimals = undefined
) => {
  if (isInt(floatValue)) return floatValue;
  if (!floatValue) return 0;
  return sizeDecimals
    ? parseFloat(floatValue?.toFixed(sizeDecimals))
    : floatValue;
};

export const getLatLonNormalize = (coordinate, sizeDecimals = undefined) => {
  if (Array.isArray(coordinate) && coordinate?.length === 2) {
    return !sizeDecimals
      ? coordinate
      : [
        normalizeFixed(coordinate[0], sizeDecimals),
        normalizeFixed(coordinate[1], sizeDecimals),
      ];
  }

  return coordinate?.lat !== undefined && coordinate?.lon !== undefined
    ? [
      normalizeFixed(coordinate?.lat, sizeDecimals),
      normalizeFixed(coordinate?.lon, sizeDecimals),
    ]
    : [
      normalizeFixed(coordinate?.latitude, sizeDecimals),
      normalizeFixed(coordinate?.longitude, sizeDecimals),
    ];
};

export const normalizeDataPosition = (dataToNormalize) => {
  return (
    dataToNormalize
      ?.filter((x) => x?.value !== undefined)
      ?.map((x) => ({
        date: x.date,
        idMachine: x.idMachine,
        idSensor: x.idSensor || x.sensorId,
        position: getLatLonNormalize(x.value),
      }))
      .filter((x) => x.position?.length === 2) || []
  );
};

export const normalizeDataCourse = (dataToNormalize) => {
  return (
    dataToNormalize
      ?.filter((x) => !!x && x.value !== undefined)
      .map((x) => ({
        idMachine: x.idMachine,
        date: x.date,
        idSensor: x.idSensor,
        course: x.value,
      })) || []
  );
};

export const getDifferenceDateAgo = (date, intl) => {
  const diferenceSeconds = moment().diff(date, "seconds");
  if (diferenceSeconds >= 60) {
    const diferenceMinutes = moment().diff(date, "minutes");

    if (diferenceMinutes >= 60) {
      const diferenceHour = moment().diff(date, "hours");

      if (diferenceHour >= 24) {
        const diferenceDays = moment().diff(date, "days");
        const diferenceMonth = moment().diff(date, "months");

        if (diferenceMonth >= 1) {
          const diferenceYear = moment().diff(date, "years");

          if (diferenceYear >= 1) {
            return `${diferenceYear} ${intl.formatMessage({
              id: diferenceYear === 1 ? "year" : "years",
            })}`;
          }

          return `${diferenceMonth} ${intl.formatMessage({
            id: diferenceMonth === 1 ? "month" : "months",
          })}`;
        }

        return `${diferenceDays} ${intl.formatMessage({
          id: diferenceDays === 1 ? "day" : "days",
        })}`;
      }

      return `${diferenceHour} ${intl.formatMessage({
        id: diferenceHour === 1 ? "hour" : "hours",
      })}`;
    }

    return `${diferenceMinutes} ${intl.formatMessage({
      id: diferenceMinutes === 1 ? "minute" : "minutes",
    })}`;
  }

  return `${!diferenceSeconds || diferenceSeconds <= 0 ? 1 : diferenceSeconds
    } ${intl.formatMessage({
      id: "seconds",
    })}`;
};

export const formatDateDiff = (
  date,
  intl,
  idReplaceText = "replace.date.difference"
) => {
  return intl
    .formatMessage({ id: idReplaceText || "replace.date.difference" })
    .replace("{0}", getDifferenceDateAgo(date, intl));
};

export const convertUTCDateToLocalDate = (date) => {
  return `${moment(date).format("YYYY-MM-DDTHH:mm:ss")}.000Z`;
};

export const getShowVisibility = (visibility) => {
  switch (visibility) {
    case "public":
      return {
        theme: "Primary",
        icon: "eye-outline",
        textId: "public",
      };
    case "limited":
      return {
        theme: "Warning",
        icon: "eye",
        textId: "limited",
      };
    case "private":
      return {
        theme: "Danger",
        icon: "eye-off",
        textId: "private",
      };
    default:
      return {
        theme: "Basic",
        icon: "eye-off-outline",
        textId: "default",
      };
  }
};

export function getArrayMax(array) {
  return Math.max.apply(null, array);
}

export function getArrayMin(array) {
  return Math.min.apply(null, array);
}

export function getArrayAVG(array) {
  if (!array?.length) return 0;
  return (array?.reduce((a, b) => a + b, 0) / array?.length).toFixed(2);
}

export const getFormatMinMaxDate = ({
  dateInit,
  dateEnd,
  timeInit,
  timeEnd,
  interval,
}) => {
  if (dateInit && dateEnd) {
    const filterDate = {
      min: `${moment(dateInit).format("YYYY-MM-DD")}T${timeInit || "00:00"
        }:00${moment(dateInit).format("Z")}`,
      max: `${moment(dateEnd).format("YYYY-MM-DD")}T${timeEnd || "23:59"
        }:00${moment(dateEnd).format("Z")}`,
      interval: interval,
    };
    return filterDate;
  }
};

export function angle(latFrom, lngFrom, latTo, lngTo) {
  var dy = lngTo - lngFrom;
  var dx = latTo - latFrom;
  var theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta;
}

export function angle360(latFrom, lngFrom, latTo, lngTo) {
  var theta = angle(latFrom, lngFrom, latTo, lngTo);
  if (theta < 0) theta = 360 + theta;
  return theta;
}

const distance = (coor1, coor2) => {
  const x = coor2.lat - coor1.lat;
  const y = coor2.lng - coor1.lng;
  return Math.sqrt(x * x + y * y);
};

export function sortByDistanceArray(coordinates, point) {
  const sorter = (a, b) => distance({ lat: a[1], lng: a[2] }, point) - distance({ lat: b[1], lng: b[2] }, point);
  return coordinates?.sort(sorter);
};

export function sortByDistance(coordinates, point) {
  const sorter = (a, b) => distance(a, point) - distance(b, point);
  return coordinates.sort(sorter);
};

export function groupBy(array, key) {
  return array?.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};

export const isValueValid = (value) => {
  return value !== undefined && value !== null;
}

export const isPositionValid = (position) => {
  return !!(position?.length === 2 &&
    !(position[0] === null ||
      position[0] === undefined ||
      position[1] === null ||
      position[1] === undefined ||
      isNaN(position[0]) ||
      isNaN(position[1])
    ))
}

export const timezoneToNumber = (tz) => {
  const match = tz.match(/([+-])(\d{2})/);
  const sign = match[1];
  const hours = parseInt(match[2], 10);
  return sign === '-' ? -hours : hours;
};

export const getDocumentFormat = (format) => {
  if (["image/png", "image/jpg"].includes(format)) {
    return "Image";
  } else if (format === "application/pdf") {
    return "PDF";
  } else {
    return "";
  }
}

export const convertTimeCentesimalToHHMM = (hoursCentesimal) => {
  const hours = Math.floor(hoursCentesimal);
  const minutesFrezze = hoursCentesimal - hours;

  const minutes = parseInt(minutesFrezze * 60);

  const hourFormatted = String(hours).padStart(2, '0');
  const minFormatted = String(minutes).padStart(2, '0');

  return `${hourFormatted}:${minFormatted}`;
}

export const calculateTimeDifference = (dateTime1, dateTime2) => {
  // Convert the date/time strings to Date objects
  const date1 = new Date(dateTime1);
  const date2 = new Date(dateTime2);
  date1.setHours(date1.getHours(), date1.getMinutes(), 0, 0);
  date2.setHours(date2.getHours(), date2.getMinutes(), 0, 0);
  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date2 - date1);

  // Calculate hours and minutes
  const hours = Math.floor(differenceMs / 3600000); // 1 hour = 3,600,000 ms
  const minutes = Math.floor((differenceMs % 3600000) / 60000); // 1 minute = 60,000 ms

  // Format to HH:mm with zero padding
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
}

function ordenarObjeto(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((ordenado, chave) => {
      ordenado[chave] = obj[chave];
      return ordenado;
    }, {});
}

function ordenarArrayProfundamente(arr) {
  return arr
    .map(item => typeof item === 'object' && item !== null
      ? ordenarObjeto(item)
      : item)
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

export const compareArray = (a, b) => {
  const ordenadoA = ordenarArrayProfundamente(a);
  const ordenadoB = ordenarArrayProfundamente(b);
  return JSON.stringify(ordenadoA) === JSON.stringify(ordenadoB);
}

export const clearLocalStorage = () => {
  const REMEMBER_EMAIL_KEY = "loginRememberEmail";
  const THEME_KEY = "theme";
  const LANGUAGE_KEY = "locale";
  const keysToKeep = [REMEMBER_EMAIL_KEY, THEME_KEY, LANGUAGE_KEY];
  const tempStorage = {};
  keysToKeep.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      tempStorage[key] = value;
    }
  });
  localStorage.clear();
  Object.keys(tempStorage).forEach(key => {
    localStorage.setItem(key, tempStorage[key]);
  });
}
