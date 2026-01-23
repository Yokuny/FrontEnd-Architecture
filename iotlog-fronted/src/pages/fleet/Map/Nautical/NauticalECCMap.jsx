import { nanoid } from "nanoid";
import React from "react";
import { WMSTileLayer } from "react-leaflet";
import { SpinnerFull } from "../../../../components";
import { useFetch } from "../../../../components/Fetch/Fetch";

export default function NauticalECCMap() {

  const { data, isLoading } = useFetch('/integrationthird/ticketECS');

  return (
    <>
      {!!data && <WMSTileLayer
        key={nanoid(4)}
        url={`https://services.ecc.no/primar/wms_ticket/${data}?`}
        format="image/png"
        transparent
        version="1.1.1"
        layers="cells"
        styles="style-id-2142"
      />}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
