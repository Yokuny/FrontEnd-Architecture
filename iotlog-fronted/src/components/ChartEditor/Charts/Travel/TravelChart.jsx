import { Badge, Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import { TYPE_TRAVEL } from "../../../../constants";
import TextSpan from "../../../Text/TextSpan";
import { ContentChart } from "../../Utils";

export default function TravelChart(props) {
  const { lastTravel, data } = props;

  const divBoxRef = React.useRef();

  const [height, setHeight] = React.useState();

  React.useEffect(() => {
    if (divBoxRef.current) {
      setHeight(divBoxRef.current.offsetHeight);
    }
  }, [divBoxRef]);

  const isManeuver = lastTravel?.travelType === TYPE_TRAVEL.MANEUVER;

  return (
    <ContentChart className="card-shadow" ref={divBoxRef}>
      {data?.title && (
        <TextSpan apparence="s2" className="mt-1">
          {data?.title}
        </TextSpan>
      )}

      {lastTravel && height > 160 && (
        <Col>
          {isManeuver ? (
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "row",
                justifyContent: "center",
              }}
              className="mb-4 mt-1"
            >
              <img
                src={
                  require("../../../../assets/img/download_ship.png")
                }
                alt="download ship"
                style={{
                  heigth: "40%",
                  width: "40%",
                  objectFit: "cover",
                }}
              />
            </div>
          ) : (
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: require(`./../../../../assets/lotties/norsul_ship.json`),
              }}
              style={{
                flexGrow: 1,
              }}
              isPaused={false}
              isStopped={false}
              height="100%"
              width="70%"
            />
          )}
        </Col>
      )}
      <Col className="col-flex-center mb-4 mt-1">
        <TextSpan apparence="s1">{lastTravel?.code ?? ""}</TextSpan>
      </Col>
      <Col className="col-flex-center mb-4">
        {lastTravel ? (
          isManeuver ? (
            <Badge position="" status="Info">
              <FormattedMessage id="in.maneuver" />
            </Badge>
          ) : (
            <Badge position="" status="Warning">
              <FormattedMessage id="in.travel" />
            </Badge>
          )
        ) : (
          <Badge position="" status="Basic">
            <FormattedMessage id="not.found" />
          </Badge>
        )}
      </Col>

      <Col className="col-flex-center ml-1 mr-1 mb-2">
        <Col className="col-flex-center mt-1">
          <TextSpan apparence="s4" style={{ lineHeight: "13px" }}>
            {lastTravel?.portPointStart?.description ?? ""} -{" "}
            {lastTravel?.portPointStart?.code ?? ""}
          </TextSpan>
          <Row middle="xs" center="xs" className="mt-1">
            {lastTravel &&
              (isManeuver ? (
                <EvaIcon
                  name="arrow-circle-down"
                  status="Success"
                  className="mr-1"
                  options={{ height: 18, width: 18 }}
                />
              ) : (
                <EvaIcon
                  name="arrow-circle-up"
                  status="Danger"
                  options={{ height: 15, width: 15 }}
                />
              ))}
            <TextSpan
              apparence={isManeuver ? "p3" : "p4"}
              style={isManeuver ? { marginTop: -2.5 } : { marginTop: -7 }}
            >
              {" "}
              {`${
                lastTravel?.dateTimeStart
                  ? moment(lastTravel?.dateTimeStart).format("HH:mm DD/MM")
                  : "-"
              }`}
            </TextSpan>
          </Row>
          {!isManeuver &&
            lastTravel?.metadata?.eta && [
              <TextSpan
                apparence="s2"
                className="mt-3"
                style={{ lineHeight: "13px" }}
              >
                {lastTravel?.portPointDestiny?.description ?? ""} -{" "}
                {lastTravel?.portPointDestiny?.code ?? ""}
              </TextSpan>,
              <Row middle="xs" center="xs" className="mt-1">
                {lastTravel && (
                  <>
                    <EvaIcon
                      name="arrow-circle-down"
                      status="Warning"
                      className="mr-1"
                      options={{ height: 18, width: 18 }}
                    />

                    <TextSpan apparence="p3" style={{ marginTop: -2.5 }}>
                      <strong>
                        ETA:{" "}
                        {moment(lastTravel?.metadata?.eta).format(
                          "HH:mm DD/MM"
                        )}
                      </strong>
                    </TextSpan>
                  </>
                )}
              </Row>,
            ]}
        </Col>
      </Col>
    </ContentChart>
  );
}
