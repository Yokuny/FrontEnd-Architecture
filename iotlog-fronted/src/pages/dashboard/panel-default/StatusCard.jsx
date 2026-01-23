import { Badge, Col, Row, Tooltip } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import React from "react";
import { getIconStatusOperation } from "../../fleet/Status/Utils";
import { getStatusIcon } from "../../fleet/Status/Base";
import { Fetch, TextSpan } from "../../../components";

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
`;

const sensorsDefault = [
  "statusNavigation",
  "speed",
  "heading",
  "eta",
  "gps",
  "destination",
  "draught",
  "course",
  "cog"
];

const StatusCard = (props) => {

  const { idMachine } = props;
  const [statusOperation, setStatusOperation] = React.useState(false);

  const theme = useTheme();

  React.useEffect(() => {
    if (idMachine) {
      getStatusOperation(idMachine);
    }
  }, [idMachine]);

  if (props.isLoading) {
    return null;
  }

  const getStatusOperation = (idMachine) => {
    Fetch.get(`/assetstatus/lastoperation/${idMachine}`)
      .then((response) => {
        if (response.data)
          setStatusOperation(response.data);
      })
      .catch((error) => {

      });
  }

  const statusToShow = getStatusIcon(props.listLastState
    ?.find(
      (x) =>
        x.idMachine === idMachine &&
        x.idSensor === "statusNavigation"
    )?.value, theme);

  const detailsStatus = getIconStatusOperation(statusOperation?.status)

  const lastGPS = props.listLastState
    ?.find(
      (x) =>
        x.idMachine === idMachine &&
        x.idSensor === "gps"
    )?.date;

  const lastIAS = props.listLastState
    ?.find(
      (x) =>
        x.idMachine === idMachine &&
        !sensorsDefault.includes(x.idSensor)
    )?.date;

  return (<>
    <Col breakPoint={{ md: 3 }}>
      <Row className="m-0" end="xs">
        {!!lastGPS && <TextSpan apparence="p3" hint>
          <FormattedMessage id="last.date.acronym" /> (GPS): {moment(lastGPS).format("HH:mm:ss DD/MMM/YYYY")}
        </TextSpan>}
        {!!lastIAS && <TextSpan apparence="p3" hint>
          <FormattedMessage id="last.date.acronym" /> (IAS): {moment(lastIAS).format("HH:mm:ss DD/MMM/YYYY")}
        </TextSpan>}
      </Row>
    </Col>
    <Col breakPoint={{ md: 3 }} style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}>
      {statusToShow?.bgColor && (<Row className="m-0" end="xs" middle="xs">
        <TextSpan apparence="p3" hint className="mr-1">
          <FormattedMessage id="mode.navigation" />:
        </TextSpan>
        <Badge
          position=""
          style={{
            position: "inherit",
            backgroundColor: statusToShow.bgColor,
          }}
        >
          <RowFlex>{statusToShow.component}</RowFlex>
        </Badge>
      </Row>)}
      {detailsStatus &&
        <>
          {statusOperation?.description
            ? (
              <Tooltip
                trigger="hint"
                placement="top"
                content={
                  <TextSpan apparence="p2">
                    {statusOperation?.description}
                  </TextSpan>
                }
              >
                <Row className="m-0" end="xs" middle="xs">
                  <TextSpan apparence="p3" hint className="mr-1">
                    <FormattedMessage id="status" />:
                  </TextSpan>
                  <RowFlex>{detailsStatus.icon}
                    <TextSpan apparence="c2"
                      className="ml-1"
                      style={{
                        textTransform: 'uppercase',
                      }}>
                      {detailsStatus.label}
                    </TextSpan>
                  </RowFlex>
                </Row>
              </Tooltip>)
            : <Row className="m-0" end="xs" middle="xs">
              <TextSpan apparence="p3" hint className="mr-1">
                <FormattedMessage id="status" />:
              </TextSpan>
              <RowFlex>{detailsStatus.icon}
                <TextSpan apparence="c2"
                  className="ml-1"
                  style={{
                    textTransform: 'uppercase',
                  }}>
                  {detailsStatus.label}
                </TextSpan>
              </RowFlex>
            </Row>}
        </>}
    </Col>

  </>)
}

const mapStateToProps = (state) => ({
  listLastState: state.sensorState.listLastState,
  isLoading: state.sensorState.isLoading,
});

export default connect(mapStateToProps, undefined)(StatusCard);
