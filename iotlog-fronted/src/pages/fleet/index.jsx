import React from "react";
import styled from "styled-components";
import ConsumeFleet from "./Consume";
import Crew from "./Crew";
import FleetDetails from "./Details";
import VesselsInFence from "./Details/Fences/VesselsInFence";
import MyListFleet from "./Details/MyListFleet";
import Info from "./Info";
import InfoCameras from "./Info/Cameras";
import InfoContact from "./Info/Contacts";
import InfoVoyage from "./Info/Voyage";
import Map from "./Map";
import MeasureRoute from "./Map/Measure/MeasureRoute";

const Container = styled.div`
  position: fixed;
  left:0;
  top:0;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .tab-content {
    padding: 0px;
  }
`;

const ColStyled = styled.div`
  display: flex; 
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export default function FleetComponent(props) {

  return (
    <>
      <Container>
        <MyListFleet />
        <MeasureRoute />

        <ColStyled>
          <Map />
          <ConsumeFleet />
          <Crew />
          <Info />
          <InfoContact />
          <InfoCameras />
          <InfoVoyage />
        </ColStyled>

        <VesselsInFence />
      </Container>
    </>
  );
};
