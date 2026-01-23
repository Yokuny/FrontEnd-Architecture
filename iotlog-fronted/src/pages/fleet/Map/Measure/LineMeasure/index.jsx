import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "./line";
import "./line.css"

const createLineMeasureLayer = () => {
  const instance = new L.Control.LinearMeasurement({
    unitSystem: "nauticalMiles",
    color: "#0d0000",
    type: "line",
    show_last_node: true,
    position: 'topright',
  });
  return instance;
};

export default createControlComponent(createLineMeasureLayer);
