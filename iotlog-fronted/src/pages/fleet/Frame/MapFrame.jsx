import { MapContainer, TileLayer } from "react-leaflet";
import styled from "styled-components";
import L from "leaflet";
import React from "react";
import { useQueryMap } from "../Map/UrlQueryMap";
import ShowCoordinates from "../Map/Coordinates/ShowCoordinates";
import PointPosition from "../Map/Markers/PointPosition";
// import NauticalECCMap from "../Map/Nautical/NauticalECCMap";
import NauticalNAVMap from "../Map/Nautical/NauticalNAV";
import Platform from "../Map/Platform";
import Fences from "../Map/Fences";
import { useQueryFrame } from "./useQueryFrame";
import MyLocation from "./MyLocation";
import NauticalCMAP from "../Map/Nautical/NauticalCMAP";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  .gps_ring {
    border: 3px solid #fff;
    background: blue;
    border-radius: 30px;
    height: 20px;
    width: 20px;
  }
`;

const MapFrame = (props) => {
  const { center, zoom } = useQueryMap();

  const { theme, nauticalChart, viewFence, viewPlatform, idEnterprise, lat, lon } =
    useQueryFrame();

  React.useLayoutEffect(() => {
    window.L = L;
  }, []);

  return (
    <>
      <Container className="map flex-row">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={center}
          scrollWheelZoom
          zoom={zoom}
          zoomControl={false}
        >
          <TileLayer
            subdomains={["a", "b", "c", "d"]}
            attribution={
              theme === "dark"
                ? 'IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                : 'IoTLog &copy; Maptiler'
            }
            url={
              theme === "dark"
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAP_TILER}`
            }
          />

          <PointPosition />
          <ShowCoordinates />
          {nauticalChart && <NauticalCMAP />}
          {viewPlatform && <Platform idEnterprise={idEnterprise} />}
          {viewFence && <Fences idEnterprise={idEnterprise} />}

          <MyLocation lat={lat} lon={lon} />
        </MapContainer>
      </Container>
    </>
  );
};


export default MapFrame;
