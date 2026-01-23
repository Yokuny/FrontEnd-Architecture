import { MapContainer } from "react-leaflet";
import { Container } from "../../fleet/Map/Container";
import ShowCoordinates from "../../fleet/Map/Coordinates/ShowCoordinates";
import EnterpriseLogoMap from "../../fleet/Map/EnterpriseLogoMap";
import PolylineMeasure from "../../fleet/Map/Measure";
import OptionsMap from "../../fleet/Map/OptionsMap";
import { NMScale } from "../../fleet/Map/Scale/NMScale";
import { useQueryMap } from "../../fleet/Map/UrlQueryMap";
import VoyageRoute from "../voyage-route/VoyageRoute";

export default function MapVoyage(props) {
  const { center, zoom, isRegionActive } = useQueryMap();
  return (
    <>
      <Container className="map flex-row">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          scrollWheelZoom
          zoomControl={false}
          maxZoom={17}
        >
          <OptionsMap
            isRegionActive={isRegionActive}
            noShowWindy />
          <ShowCoordinates />
          <EnterpriseLogoMap />
          <PolylineMeasure top={55} />
          <NMScale metric position="bottomright" />
          <VoyageRoute />
        </MapContainer>
      </Container>
    </>
  );
}
