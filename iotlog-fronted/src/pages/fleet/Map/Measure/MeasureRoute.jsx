import { connect } from "react-redux";
import { Button, CardBody, CardFooter, CardHeader, EvaIcon, InputGroup, Row, Sidebar, SidebarBody } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { nanoid } from "nanoid";
import { useState } from "react";
import { convertDistance, getPathLength } from "geolib";
import { Route2, Tacometer } from "../../../../components/Icons";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { setIsShowMeasureLine, setUnitMeasureLine } from "../../../../actions";
import { CardNoShadow, LabelIcon, Modal, TextSpan } from "../../../../components";

const TextBgStyled = styled(TextSpan)`
  ${({ status, theme }) => css`
  background-color: ${theme[`color${status}500`]}15;
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0.09rem 0.25rem;
  border-radius: 0.25rem;
`}`

const ColStyled = styled.div`
  display: flex;
  flex-direction: column;
`

const SidebarDetailsStyled = styled(Sidebar)`
  width: 15rem;
  ${({ theme, isShowList = false }) => css`
    left: ${isShowList ? "24rem" : "5rem"};

    background-color: ${theme.backgroundBasicColor1}ee;
    border: 1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3};

    div {
      background-color: transparent !important;
    }
  `}
  position: absolute;
  top: 5rem;
  z-index: 1010;
  border-radius: 12px;
  height: 80%;

  .main-container {
    width: 100%;
    height: calc(100vh - 180px);
  }

  .scrollable {
    padding: 0;
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    left: 0;
    z-index: 1099;
    width: 100%;

    .btn-aside-mobile-details-fleet {
      visibility: visible;
    }
  }

  @media only screen and (max-width: 768px) and (min-width: 601px) {
    position: absolute;
    right: 0;
    z-index: 1099;
    width: 50%;

    .btn-aside-mobile-details-fleet {
      visibility: visible;
    }
  }

  @media only screen and (min-width: 769px) {
    .btn-aside-mobile-details-fleet {
      visibility: hidden;
      width: 0px;
    }
  }
`;

