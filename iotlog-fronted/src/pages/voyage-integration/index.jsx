import React from "react";
import styled from "styled-components";
import MapVoyage from "./map/MapVoyage";
import DetailsVoyageIntegration from "./details/DetailsVoyageIntegration";
import { AssetSidebar, VoyageSidebar } from "./sidebar-menus";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SidebarStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 998;
  display: flex;
  flex-direction: row;
  padding: 4.7rem 0 0 0.7rem;
  border-radius: 12px;
  pointer-events: none;
  height: calc(100vh - .5rem);

  > * {
    pointer-events: auto;
  }
`;

const VoyageIntegration = () => {
  return (
    <>
      <Container>
        <SidebarStyled>
          <AssetSidebar />
          <DetailsVoyageIntegration />
        </SidebarStyled>

        <MapVoyage />
      </Container>
    </>
  );
};

export default VoyageIntegration;
