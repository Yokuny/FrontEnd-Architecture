import { Col, Row } from "@paljs/ui";
import React from "react";
import Lottie from "react-lottie";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart, ContentChart } from "../../Utils";

export default function RouteChart({
  title,
  sensorStatesAndParams,
  data
}) {
  let lottie = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../assets/lotties/route.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const processValue = (sensorItem) => {
    const value = sensorStatesAndParams?.data
      ?.find((x) => x.sensorId == sensorItem?.sensor?.value)
      ?.signals?.find((x) => x.signal == sensorItem?.signal?.value)?.value;

    if (sensorItem?.params?.value) {
      const findedOptionsParams = sensorStatesAndParams?.params?.find(
        (x) => x.id == sensorItem?.params?.value
      );
      if (findedOptionsParams) {
        return (
          findedOptionsParams.options.find((x) => x.value == value)?.label ??
          value
        );
      }
    }
    return value;
  };

  return (
      <ContentChart className="card-shadow">
        <TextSpan apparence="s2">{title}</TextSpan>

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
          height='30%'
          width='30%'
        />

        <Col style={{ padding: 0 }}>
          {data?.sensors?.map((sensorItem, i) => {
            return (
              <Row middle="xs" center="xs" key={i}>
                <TextSpan apparence="p2">{sensorItem.description}:</TextSpan>
                <TextSpan apparence="s2" className="ml-1">
                  {processValue(sensorItem)}
                </TextSpan>
              </Row>
            );
          })}
        </Col>
      </ContentChart>
  );
}