function MeasureRoute(props) {

  const [showModal, setShowModal] = useState(false);
  const [speed, setSpeed] = useState(10);

  const theme = useTheme();
  const intl = useIntl();

  const { isShowMeasureLine,
    pointsMeasureLine,
    unitMeasureLine,
    setUnitMeasureLine
  } = props;

  const getDistance = (points) => {
    return floatToStringExtendDot(getDistancesInUnit(points), 2);
  };

  const getDistancesInUnit = (points) => {
    const distance = getPathLength(points);
    const distanceUnit = unitMeasureLine === "nm" ? "sm" : "km";

    return convertDistance(distance, distanceUnit);
  }

  const changeUnit = () => {
    setUnitMeasureLine((unitMeasureLine === "nm" ? "km" : "nm"));
  };

  return (
    <>
      {isShowMeasureLine &&
        <SidebarDetailsStyled
          isShowList={props.isShowList}
          key={`sds-c-${nanoid(4)}`}
        >
          <SidebarBody>
            <CardNoShadow
              style={{ borderRadius: 0, borderBottom: 0 }}
              className="mb-0">
              <CardHeader>
                <Row around="xs" middle="xs" className="pb-2">
                  <TextSpan apparence="s1">
                    Line
                  </TextSpan>
                  <Row className="m-0" middle="xs">
                    <Button
                      size="Tiny"
                      appearance="ghost"
                      className="row-flex-center"
                      onClick={changeUnit}
                    >
                      <EvaIcon name="edit-outline" />
                      {unitMeasureLine}
                    </Button>
                    <Button
                      size="Tiny"
                      appearance="ghost"
                      className="row-flex-center"
                      onClick={() => setShowModal(true)}
                    >
                      <Tacometer
                        style={{
                          height: 12,
                          width: 12,
                          color: theme.colorPrimary600,
                          margin: "5px",
                        }}
                      />
                      {speed} knots
                    </Button>
                  </Row>
                </Row>
              </CardHeader>
              {!!pointsMeasureLine?.length &&
                <CardBody className="mb-0 p-0">
                  {pointsMeasureLine?.map((data, line) => (
                    <Row key={line} style={{ width: "100%" }} className="m-0">
                      <CardNoShadow style={{
                        padding: 0,
                        marginLeft: -10,
                        marginRight: -10,
                      }}>
                        <CardBody className="p-0 m-0">
                          <Row middle="xs" between="xs" className="m-0">
                            <TextSpan apparence="p2" className="mb-3">
                              <FormattedMessage id="route" />
                              {` ${line + 1}`}
                            </TextSpan>
                            <TextBgStyled
                              className="mb-2"
                              apparence="p2">
                              <Route2
                                style={{
                                  height: 15,
                                  width: 16,
                                  fill: theme.colorPrimary500,
                                }}
                              />
                              <span style={{
                                color: theme.colorPrimary500,
                              }} className="mr-1">
                                {" " + floatToStringExtendDot(getDistancesInUnit(data.points), 2) + ` ${unitMeasureLine}`}
                              </span>
                            </TextBgStyled>
                          </Row>
                          <Row
                            style={{
                              flexWrap: "nowrap",
                            }}
                            between="xs" className="pb-3 m-0">
                            <TextBgStyled apparence="p2"
                              status="Info"
                              className="mr-1"
                            >
                              <EvaIcon name="clock-outline" className="mr-1" />
                              {data?.points?.length && speed
                                ? floatToStringExtendDot(
                                  convertDistance(
                                    getPathLength(data.points),
                                    "sm"
                                  ) / speed,
                                  1
                                )
                                : 0}{" "}
                              HR
                            </TextBgStyled>
                            <TextBgStyled apparence="p2"
                              status="Warning"
                            >
                              <EvaIcon name="calendar-outline" className="mr-1" />
                              {data?.points?.length && speed
                                ? floatToStringExtendDot(
                                  (convertDistance(
                                    getPathLength(data.points),
                                    "sm"
                                  ) / speed) / 24,
                                  1
                                )
                                : 0}{" "}
                              <FormattedMessage id="days" />
                            </TextBgStyled>
                          </Row>
                          {data?.points?.map((points, row) => (
                            <Row key={`${line}-${row}`} top="xs" className={row < data?.points?.length - 1 ? "mb-3" : ""}>
                              <EvaIcon name="pin"
                                options={{
                                  height: 16,
                                }}
                                status="Basic" className="mr-1" />
                              <ColStyled style={{ marginTop: -0.9 }}>
                                <TextSpan apparence="c2">
                                  <FormattedMessage id="point" />
                                  {` ${row + 1}`}
                                </TextSpan>
                                {row > 0 && <TextSpan apparence="p3" hint>
                                  <FormattedMessage id="from.start" />:{" "}
                                  <TextSpan apparence="p2" hint className="ml-1">
                                    {getDistance(data.points.slice(0, row + 1))}
                                  </TextSpan>
                                  {unitMeasureLine}
                                </TextSpan>}
                                {row > 0 && <TextSpan apparence="p3" hint>
                                  <FormattedMessage id="from.previous" />:{" "}
                                  <TextSpan apparence="p2" hint className="ml-1">
                                    {getDistance(
                                      data.points.slice(row - 1, row + 1)
                                    )}
                                  </TextSpan>
                                  {unitMeasureLine}
                                </TextSpan>}

                                {!!(data.points.length > row + 1) && <TextSpan apparence="p3" hint>
                                  <FormattedMessage id="to.next" />:{" "}
                                  <TextSpan apparence="p2" hint className="ml-1">
                                    {getDistance(data.points.slice(row, row + 2))}
                                  </TextSpan>
                                  {unitMeasureLine}
                                </TextSpan>}
                              </ColStyled>

                            </Row>
                          ))}
                        </CardBody>
                      </CardNoShadow>
                    </Row>))}
                </CardBody>}
            </CardNoShadow>
          </SidebarBody>
        </SidebarDetailsStyled>}
      <Modal
        show={showModal}
        size="Small"
        onClose={() => setShowModal(false)}
        title={"speed"}
        hideOnBlur={true}
        renderFooter={() => (
          <CardFooter>
            <Row className="m-0" end="xs">
              <Button
                size="Small"
                onClick={() => setShowModal(false)}
              >
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <LabelIcon
          title={`${intl.formatMessage({ id: "speed" })} (knots)`}
        />
        <InputGroup fullWidth>
          <input
            type="number"
            onChange={(e) => setSpeed(e.target.value)}
            value={speed}
          />
        </InputGroup>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  isShowMeasureLine: state.map.isShowMeasureLine,
  pointsMeasureLine: state.map.pointsMeasureLine,
  unitMeasureLine: state.map.unitMeasureLine,
  isShowList: state.fleet.isShowList,
});

const mapDispatchToProps = (dispatch) => ({
  setIsShowMeasureLine: (isLoading) => {
    dispatch(setIsShowMeasureLine(isLoading));
  },
  setUnitMeasureLine: (unit) => {
    dispatch(setUnitMeasureLine(unit));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MeasureRoute);
