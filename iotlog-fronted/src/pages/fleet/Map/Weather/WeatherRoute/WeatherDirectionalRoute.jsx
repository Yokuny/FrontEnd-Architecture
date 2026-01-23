import L from "leaflet";
import "leaflet-rotatedmarker";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const RotatedMarker = ({ position, icon, rotationAngle = 0 }) => {
  const map = useMap();

  useEffect(() => {
    // Cria o marcador com rotação
    const marker = L.marker(position, {
      icon,
      rotationAngle, // Ângulo de rotação em graus
      rotationOrigin: "center", // Origem da rotação (padrão: "center")
    }).addTo(map);

    // Remove o marcador ao desmontar o componente
    return () => {
      map.removeLayer(marker);
    };
  }, [map, position, icon, rotationAngle]);

  return null;
};

export default RotatedMarker;