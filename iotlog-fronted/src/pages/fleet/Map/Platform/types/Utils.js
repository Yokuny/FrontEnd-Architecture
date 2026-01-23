export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function handleMachineOnPlataform([latPlataform, lonPlataform], [lat, lon], rPlataform) {
  const distance = calculateDistance(lat, latPlataform, lon, lonPlataform);
  return distance <= rPlataform;
}

function calculateDistance(lat1, lat2, lon1, lon2) {
  const R_EARTH_IN_METERS = 6371e3;

  const dLat = toRadians(lat1 - lat2);
  const dLon = toRadians(lon1 - lon2);

  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat2)) *
    Math.cos(toRadians(lat1)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R_EARTH_IN_METERS * c;
  return distance;
}

