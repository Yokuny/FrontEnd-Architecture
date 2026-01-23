import { nanoid } from "nanoid";
import React from "react";
import cryptoJs from "crypto-js";
import { TileLayer } from "react-leaflet";
import { SpinnerFull } from "../../../../components";
import { useFetch } from "../../../../components/Fetch/Fetch";

const _ba_t = (a) => {
  try {
    return cryptoJs.AES.decrypt(
      a,
      `t4y@t%4anV9W3a5d2$`
    ).toString(cryptoJs.enc.Utf8);
  } catch {
    return "";
  }
};

export default function NauticalNAVMap() {
  const { data, isLoading } = useFetch('/integrationthird/ticketNAV');

  const token = _ba_t(data?.token)

  return (
    <>
      {!!token && <TileLayer
        key={nanoid(4)}
        attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">bykonz</a>'
        url={`https://siot-third.konztec.com/tile/{z}/{x}/{y}?token=${token}`}
      />}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
