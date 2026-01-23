import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";
import Lottie from "react-lottie";
import { IconCircle, ContainerAnimated } from "./BaseMode";
import { Agv } from "../../../../Icons";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(1);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 4));
    }, 6000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const ModeCombineDemo = (props) => {
  const { value } = useSetTimeout();

  const getDetails = () => {
    switch (value) {
      case 2:
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
              height={70}
              width={70}
            />
          ),
          textID: "waiting.operator",
        };
      case 3:
        return {
          component: (
            <ContainerAnimated height={'80px'} width={'80px'}>
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
      default:
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
              height={70}
              width={70}
            />
          ),
          textID: "power.off",
        };
    }
  };

  const detailsChidlren = getDetails();

  return (
    <>
      <ContainerChart width={150} height={150} className="card-shadow">
        <TextSpan apparence="s2" className="mt-2">
          <FormattedMessage id="mode.combined" />
        </TextSpan>

        {detailsChidlren.component}

        <TextSpan apparence="c1" className="mb-2">
          <FormattedMessage id={detailsChidlren.textID} />
        </TextSpan>
      </ContainerChart>
    </>
  );
};

export default ModeCombineDemo;
