import { Button, Card, CardBody, CardHeader, Checkbox, Col, Popover, Radio, Row, Spinner } from "@paljs/ui";
import { nanoid } from "nanoid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { setFilterMapRouter, setIsShowPoints, setIsShowPreditionRoute, setMapRouter } from "../../../../actions";
import { Divide, LabelIcon, TextSpan } from "../../../../components";
import { Route } from "../../../../components/Icons";

const SpinnerStyled = styled(Spinner)`
  position: relative;
  background-color: transparent;
`;

const DivRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RouterOptions = (props) => {
  const theme = useTheme();
  const intl = useIntl();

  const { hourPosition, interval, isLoading } = props;

  const getButtonStyle = (isActive = false) => ({
    padding: 0,
    fontSize: "0.6rem",
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

  const onChangeMapRouter = (dataRouter) => {
    if (props.filterRouter) {
      props.setFilterMapRouter(undefined);
    }
    props.setMapRouter(dataRouter);
  };

  const hasPermissionViewerPredicate = props.items?.some((x) => x === "/view-predicate-route");

  return (
    <>
      <div>
        {!isLoading ? (
          <div>
            <Popover
              trigger="click"
              placement="left"
              overlay={
                <>
                  <Card style={{ marginTop: 0, marginBottom: 0, maxWidth: 280 }}>
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
                                  marginBottom: 2,
                                }}
                              />
                            )}
                            title={<FormattedMessage id="last.positions" />}
                          />
                        </Col>
                        <Col breakPoint={{ md: 12 }} className="mb-2">
                          <Radio
                            className="ml-3"
                            onChange={(value) => onChangeMapRouter({ hourPosition: value })}
                            key={nanoid()}
                            options={[
                              {
                                label: "12 HR",
                                value: 12,
                                checked: 12 === hourPosition,
                              },
                              {
                                label: "24 HR",
                                value: 24,
                                checked: 24 === hourPosition,
                              },
                              {
                                label: "48 HR",
                                value: 48,
                                checked: 48 === hourPosition,
                              },
                            ]}
                          />
                        </Col>

                        <Divide style={{ width: "100%" }} />
                        <div className="pl-3 mt-1 mb-2">
                          <LabelIcon iconName="clock-outline" title={<FormattedMessage id="interval" />} />
                          <Col breakPoint={{ md: 12 }} className="mb-1">
                            <Radio
                              onChange={(value) => onChangeMapRouter({ interval: value })}
                              key={nanoid()}
                              options={[
                                {
                                  label: `1 ${intl.formatMessage({
                                    id: `minute`,
                                  })}`,
                                  value: 1,
                                  checked: 1 === interval,
                                },
                                {
                                  label: `15 ${intl.formatMessage({
                                    id: `minutes`,
                                  })}`,
                                  value: 15,
                                  checked: 15 === interval,
                                },
                                {
                                  label: `30 ${intl.formatMessage({
                                    id: `minutes`,
                                  })}`,
                                  value: 30,
                                  checked: 30 === interval,
                                },
                              ]}
                            />
                          </Col>
                        </div>

                        <Divide style={{ width: "100%" }} />
                        <div className="pl-3 mt-1 mb-2">
                          <LabelIcon iconName="eye-outline" title={<FormattedMessage id="display" />} />
                          <Col breakPoint={{ md: 12 }} className="mb-1">
                            <Checkbox
                              className="mt-1"
                              checked={props.isShowPoints}
                              onChange={() => props.setIsShowPoints(!props.isShowPoints)}>
                              <TextSpan apparence="s2">
                                <FormattedMessage id="show.points.transmission" />
                              </TextSpan>
                            </Checkbox>
                          </Col>

                          {hasPermissionViewerPredicate && (
                            <Col breakPoint={{ md: 12 }} className="mb-1">
                              <Checkbox
                                className="mt-1"
                                checked={props.isShowPredicitonRoute}
                                onChange={() => props.setIsShowPreditionRoute(!props.isShowPredicitonRoute)}>
                                <TextSpan apparence="s2">
                                  <FormattedMessage id="view.predicate.route" />
                                </TextSpan>
                              </Checkbox>
                            </Col>
                          )}
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </>
              }>
              <Button style={getButtonStyle(false)} size="Medium" status="Control">
                {props.filterRouter ? "" : hourPosition} hr
              </Button>
            </Popover>

            {/* <Popover className="mt-2">
              import { setIsShowWeatherRoute } from "../../../../actions/map.actions";

              <Button
                style={{ padding: 6, marginBottom: 0.8, height: 35 }}
                size="Small"
                status={props.isShowWeatherRoute ? "Info" : "Basic"}
                onClick={() =>
                  props.setIsShowWeatherRoute(!props.isShowWeatherRoute)
                }
              >
                <EvaIcon name="sun-outline" />
              </Button>
            </Popover> */}
          </div>
        ) : (
          <DivRow className="mt-2">
            <SpinnerStyled />
          </DivRow>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  mapTech: state.map.mapTech,
  isShowPoints: state.map.isShowPoints,
  interval: state.map.router?.interval,
  hourPosition: state.map.router?.hourPosition,
  isLoading: state.map.routerIsLoading,
  filterRouter: state.map.filterRouter,
  isShowPredicitonRoute: state.map.isShowPredicitonRoute,
  items: state.menu.items,
});

const mapDispatchToProps = (dispatch) => ({
  setMapRouter: (router) => {
    dispatch(setMapRouter(router));
  },
  setFilterMapRouter: (filterRouter) => {
    dispatch(setFilterMapRouter(filterRouter));
  },
  setIsShowPoints: (isShowPoints) => {
    dispatch(setIsShowPoints(isShowPoints));
  },
  setIsShowPreditionRoute: (isShow) => {
    dispatch(setIsShowPreditionRoute(isShow));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RouterOptions);
