import { Col, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import TextSpan from "../../../../Text/TextSpan";
import { ContainerChart } from "../../../Utils";

export default function GroupedBatteryDemo({
  level,
  nominal,
  title,
  description,
  descriptionNominal,
  charging = false,
  height = 200,
  width = 200,
  onClick = undefined,
}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../../assets/lotties/volts.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultNoKOptions = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../../assets/lotties/volts_charging.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultDangerOptions = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../../assets/lotties/volts_red.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow">
        <TextSpan apparence="s2">
          <FormattedMessage id="energy" />
        </TextSpan>

        <Row style={{ maxWidth: width - 20 }}>
          {new Array(6).fill().map((x, i) => (
            <Col breakPoint={{ md: 4 }} className="mb-4" key={i}>
              <Lottie
                options={
                  i == 0
                    ? defaultDangerOptions
                    : i % 2 === 0
                      ? defaultOptions
                      : defaultNoKOptions
                }
                isPaused={false}
                isStopped={false}
                height={50}
                width={50}
              />
            </Col>
          ))}
        </Row>
        <div></div>
      </ContainerChart>
    </>
  );
}
