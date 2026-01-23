import { Badge, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";

export default function TravelDemo({ height = 200, width = 200 }) {
  let lottie = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../assets/lotties/norsul_ship.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ContainerChart height={height} width={width} className="card-shadow">
      <TextSpan apparence="s2">
        <FormattedMessage id="travel" />
      </TextSpan>

      <Lottie
        options={lottie}
        style={{
          marginTop: -10,
        }}
        isPaused={false}
        isStopped={false}
        height={90}
        width={80}
      />

      <Row middle="xs" center="xs">
        <Badge style={{ marginTop: -65 }} position="" status="Warning">
          <FormattedMessage id="in.travel" />
        </Badge>
        <div className="col-flex-center mt-4">
          <TextSpan apparence="s2" style={{ textAlign: "center" }}>
            Port 1 - PRT
          </TextSpan>
          <div className="flex-row-center">
            <EvaIcon
              name="arrow-circle-up"
              status="Danger"
              className="mt-1 mr-1"
              options={{ height: 18, width: 18 }}
            />
            <TextSpan apparence="p3" style={{ marginTop: 2.8 }}>
              {`${moment().format('DD/MM HH:mm')}`}
            </TextSpan>
          </div>
        </div>
      </Row>
    </ContainerChart>
  );
}
