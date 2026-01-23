import { Row } from "@paljs/ui";
import React from "react";
import Lottie from "react-lottie";
import { LEVEL_NOTIFICATION } from "../../../../../constants";
import TextSpan from "../../../../Text/TextSpan";
import { ContentChart, urlRedirect } from "../../../Utils";
import { getItemConditionList } from "../../../Utils/TriggerCondition";

export default function GroupedBatteryChart({ title, sensorStates, data }) {
  const getLottieByLevel = (level) => {
    switch (level) {
      case LEVEL_NOTIFICATION.CRITICAL:
        return {
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../../assets/lotties/volts_red.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        };
      case LEVEL_NOTIFICATION.WARNING:
        return {
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../../assets/lotties/volts_charging.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        };
      case LEVEL_NOTIFICATION.INFO:
      default:
        return {
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../../assets/lotties/volts.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        };
    }
  };

  return (
    <>
      <ContentChart className="card-shadow">
        <TextSpan apparence="s2">{title || ""}</TextSpan>

        <Row
          className="pl-2 pr-2"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {data.machines?.map((machineItem, i) => {
            let value = sensorStates?.find(
              (x) =>
                x.idMachine === machineItem?.machine?.value &&
                x.idSensor === machineItem?.sensor?.value
            )?.value;

            let item = getItemConditionList(
              machineItem?.colorsConditions,
              value
            );

            return (
              <div
                className="mb-1 pl-1 p-1 mr-2 ml-2 col-flex-center"
                style={{
                  padding: 4,
                  cursor: machineItem?.link ? "pointer" : "default",
                  flexGrow: 1
                }}
                onClick={() => urlRedirect(machineItem?.link)}
              >
                <Lottie
                  options={getLottieByLevel(item?.level?.value)}
                  isPaused={false}
                  isStopped={false}
                  height={70}
                  width={70}
                />
                <TextSpan apparence="s2">{`${
                  (value % 1 === 0 ? value : value?.toFixed(2)) || ""
                } ${machineItem?.unit || ""}`}</TextSpan>
                <TextSpan apparence="s3">
                  {machineItem?.description || machineItem?.sensor?.label}
                </TextSpan>
              </div>
            );
          })}
        </Row>
      </ContentChart>
    </>
  );
}
