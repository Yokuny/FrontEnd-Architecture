export const getColorByTypeVessel = (segment) => {
  switch (segment?.toLowerCase()) {
    case "fishing":
    case "passenger":
      return "#dd7400";
    case "container":
      return "#F94E45";
    case "tug":
      return "#FCB03F";
    case "tanker":
    case "chemical":
    case "gas":
    case "oil":
    case "oil service":
    case "lng":
    case "lpg":
      return "#0E0E2A";
    case "cargo":
    case "bulk":
    case "general cargo":
    case "reefer":
    case "car carrier":
    case "dry bulk":
      return "#1939B7";
    default:
      return "#E0E0EE";
  }
}
