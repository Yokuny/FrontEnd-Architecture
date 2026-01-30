interface FetchSensorDataParams {
  idMachine: string;
  dateInit: string;
  dateEnd: string;
  timeInit?: string;
  timeEnd?: string;
  interval?: number;
  sensorIds: string[];
}

/**
 * Build query string for sensor data API
 */
export function buildSensorDataQuery(params: FetchSensorDataParams): string {
  const query: string[] = [];

  // Format dates with timezone
  const tzOffset = new Date().toISOString().match(/[+-]\d{2}:\d{2}$/)?.[0] || 'Z';
  query.push(`min=${params.dateInit}T${params.timeInit || '00:00'}:00${tzOffset}`);
  query.push(`max=${params.dateEnd}T${params.timeEnd || '23:59'}:59${tzOffset}`);

  // Interval handling
  if (params.interval === 0) {
    query.push('noInterval=true');
  } else {
    query.push(`interval=${params.interval || 30}`);
  }

  // Sensor IDs
  for (const id of params.sensorIds) {
    query.push(`idSensor[]=${id}`);
  }

  return query.join('&');
}
