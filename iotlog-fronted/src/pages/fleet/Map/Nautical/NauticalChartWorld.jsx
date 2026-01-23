import { nanoid } from "nanoid";
import React from "react";
import { WMSTileLayer } from "react-leaflet";

export default function NauticalChartWorld() {

  return <WMSTileLayer
    key={nanoid(4)}
    url={`https://siot-third.konztec.com/chartworld?`}
    format="image/png"
    request="GetMap"
    layers="ENC"
    transparent="true"
    version="1.3.0"
  />
}
