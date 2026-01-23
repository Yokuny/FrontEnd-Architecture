import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Col,
  Popover,
  Radio,
  Row,
  Spinner,
} from "@paljs/ui";
import { DivIcon } from "leaflet";
import moment from "moment";
import { nanoid } from "nanoid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { Divide, Fetch, LabelIcon, TextSpan } from "../../../../components";
import { Route } from "../../../../components/Icons";
import {
  formatDateDiff,
  getLatLonNormalize,
  normalizeDataPosition,
} from "../../../../components/Utils";

const SpinnerStyled = styled(Spinner)`
  position: relative;
  background-color: transparent;
`;

const DivRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonsContainer = styled.div`
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

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
  }
`;

const normalizeRoute = (sensorStates) => {
  return normalizeDataPosition(sensorStates)?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
};

var polylines = [];
var transmissionsPoints = [];

const ShowRoute = (props) => {
  const theme = useTheme();
  const intl = useIntl();
  const [isShowPoints, setIsShowPoints] = React.useState(false);
  const [hourPosition, setHourPosition] = React.useState(12);
  const [interval, setInterval] = React.useState(30);
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  const getButtonStyle = (isActive = false) => ({
    padding: 0,
    boxShadow: `0px 2px 8px ${theme.shadowColor || "rgba(0, 0, 0, 0.05)"}`,
    border: `1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3}`,
    borderRadius: "0.4rem",
    height: "35px",
    width: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    background: isActive ? theme.colorInfo500 : theme.backgroundBasicColor1,
    color: isActive ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  React.useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  React.useLayoutEffect(() => {
    clearPolylines();
    let time;
    if (props.machineDetailsSelected)
      time = setTimeout(() => {
        getData();
      }, 500);
    return () => {
      if (time) clearTimeout(time);
    }
  }, [hourPosition, interval]);

  React.useLayoutEffect(() => {
    clearPolylines();
    let time;
    if (props.machineDetailsSelected)
      time = setTimeout(() => {
        getData();
      }, 1000);
    return () => {
      if (time) clearTimeout(time);
    }
  }, [props.machineDetailsSelected]);

  React.useEffect(() => {
    if (isReady) {
      clearMarkers();
      clearPolylines();
      mountPolyLine(data);
    }
  }, [isShowPoints]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/fleet/routehistory?idMachine=${props.machineDetailsSelected.machine.id}&hours=${hourPosition}&interval=${interval}`
    )
      .then((response) => {
        mountPolyLine(response.data);
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const clearPolylines = () => {
    if (window._lmap && polylines?.length) {
      for (let i = 0; i < polylines.length; i++) {
        window._lmap.removeLayer(polylines[i]);
      }
      polylines = [];
    }
  };

  const mountPolyLine = (data) => {
    const routeHistory = data?.length ? normalizeRoute(data) : [];
    const polyline = window.L.polyline(
      routeHistory?.map((x) => getLatLonNormalize(x.position)),
      {
        color: theme.textDangerColor,
      }
    ).addTo(window._lmap);
    polylines?.push(polyline);

    if (isShowPoints) {
      routeHistory.forEach((x) => {
        const marker = window.L.marker(
          getLatLonNormalize(x.position),
          {
            id: props.machineDetailsSelected.machine.id,
            icon: new DivIcon({
              className: "leaflet-div-icon-img",
              iconSize: [25,25],
              html: `<svg fill="#fff" style="background-color:${theme.colorDanger700};display: flex;padding: 2px;border-radius: 50%;" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="radio"><rect width="24" height="24" opacity="0"/><path d="M12 8a3 3 0 0 0-1 5.83 1 1 0 0 0 0 .17v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 0-.17A3 3 0 0 0 12 8zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"/><path d="M3.5 11a6.87 6.87 0 0 1 2.64-5.23 1 1 0 1 0-1.28-1.54A8.84 8.84 0 0 0 1.5 11a8.84 8.84 0 0 0 3.36 6.77 1 1 0 1 0 1.28-1.54A6.87 6.87 0 0 1 3.5 11z"/><path d="M16.64 6.24a1 1 0 0 0-1.28 1.52A4.28 4.28 0 0 1 17 11a4.28 4.28 0 0 1-1.64 3.24A1 1 0 0 0 16 16a1 1 0 0 0 .64-.24A6.2 6.2 0 0 0 19 11a6.2 6.2 0 0 0-2.36-4.76z"/><path d="M8.76 6.36a1 1 0 0 0-1.4-.12A6.2 6.2 0 0 0 5 11a6.2 6.2 0 0 0 2.36 4.76 1 1 0 0 0 1.4-.12 1 1 0 0 0-.12-1.4A4.28 4.28 0 0 1 7 11a4.28 4.28 0 0 1 1.64-3.24 1 1 0 0 0 .12-1.4z"/><path d="M19.14 4.23a1 1 0 1 0-1.28 1.54A6.87 6.87 0 0 1 20.5 11a6.87 6.87 0 0 1-2.64 5.23 1 1 0 0 0 1.28 1.54A8.84 8.84 0 0 0 22.5 11a8.84 8.84 0 0 0-3.36-6.77z"/></g></g></svg>`,
            }),
          }
        ).addTo(window._lmap);

        marker.bindTooltip(
          `<span style="font-weight: 600;font-size: 0.8rem;">
            ${formatDateDiff(x.date, intl)}
          </span><br/><span>${moment(x.date).format(
            "DD MMM / HH:mm:ss"
          )}</span>`
        );

        transmissionsPoints.push(marker);
      });
    }
  };

  const clearMarkers = () => {
    if (window._lmap && transmissionsPoints?.length) {
      for (let i = 0; i < transmissionsPoints.length; i++) {
        window._lmap.removeLayer(transmissionsPoints[i]);
      }
      transmissionsPoints = [];
    }
  };

  return (
    <>
      {props.machineDetailsSelected && (
        <ButtonsContainer theme={theme}>
          {!isLoading ? (
            <Popover
              trigger="click"
              placement="left"
              overlay={
                <>
                  <Card
                    style={{ marginTop: 30, marginBottom: 0, maxWidth: 280 }}
                  >
                    <CardHeader>
                      <TextSpan apparence="s1">
                        <FormattedMessage id="route" />
                      </TextSpan>
                    </CardHeader>
                    <CardBody style={{ padding: 0 }}>
                      <Row style={{ margin: 0 }}>
                        <Col breakPoint={{ md: 12 }} className="mt-1 mb-1">
                          <LabelIcon
                            iconName="navigation-2-outline"
                            renderIcon={() => (
                              <Route
                                style={{
                                  height: 13,
                                  width: 13,
                                  fill: theme.textHintColor,
                                  marginRight: 5,
                                  marginTop: 2,
                                }}
                              />
                            )}
                            title={<FormattedMessage id="last.positions" />}
                          />
                        </Col>
                        <Col breakPoint={{ md: 12 }} className="mb-2">
                          <Radio
                            className="ml-3"
                            onChange={(value) => setHourPosition(value)}
                            key={nanoid()}
                            options={[
                              {
                                label: "12 HR",
                                value: 12,
                                checked: 12 == hourPosition,
                              },
                              {
                                label: "24 HR",
                                value: 24,
                                checked: 24 == hourPosition,
                              },
                              {
                                label: "48 HR",
                                value: 48,
                                checked: 48 == hourPosition,
                              },
                            ]}
                          />
                        </Col>

                        <Divide style={{ width: "100%" }} />
                        <div className="pl-3 mt-1 mb-2">
                          <LabelIcon
                            iconName="clock-outline"
                            title={<FormattedMessage id="interval" />}
                          />
                          <Col breakPoint={{ md: 12 }} className="mb-1">
                            <Radio
                              onChange={(value) => setInterval(value)}
                              key={nanoid()}
                              options={[
                                {
                                  label: `1 ${intl.formatMessage({
                                    id: `minute`,
                                  })}`,
                                  value: 1,
                                  checked: 1 == interval,
                                },
                                {
                                  label: `15 ${intl.formatMessage({
                                    id: `minutes`,
                                  })}`,
                                  value: 15,
                                  checked: 15 == interval,
                                },
                                {
                                  label: `30 ${intl.formatMessage({
                                    id: `minutes`,
                                  })}`,
                                  value: 30,
                                  checked: 30 == interval,
                                },
                              ]}
                            />
                          </Col>
                        </div>

                        <Divide style={{ width: "100%" }} />
                        <div className="pl-3 mt-1 mb-2">
                          <LabelIcon
                            iconName="eye-outline"
                            title={<FormattedMessage id="display" />}
                          />
                          <Col breakPoint={{ md: 12 }} className="mb-1">
                            <Checkbox
                              className="mt-1"
                              checked={isShowPoints}
                              onChange={() =>
                                setIsShowPoints((prevState) => !prevState)
                              }
                            >
                              <TextSpan apparence="s2">
                                <FormattedMessage id="show.points.transmission" />
                              </TextSpan>
                            </Checkbox>
                          </Col>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </>
              }
            >
              <Button
                size="Medium"
                status="Control"
                style={getButtonStyle(false)}
              >
                <TextSpan apparence="c2" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                  {hourPosition}HR
                </TextSpan>
              </Button>
            </Popover>
          ) : (
            <DivRow>
              <SpinnerStyled />
            </DivRow>
          )}
        </ButtonsContainer>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
});

export default connect(mapStateToProps, undefined)(ShowRoute);
