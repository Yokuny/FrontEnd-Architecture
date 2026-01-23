import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import { LEVEL_NOTIFICATION } from "../../../../constants";
import TextSpan from "../../../Text/TextSpan";
import { ContentChart } from "../../Utils";
import { getItemConditionList } from "../../Utils/TriggerCondition";

export default function BatteryChart({
  level,
  nominal,
  title,
  data,
  charging = false,
  onClick = undefined
}) {
  const getLottieByLevel = (level) => {
    switch (level) {
      case LEVEL_NOTIFICATION.CRITICAL:
        return {
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../assets/lotties/volts_red.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        };
      case LEVEL_NOTIFICATION.WARNING:
        return {
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../assets/lotties/volts_charging.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        };
      case LEVEL_NOTIFICATION.INFO:
      default:
        return {
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../assets/lotties/volts.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        };
    }
  };

  let item = getItemConditionList(
    data?.colorsConditions,
    level
  );

  return (
      <ContentChart
        className="card-shadow"
        style={{ cursor: !!onClick ? "pointer" : "default" }}
        onClick={onClick}
      >
        <TextSpan apparence="s2">{title || ""}</TextSpan>

        <Lottie
          options={getLottieByLevel(item?.level?.value)}
          isPaused={false}
          isStopped={false}
          height={'30%'}
          width={'25%'}
        />
        {charging && (
          <TextSpan apparence="s2" style={{ marginTop: -5 }} className="mb-2">
            <FormattedMessage id="charging" />
          </TextSpan>
        )}

        {!!level && <TextSpan apparence="s1">
          <TextSpan apparence="h4" className="mr-1">
            {level % 1 === 0 ? level : level?.toFixed(2)}
          </TextSpan>
          {(data?.description || "")}
        </TextSpan>}

        <TextSpan apparence="s2">
          {(nominal || nominal === 0)
          ? nominal % 1 === 0
            ? nominal
            : nominal?.toFixed(2)
          : ""} {!!nominal && (data?.descriptionNominal || "")}
        </TextSpan>
      </ContentChart>
  );
}
