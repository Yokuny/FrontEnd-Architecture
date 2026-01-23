import { nanoid } from "nanoid";
import React from "react";
import { TileLayer, useMap } from "react-leaflet";
import { SpinnerFull } from "../../../../components";
import { useFetch } from "../../../../components/Fetch/Fetch";

export default function NauticalNavtor() {

  const { data, isLoading } = useFetch('/integrationthird/navtor/token');

  const map = useMap();

  React.useEffect(() => {
    map.setMaxZoom(16);

    return () => {
      map.setMaxZoom(17);
    };
  }, [map]);

  return (
    <>
      {!!data?.token && <TileLayer
        key={nanoid(4)}
        url={`http://web-maps-tile.navtor.com/v1/map/tiles/Enc/{z}/{x}/{y}.png?bearerToken=${data?.token}`}
        attribution='© <a href="https://www.navtor.com/" target="_blank" rel="noreferrer">Navtor</a>'
      />}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
