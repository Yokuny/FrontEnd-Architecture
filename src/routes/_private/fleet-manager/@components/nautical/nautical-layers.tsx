import { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { useFleetManagerStore } from '../../@hooks/use-fleet-manager-store';
import { useNavtorToken, useTicketNAV } from '../../@hooks/use-nautical-api';

export function NauticalNavtor() {
  const { data, isLoading } = useNavtorToken();
  const map = useMap();

  useEffect(() => {
    map.setMaxZoom(16);
    return () => {
      map.setMaxZoom(17);
    };
  }, [map]);

  if (isLoading || !data?.token) return null;

  return (
    <TileLayer
      url={`https://web-maps-tile.navtor.com/v1/map/tiles/Enc/{z}/{x}/{y}.png?bearerToken=${data.token}`}
      attribution='© <a href="https://www.navtor.com/" target="_blank" rel="noreferrer">Navtor</a>'
    />
  );
}

export function NauticalNAV() {
  const { decryptedToken, isLoading } = useTicketNAV();

  if (isLoading || !decryptedToken) return null;

  return (
    <TileLayer attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">bykonz</a>' url={`https://siot-third.konztec.com/tile/{z}/{x}/{y}?token=${decryptedToken}`} />
  );
}

export function NauticalCMAP({ isRelief = false, isDark = false }) {
  let url = 'https://io-3-resources.bykonz.com/tile-map';
  if (isDark) {
    url += '-dark';
  } else if (isRelief) {
    url += '-relief';
  }
  url += '/{z}/{x}/{y}';

  return <TileLayer attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">bykonz</a>' url={url} />;
}

export function NauticalLayers() {
  const { nauticalChart } = useFleetManagerStore();

  switch (nauticalChart) {
    case 'navtor':
      return <NauticalNavtor />;
    case 'nav':
      return <NauticalNAV />;
    case 'cmap':
      return <NauticalCMAP />;
    case 'cmap_relief':
      return <NauticalCMAP isRelief />;
    case 'cmap_dark':
      return <NauticalCMAP isDark />;
    default:
      return null;
  }
}
