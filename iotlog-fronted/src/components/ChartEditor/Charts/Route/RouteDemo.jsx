import { Col, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";

export default function RouteDemo({ height = 150, width = 150 }) {
  let lottie = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../assets/lotties/route.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow">
        <TextSpan apparence="s2">
          <FormattedMessage id="route" />
        </TextSpan>

        <Lottie
          options={lottie}
          style={{
            marginTop: -10,
            marginBottom: -5,
            backgroundColor: "#fff",
            borderRadius: 50,
          }}
          isPaused={false}
          isStopped={false}
          height={60}
          width={60}
        />

        <Row middle="xs" center="xs">
          <TextSpan apparence="p2">Tag:</TextSpan>
          <TextSpan apparence="s2" className="ml-1">23</TextSpan>
        </Row>
      </ContainerChart>
    </>
  );
}
