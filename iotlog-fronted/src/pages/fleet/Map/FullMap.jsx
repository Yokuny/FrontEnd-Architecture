import L from "leaflet";
import React from "react";
import { MapContainer } from "react-leaflet";
import { MapEventHandler } from "./MapEventHandler";
import SearchThirdFleet from "../SearchThird";
import StatusListCard from "../Status/StatusListCard";
import ConsumeGradientRoute from "./../Consume/GradientRoute";
import ButtonToogleSidebar from "./../Details/ButtonToogleSidebar";
import CenterZoomInitial from "./CenterZoomInitial";
import { Container } from "./Container";
import ShowCoordinates from "./Coordinates/ShowCoordinates";
import EnterpriseLogoMap from "./EnterpriseLogoMap";
import VesselsInFence from "./Fences/VesselsInFence";
import PointsOnMap from "./Markers/PointsOnMap";
import PolylineMeasure from "./Measure";
import OptionsMap from "./OptionsMap";
import PlaybackFleetRegion from "./Playback/Region";
import PlayBackRoute from "./Playback/Route";
import { NMScale } from "./Scale/NMScale";
import ControlShowRoute from "./ShowRoute";
import TravelMarker from "./Travel";
import { useQueryMap } from "./UrlQueryMap";
import RightButtonsContainer from "./RightButtonsContainer";
import LeftButtonsContainer from "./LeftButtonsContainer";

export default function FullMap() {
  const { center, zoom, isRegionActive, REGION_DEFAULT } = useQueryMap();
  React.useEffect(() => {
    window.L = L;
  }, []);

  return (
    <>
      <Container className="map flex-row">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={center?.length === 2 ? center : REGION_DEFAULT}
          zoom={zoom}
          scrollWheelZoom
          zoomControl={false}
          maxZoom={17}
          minZoom={3}
          worldCopyJump
          doubleClickZoom={false}>
          <MapEventHandler />
          <CenterZoomInitial centerInitial={center?.length === 2 ? center : REGION_DEFAULT} />
          <TravelMarker />
          <PointsOnMap />

          {/* Container de botões da esquerda */}
          <LeftButtonsContainer>
            <ButtonToogleSidebar />
            <SearchThirdFleet />
          </LeftButtonsContainer>

          {/* Container de botões da direita */}
          <RightButtonsContainer>
            <OptionsMap isRegionActive={isRegionActive} />
            <ControlShowRoute />
            <PolylineMeasure />
            <PlaybackFleetRegion />
          </RightButtonsContainer>

          <ShowCoordinates />
          <EnterpriseLogoMap />
          <NMScale metric position="bottomright" />
          <ConsumeGradientRoute />
          <PlayBackRoute />
          <VesselsInFence />
          <StatusListCard />
        </MapContainer>
      </Container>
    </>
  );
}
