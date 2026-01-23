import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "./hotline";

const createGradientRouteLayer = ({ theme, pointsGradients, min, max, isShowGradient = true }) => {
  const instance = L.hotline(pointsGradients, {
    min,
    max,
    palette: isShowGradient
    ? {
      0.0: theme.colorDanger500,
      0.5: theme.colorWarning500,
      1.0: theme.colorSuccess500,
    }
    : {
      0.0: theme.colorWarning500,
      0.5: theme.colorWarning500,
      1.0: theme.colorWarning500,
    },
    weight: 2,
    outlineColor: "#000000",
    outlineWidth: 0,
  });
  return instance;
};

export default createControlComponent(createGradientRouteLayer);
