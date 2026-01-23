import React from "react";
import { FormattedMessage } from "react-intl";
import { ContentChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";
import Lottie from "react-lottie";
import { AREA_SAFETY } from "../../../../../constants";

const AreaSafetyChart = (props) => {
  const { title, data, areas } = props;

  const getDetailsByLevel = () => {
    const sensorInvadedConfigured = data.sensorsCondition?.find(
      (x) => x?.conditionColor?.value == AREA_SAFETY.INVADED
    )?.sensor;

    if (
      sensorInvadedConfigured &&
      areas?.some(
        (x) =>
          x.sensorId == sensorInvadedConfigured.value &&
          x.signals.some((y) => y.value === true || y.value === "true")
      )
    ) {
      return { textID: "scanner_found", lottie: "scanner_red" };
    }

    const sensorWarn1Configured = data.sensorsCondition?.find(
      (x) => x?.conditionColor?.value == AREA_SAFETY.WARN_1
    )?.sensor;
    if (
      sensorWarn1Configured &&
      areas?.some(
        (x) =>
          x.sensorId == sensorWarn1Configured.value &&
          x.signals.some((y) => y.value === true || y.value === "true")
      )
    ) {
      return { textID: "warn.1", lottie: "scanner_orange" };
    }

    const sensorWarn2Configured = data.sensorsCondition?.find(
      (x) => x?.conditionColor?.value == AREA_SAFETY.WARN_2
    )?.sensor;

    if (
      sensorWarn2Configured &&
      areas?.some(
        (x) =>
          x.sensorId == sensorWarn2Configured.value &&
          x.signals.some((y) => y.value === true || y.value === "true")
      )
    ) {
      return { textID: "warn.2", lottie: "scanner_yellow" };
    }

    return { textID: "scanner_not_found", lottie: "scanner_green" };
  };

  const getLottie = (lottieName) => {
    return {
      loop: true,
      autoplay: true,
      animationData: require(`./../../../../../assets/lotties/${lottieName}.json`),
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
  };

  const detailLevel = getDetailsByLevel();

  return (
      <ContentChart
        className="card-shadow"
        onClick={props.onClick}
      >
        <TextSpan apparence="s2" className="mt-2">
          {title}
        </TextSpan>

        <Lottie
          options={getLottie(detailLevel.lottie)}
          isPaused={false}
          isStopped={false}
          height='50%'
          width='50%'
        />

        <TextSpan apparence="c1" className="mb-2">
          <FormattedMessage id={detailLevel.textID} />
        </TextSpan>
      </ContentChart>
  );
};

export default AreaSafetyChart;
