import React from "react";
import { Col, Row } from "@paljs/ui";
import { css, styled } from "styled-components";
import MapPolygon from "./MapPolygon";
import "leaflet-draw/dist/leaflet.draw.css";

const ContainerRow = styled(Row)`
  ${({ theme, color }) => css`
    .leaflet-container {
      font-family: ${theme.fontFamilyPrimary} !important;
    }

    .leaflet-marker-icon {
      background-color: ${color} !important;
      border: none !important;
      border-radius: 50%;
    }
  `}

  .leaflet-top .leaflet-control {
    margin-top: 10px;
    margin-right: 10px;
  }

  .leaflet-control:not(:first-child) {
    margin-right: 50px !important;
  }

  .leaflet-control-scale-line:not(:first-child) {
    border-top: none !important;
    margin-top: 3px;
    border-bottom: 2px solid #2272b3;
  }

  .leaflet-control-scale-line {
    border-left: 2px solid #2272b3;
    border-bottom: 2px solid #2272b3;
    border-right: 2px solid #2272b3;
    color: rgb(34, 43, 69);
  }

  .leaflet-control-scale {
    display: flex;
    flex-direction: column;
    align-items: end;
    bottom: 40px;
  }

  .leaflet-touch .leaflet-bar a {
    line-height: 30px !important;
  }

  input {
    line-height: 0.5rem;
  }
`;

export default function MapContentFence(props) {
  const { color, fenceReference, onChangeRef, dataInitial } = props;

  const onChangeMap = (geoJson) => {
    onChangeRef('location', geoJson)
  }

  return <>
    <ContainerRow color={color}>
      <Col breakPoint={{ md: 12 }} className="mt-5">
        <MapPolygon
          dataInitial={dataInitial}
          onChangeMap={onChangeMap}
          color={color}
          fenceReference={fenceReference}
        />
      </Col>
      {/* <Col breakPoint={{ md: 12 }} className="mt-4 pt-2">
        {coordinates?.map((coordinate, i) => {
          const dms = getCoordinates(coordinate);
          return (
            <Row key={`coo-${i}`} className="mb-2 mr-2 ml-2">
              <Col breakPoint={{ md: 11 }}>
                {circleRadius ? <LabelIcon
                  title={<FormattedMessage id="center" />}
                  iconName="pin-outline"
                /> : <></>}
                <Row>
                  <Col breakPoint={{ md: 6 }} className="mb-2">
                    <InputGroup fullWidth>
                      <InputDecimal
                        sizeDecimals={10}
                        placeholder={intl.formatMessage({
                          id: "latitude",
                        })}
                        onChange={(v) => onChangeCoordinate(i, 0, v)}
                        value={
                          coordinate?.length ? coordinate[0] : ""
                        }
                      />
                    </InputGroup>
                    <TextSpan
                      hint
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                      apparence="s2"
                    >
                      {dms?.getLatitude()?.toString()}
                    </TextSpan>
                  </Col>

                  <Col breakPoint={{ md: 6 }} className="mb-2">
                    <InputGroup fullWidth>
                      <InputDecimal
                        sizeDecimals={10}
                        placeholder={intl.formatMessage({
                          id: "longitude",
                        })}
                        onChange={(v) => onChangeCoordinate(i, 1, v)}
                        value={
                          coordinate?.length ? coordinate[1] : ""
                        }
                      />
                    </InputGroup>
                    <TextSpan
                      hint
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                      apparence="s2"
                    >
                      {dms?.getLongitude()?.toString()}
                    </TextSpan>
                  </Col>
                </Row>
              </Col>
              {/* {!circleRadius ?
                <Col
                  breakPoint={{ md: 1 }}
                  className="col-flex-center pb-4"
                >
                  <Button
                    status="Danger"
                    size="Tiny"
                    className="mb-4"
                    style={{ padding: 4 }}
                    onClick={() => onRemoveItem(i)}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col> :
                <></>}
            </Row>
          );
        })}
        {/* {!circleRadius ?
          <div className="col-flex-center">
            <Button
              size="Tiny"
              status="Success"
              className="mb-2 flex-between"
              onClick={addCoordinates}
              disabled={getIsDisabledCoordinates()}
            >
              <EvaIcon name="plus-circle-outline" className="mr-1" />
              <FormattedMessage id="add.coordinate" />
            </Button>
          </div>
          : <></>}
      </Col>
      {
        (circleRadius && coordinates?.length) ?
          <Col>
            <Row key="radius-input" className="mb-2 mr-2 ml-2">
              <Col breakPoint={{ md: 11 }}>
                <Row>
                  <Col breakPoint={{ md: 6 }} className="mb-2">
                    <LabelIcon
                      title={<FormattedMessage id="radius" />}
                      iconName="radio-button-off-outline"
                    />
                    <InputGroup fullWidth>
                      <InputDecimal
                        sizeDecimals={10}
                        placeholder={intl.formatMessage({
                          id: "radius",
                        })}
                        onChange={(v) => onChangeRadius(v)}
                        value={
                          circleRadius ? circleRadius : ""
                        }
                      />
                    </InputGroup>
                    <TextSpan
                      hint
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                      apparence="s2"
                    >
                      {`${roundDecimals(circleRadius).toString()} m`}
                    </TextSpan>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          :
          <></>
      } */}

    </ContainerRow>
  </>
}
