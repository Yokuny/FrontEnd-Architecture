import { nanoid } from "nanoid";
import React from "react";
import { TileLayer } from "react-leaflet";

export default function NauticalCMAP({isRelief = false}) {

  return (
    <>
       <TileLayer
        key={nanoid(4)}
        attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">bykonz</a>'
        url={`https://io-3-resources.bykonz.com/tile-map${isRelief ? '-relief':''}/{z}/{x}/{y}`}
      />
    </>
  );
}
