import * as pb from 'protobufjs';
import type { FleetPositionsCollection } from '../@interface/protobuf';

const FLEET_PROTO = `
  syntax = "proto3";
  package positions;

  message Point {
    double timestamp = 1;
    string idAsset = 2;
    string idSensor = 3;
    double lat = 4;
    double lon = 5;
  }

  message Course {
    double timestamp = 1;
    string idAsset = 2;
    string idSensor = 3;
    double course = 4;
  }

  message PositionsCollection {
    repeated Point points = 1;
    repeated Course courses = 2;
  }
`;

let root: pb.Root | null = null;

export function getFleetProtoRoot() {
  if (!root) {
    const parsed = pb.parse(FLEET_PROTO);
    root = pb.Root.fromJSON(parsed.root);
  }
  return root;
}

export function decodeFleetPositions(buffer: Uint8Array): FleetPositionsCollection {
  const root = getFleetProtoRoot();
  const PositionsCollection = root.lookupType('positions.PositionsCollection');
  const message = PositionsCollection.decode(buffer);
  const object = PositionsCollection.toObject(message, {
    longs: Number,
    enums: String,
    bytes: String,
  }) as any;

  return {
    positions: (object.points || []).map((p: any) => ({
      date: new Date(p.timestamp * 1000),
      idMachine: p.idAsset,
      idSensor: p.idSensor,
      position: [p.lat, p.lon] as [number, number],
    })),
    courses: (object.courses || []).map((c: any) => ({
      date: new Date(c.timestamp * 1000),
      idMachine: c.idAsset,
      idSensor: c.idSensor,
      course: c.course,
    })),
  };
}
