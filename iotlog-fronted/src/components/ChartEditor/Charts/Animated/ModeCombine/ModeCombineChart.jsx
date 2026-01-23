import React from "react";
import { FormattedMessage } from "react-intl";
import { ContentChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";
import Lottie from "react-lottie";
import { IconCircle, ContainerAnimated } from "./BaseMode";
import { Agv } from "../../../../Icons";

const ModeCombineChart = (props) => {
  const { modoStates, data } = props;

  const verifyValueTrue = (value) => {
    return value === true || value === "true";
  };

  const verifyValueFalse = (value) => {
    return value === false || value === "false";
  };

  const getDetails = () => {
    if (data.sensorActive) {
      const dataActive = modoStates?.find(
        (x) => x.sensorId == data.sensorActive.value
      );

      if (dataActive && verifyValueFalse(dataActive.signals[0].value)) {
        return {
          component: (
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: require(`./../../../../../assets/lotties/power_off.json`),
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              isPaused={false}
              isStopped={false}
              height="35%"
              width="35%"
            />
          ),
          textID: "power.off",
        };
      }
    }

    const dataAutomatic = modoStates?.find(
      (x) => x.sensorId == data.sensorAutomatic?.value
    );
    const dataBusy = modoStates?.find(
      (x) => x.sensorId == data.sensorBusy?.value
    );

    if (
      dataAutomatic &&
      verifyValueTrue(dataAutomatic.signals[0].value) &&
      dataBusy &&
      verifyValueTrue(dataBusy.signals[0].value)
    ) {
      return {
        component: (
          <ContainerAnimated width={"80%"}>
            <Agv
              style={{
                height: 50,
                width: 50,
              }}
            />
          </ContainerAnimated>
        ),
        textID: "in.working",
      };
    }

    const dataAvaliable = modoStates?.find(
      (x) => x.sensorId == data.sensorAvaliable?.value
    );
    if (
      dataAutomatic &&
      verifyValueTrue(dataAutomatic.signals[0].value) &&
      dataAvaliable &&
      verifyValueTrue(dataAvaliable.signals[0].value)
    ) {
      return {
        component: (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: require(`./../../../../../assets/lotties/finger_press_button.json`),
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            isPaused={false}
            isStopped={false}
            height="35%"
            width="35%"
          />
        ),
        textID: "waiting.operator",
      };
    }

    return {
      component: (
        <IconCircle height={60} width={60} backgroundColor="#FEF1D7">
          <h3 className={`manual-color`}>M</h3>
        </IconCircle>
      ),
      textID: "manual",
    };
  };

  const detailsChidlren = getDetails();

  return (
    <ContentChart className="card-shadow">
      <TextSpan apparence="s2" className="mt-2">
        <FormattedMessage id="mode" />
      </TextSpan>

      {detailsChidlren.component}

      <TextSpan apparence="c1" className="mb-2">
        <FormattedMessage id={detailsChidlren.textID} />
      </TextSpan>
    </ContentChart>
  );
};

export default ModeCombineChart;
