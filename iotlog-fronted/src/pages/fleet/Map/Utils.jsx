import { useMap, useMapEvents } from "react-leaflet";

export const DARKS_MAP = ["smoothdark", "earth"];

export function GetZoom({ onChangeZoom }) {
  const mapEvents = useMapEvents({
    zoomend: () => {
      onChangeZoom(mapEvents.getZoom());
    },
  });

  return null;
}

export function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}
