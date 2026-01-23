import { nanoid } from "nanoid";
import React from "react";
import { TileLayer } from "react-leaflet";

export default function NauticalCMAPDark() {

  return (
    <>
       <TileLayer
        key={nanoid(4)}
        attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">bykonz</a>'
        url={`https://io-3-resources.bykonz.com/tile-map-dark/{z}/{x}/{y}`}
      />
    </>
  );
}
