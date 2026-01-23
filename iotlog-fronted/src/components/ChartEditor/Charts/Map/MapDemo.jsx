import React from "react";
import { FormattedMessage } from "react-intl";
import { MapContainer, TileLayer } from "react-leaflet";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";

const MapDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const position = [-26.171396, -48.537897];

  return (
      <ContainerChart height={height} width={width} className="card-shadow pt-1">
        <TextSpan apparence="s2" className="pt-1 pb-2">
          <FormattedMessage id="map" />
        </TextSpan>
        <MapContainer
          style={{ width, height: height - 15 }}
          center={position}
          zoom={4}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; IoTLog by <a href="https://www.bykonz.com">Bykonz</a>'
            url={
              "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
        </MapContainer>
      </ContainerChart>
  );
};
export default MapDemo;
