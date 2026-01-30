import * as pb from 'protobufjs';
import type { SensorDataSeries } from '../@interface/datalogger.types';

/**
 * Protobuf schema for time series sensor data
 */
const TIMESERIES_PROTO = `
  syntax = "proto3";
  package timeseries;

  message DataPoint {
    double timestamp = 1;
    double value = 2;
  }

  message TimeSeries {
    repeated DataPoint data = 1;
    string id = 2;
    string name = 3;
  }

  message TimeSeriesCollection {
    repeated TimeSeries series = 1;
  }
`;

let root: pb.Root | null = null;

/**
 * Get cached protobuf root for time series
 */
export function getTimeSeriesProtoRoot(): pb.Root {
  if (!root) {
    const parsed = pb.parse(TIMESERIES_PROTO);
    root = pb.Root.fromJSON(parsed.root);
  }
  return root;
}

/**
 * Decode protobuf buffer to sensor data series
 */
export function decodeSensorTimeSeries(buffer: Uint8Array): SensorDataSeries[] {
  const protoRoot = getTimeSeriesProtoRoot();
  const TimeSeriesCollection = protoRoot.lookupType('timeseries.TimeSeriesCollection');
  const message = TimeSeriesCollection.decode(buffer);
  const object = TimeSeriesCollection.toObject(message, {
    longs: Number,
    enums: String,
    bytes: String,
  }) as { series?: Array<{ id: string; name: string; data?: Array<{ timestamp: number; value: number }> }> };

  return (object.series || []).map((series) => ({
    sensorId: series.id,
    name: series.name,
    data: (series.data || []).map((point) => ({
      timestamp: point.timestamp,
      value: point.value,
    })),
  }));
}
