import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "./hotline";

const createWeatherGradientRouteLayer = ({
  pointsGradients,
  min,
  max,
  color,
}) => {
  const instance = L.hotline(pointsGradients, {
    min,
    max,
    palette: {
      0.0: color.min,
      0.5: color.med,
      1.0: color.max,
    },
    weight: 20,
    outlineColor: "#000000",
    outlineWidth: 0,
  });
  return instance;
};

export default createControlComponent(createWeatherGradientRouteLayer);
