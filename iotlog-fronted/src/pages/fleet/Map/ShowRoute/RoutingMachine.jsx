import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = ({ dataPoints, color }) => {
  const waypoints = dataPoints
    ?.sort((a, b) => new Date(a.date) - new Date(b.date))
    ?.map((x) => L.latLng(x.latLon[0], x.latLon[1]));

  const instance = L.Routing.control({
    waypoints,
    show: false,
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false,
    showAlternatives: false,
    lineOptions: {
      styles: [{ color: color, weight: 4 }],
    },
    serviceUrl: "https://routing.openstreetmap.de/routed-car/route/v1",
    createMarker: function () {
      return null;
    },
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
