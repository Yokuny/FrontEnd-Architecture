import { Badge, Button, Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import Skeleton from "react-loading-skeleton";
import { Fetch, LabelIcon, TextSpan } from "../../../../components";
import { Ocean, Route2, Tacometer } from "../../../../components/Icons";
import Proximity from "../../Proximity";
import { getStatusIcon } from "../../Status/Base";
import { useFormatDecimal } from "../../../../components/Formatter";
import { DateDiff } from "../../../../components/Date/DateDiff";
import ButtonsSider from "./ButtonsSider";
import CIIDetails from "./CIIDetails";
import WeatherPanel from "../Weather/WeatherPanel";

import "./style.css";
import { getIconStatusOperation } from "../../Status/Utils";

const ContainerCardInfo = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
    color: ${theme.textBasicColor};
    border-radius: 4px;
  `}

  .rotate-hz {
    transform: rotate(90deg);
  }
`;

const Image = styled.img`
  object-fit: cover;
`;

const ContentEmpty = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.borderBasicColor5};
    width: 100%;
    height: 160px;
  `}
`;

const ButtonOpenDetails = styled(Button)`
  padding-top: 3px;
  padding-bottom: 3px;
`;

const ButtonOpenConsumption = styled(Button)`
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 5px;
  padding-right: 5px;
`;

const RowCenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ContentFixed = styled.div`
  position: fixed;
  top: 171px;
`;

