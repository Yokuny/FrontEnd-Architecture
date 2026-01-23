import React from "react";
import { useMap } from "react-leaflet";
import { connect } from "react-redux";
import styled from "styled-components";
import { TextSpan } from "../../../../components";
import { DARKS_MAP } from "../Utils";
import { DmsCoordinates } from "./DmsCoordinates";
import { isValueValid } from "../../../../components/Utils";

const Content = styled.div`
  ${({ bottom }) => `
  bottom: ${bottom}px;
position: absolute;
right: 8px;
z-index: 1030;
display: flex;
flex-direction: column;
align-items: flex-end;
`}
`;

const Row = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  align-content: center;
`;

const ShowCoordinates = (props) => {
  const [coords, setCoords] = React.useState();

  const map = useMap();

  React.useEffect(() => {
    map.addEventListener("mousemove", (e) => {
      if (isValueValid(e?.latlng?.lat) && isValueValid(e?.latlng?.lng))
        setCoords([e.latlng.lat, e.latlng.lng]);
    });
    return () => {
      map.removeEventListener("mousemove");
    };
  }, []);

  const getDmsData = () => {
    try {
      return !!coords?.length
        ? new DmsCoordinates(coords[0], coords[1])
        : undefined;
    } catch {
      return undefined;
    }
  };

  const dmsData = getDmsData();

  const color = props.isThemeDark || DARKS_MAP.includes(props.mapTheme) ? "#fff" : "#222b45";

  return (
    <>
      {!!coords?.length && (
        <Content bottom={window.location.pathname === "/fleet-frame" ? 5 : props.bottom ? props.bottom : 35}>
          <Row>
            <TextSpan apparence="c3" style={{ color, paddingTop: 2.5 }}>
              {`${coords[0]?.toFixed(5)} / `}
            </TextSpan>
            <TextSpan apparence="s3" style={{ color }} className="ml-1">
              {dmsData?.getLatitude()?.toString()}
            </TextSpan>
          </Row>
          <Row>
            <TextSpan apparence="c3" style={{ color, paddingTop: 2.5 }}>
              {`${coords[1]?.toFixed(5)} / `}
            </TextSpan>
            <TextSpan apparence="s3" style={{ color }} className="ml-1">
              {dmsData?.getLongitude()?.toString()}
            </TextSpan>
          </Row>
        </Content>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  mapTheme: state.map.mapTheme,
});

export default connect(mapStateToProps, undefined)(ShowCoordinates);
