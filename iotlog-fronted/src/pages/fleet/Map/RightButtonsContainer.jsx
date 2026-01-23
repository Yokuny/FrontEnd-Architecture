import React from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { connect } from "react-redux";

const Container = styled.div`
  position: absolute;
  top: 5rem;
  right: 10px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};
  transition: right 0.3s ease;

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
    right: 10px;
  }
`;

const RightButtonsContainer = ({ children, machineDetailsSelected, travelDetailsSelected, isShowMeasureLine }) => {
  const theme = useTheme();
  const hasDetailsOpen = !!(machineDetailsSelected || travelDetailsSelected);

  return (
    <Container
      theme={theme}
      hasDetailsOpen={hasDetailsOpen}
      isShowMeasureLine={isShowMeasureLine}
    >
      {children}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  isShowMeasureLine: state.map.isShowMeasureLine,
});

export default connect(mapStateToProps, undefined)(RightButtonsContainer);