const PopUpDetails = (props) => {
  const intl = useIntl();
  const theme = useTheme();

  const { format } = useFormatDecimal();

  const { machineDetails, positionItem, hasPermissionViewCII } = props;

  const [details, setDetails] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [operation, setOperation] = React.useState();

  React.useEffect(() => {
    if (!machineDetails?.machine?.id) return;
    getDetails(machineDetails?.machine?.id);
  }, [machineDetails?.machine?.id]);

  const getDetails = async (idAsset) => {
    setIsLoading(true);
    try {
      const response = await Fetch.get(`/travel/machine?idMachine=${idAsset}`);
      if (response.data) {
        setDetails(response.data);
      }
      const responseMachine = await Fetch.get(`/status/find/${idAsset}`)
      if (responseMachine.data) {
         setOperation(response.data?.status);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getPortCodeName = (port) => {
    return `${port?.code} - ${port?.description}`;
  };

  const getDestinyPreference = (detailsInternal) => {
    const dataEta =
      detailsInternal?.travel?.metadata?.eta || detailsInternal?.data?.eta;
    if (!dataEta || moment(dataEta).isBefore(moment())) return "-";

    if (detailsInternal?.travel?.portPointDestiny) {
      return getPortCodeName(detailsInternal?.travel?.portPointDestiny);
    }

    if (detailsInternal?.travel?.portPointEnd) {
      return getPortCodeName(detailsInternal?.travel?.portPointEnd);
    }

    if (detailsInternal?.data?.destiny) return detailsInternal?.data?.destiny;

    return "-";
  };

  const getEta = (detailsInternal) => {
    const dataEta =
      detailsInternal?.travel?.metadata?.eta || detailsInternal?.data?.eta;
    if (!dataEta || moment(dataEta).isBefore(moment())) return "-";

    if (detailsInternal?.travel?.portPointDestiny) {
      return (
        <>
          {moment(dataEta).format("DD MMM")} {moment(dataEta).format("HH:mm")}
          {" - "}
          <TextSpan apparence="s1">
            {detailsInternal?.travel?.portPointDestiny?.code}
          </TextSpan>
        </>
      );
    }

    if (detailsInternal?.travel?.portPointEnd) {
      return (
        <>
          {moment(dataEta).format("DD MMM")} {moment(dataEta).format("HH:mm")}
          {" - "}
          <TextSpan apparence="s1">
            {detailsInternal?.travel?.portPointEnd?.code}
          </TextSpan>
        </>
      );
    }

    return `${moment(dataEta).format("DD MMM")} ${moment(dataEta).format(
      "HH:mm"
    )}`;
  };

  const getDeparture = (detailsInternal) => {
    if (!detailsInternal?.travel?.dateTimeStart) {
      return " - ";
    }

    return (
      <>
        {moment(detailsInternal?.travel?.dateTimeStart).format("DD MMM HH:mm")}
        {" - "}
        <TextSpan apparence="s1">
          {detailsInternal?.travel?.portPointStart?.code}
        </TextSpan>
      </>
    );
  };

  const onHandleOpen = (e) => {
    e.preventDefault();
    props.onOpenDetails();
  };

  const statusToShow = getStatusIcon(details?.data?.status, theme);
  const statusOperation = getIconStatusOperation(operation);

  return (
    <>
      <ContainerCardInfo className="pt-2 pb-4 col-flex card-shadow">
        <div className="pl-2 pr-2">
          <TextSpan apparence="s1">
            {machineDetails?.machine?.code
              ? `${machineDetails?.machine?.code} - `
              : ""}
            {machineDetails?.machine?.name}
          </TextSpan>
          <Row between style={{ margin: 0 }} className="pt-1">
            {statusToShow?.bgColor && (
              <Badge
                position=""
                style={{
                  position: "inherit",
                  backgroundColor: statusToShow.bgColor,
                }}
              >
                <RowCenter>{statusToShow.component}</RowCenter>
              </Badge>
            )}

            <TextSpan apparence="c1">
              {machineDetails?.modelMachine?.description}
            </TextSpan>
          </Row>
        </div>
        <div className="mt-2" style={{ position: "relative" }}>
          {machineDetails?.machine?.image?.url ? (
            <Image
              src={machineDetails?.machine?.image?.url}
              alt={machineDetails?.machine?.name}
              width={"100%"}
              height={160}
            />
          ) : (
            <ContentEmpty />
          )}

          {statusOperation && (
            <Badge
              style={{
                position: "absolute",
                margin: "5px",
                backgroundColor: theme[statusOperation.colorTheme],
              }}
            >
              <TextSpan apparence="c2" style={{ color: "#fff" }}>
                {statusOperation.label}
              </TextSpan>
            </Badge>
          )}

          {!!props.hasPermissionViewCII && (
            <CIIDetails idMachine={machineDetails?.machine?.id} />
          )}

          <ContentFixed>
            <RowCenter>
              {details?.data?.speed !== undefined && (
                <Col className="col-flex-center">
                  <Tacometer
                    style={{
                      height: 20,
                      width: 25,
                      fill: "#fff",
                      color: "#fff",
                      marginBottom: -2,
                    }}
                  />
                  <TextSpan
                    apparence="s2"
                    className="mt-3"
                    style={{
                      color: "#fff",
                      lineHeight: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${format(details?.data?.speed, 1)} ${
                      details?.data?.unitySpeed ??
                      intl.formatMessage({
                        id: "kn",
                      })
                    }`}
                  </TextSpan>
                </Col>
              )}

              {details?.data?.draught !== undefined && (
                <Col className="col-flex-center">
                  <Ocean
                    style={{
                      height: 20,
                      width: 20,
                      fill: "#fff",
                      marginBottom: -2,
                    }}
                  />
                  <TextSpan
                    apparence="s2"
                    className="mt-3"
                    style={{
                      color: "#fff",
                      lineHeight: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${format(details?.data?.draught, 1)} m`}
                  </TextSpan>
                </Col>
              )}

              {details?.data?.course !== undefined && (
                <Col className="col-flex-center">
                  <EvaIcon
                    name="compass-outline"
                    options={{
                      height: 25,
                      width: 23,
                      fill: "#fff",
                    }}
                  />
                  <TextSpan
                    apparence="s2"
                    className="mt-3"
                    style={{
                      color: "#fff",
                      lineHeight: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${format(details?.data?.course, 1)} º`}
                  </TextSpan>
                </Col>
              )}
            </RowCenter>
          </ContentFixed>
        </div>
        <Col className="mt-3">
          <Row>
            <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
              <LabelIcon
                iconName="arrow-circle-up-outline"
                title={<FormattedMessage id="departure" />}
              />
              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? <Skeleton /> : getDeparture(details)}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
              <LabelIcon iconName="flag-outline" title="ETA" />
              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? <Skeleton /> : getEta(details)}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
              <LabelIcon
                iconName="cube-outline"
                title={<FormattedMessage id="travel" />}
              />
              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? <Skeleton /> : details?.travel?.code || "-"}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
              <LabelIcon
                iconName="navigation-2-outline"
                title={<FormattedMessage id="destiny.port" />}
              />
              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? <Skeleton /> : getDestinyPreference(details)}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 6, xs: 6 }}>
              <LabelIcon
                iconName="pin-outline"
                title={<FormattedMessage id="proximity" />}
              />
              <TextSpan apparence="s2" className="ml-1">
                {positionItem?.position?.length ? (
                  <Proximity
                    id={machineDetails?.machine?.id}
                    latitude={positionItem?.position[0]}
                    longitude={positionItem?.position[1]}
                    showFlag={true}
                  />
                ) : (
                  "-"
                )}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 6, xs: 6 }}>
              <LabelIcon
                iconName="radio-outline"
                title={<FormattedMessage id="last.date.acronym" />}
              />

              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? (
                  <Skeleton />
                ) : positionItem?.date ? (
                  <DateDiff dateInitial={positionItem?.date} />
                ) : (
                  "-"
                )}
              </TextSpan>
            </Col>

            <ButtonsSider machineDetails={props.machineDetails} />

            {window.location.pathname !== "/fleet-frame" && (
              <Col breakPoint={{ md: 12 }}>
                <Row className="mt-3">
                  <Col
                    breakPoint={{ md: 6 }}
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    <ButtonOpenDetails
                      size="Tiny"
                      status="Primary"
                      onClick={onHandleOpen}
                      className="flex-between"
                    >
                      <Route2
                        style={{
                          width: 15,
                          height: 15,
                          marginRight: "0.2rem",
                        }}
                      />
                      <FormattedMessage id="route" />
                    </ButtonOpenDetails>
                  </Col>
                  {props.hasPermissionViewConsumeDetails && (
                    <Col
                      breakPoint={{ md: 6 }}
                      style={{ justifyContent: "center", display: "flex" }}
                    >
                      <ButtonOpenConsumption
                        size="Tiny"
                        status="Info"
                        onClick={(e) => {
                          e.preventDefault();
                          props.onOpenDetailsConsume();
                        }}
                        className="flex-between"
                      >
                        <EvaIcon name="droplet-outline" className="mr-1" />
                        <FormattedMessage id="consume" />
                      </ButtonOpenConsumption>
                    </Col>
                  )}
                </Row>
              </Col>
            )}
          </Row>
          {positionItem?.position?.length && (
            <WeatherPanel
              latitude={positionItem?.position[0]}
              longitude={positionItem?.position[1]}
            />
          )}
        </Col>
      </ContainerCardInfo>
    </>
  );
};

export default PopUpDetails;
