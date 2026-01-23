import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Lottie from "react-lottie";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(Math.floor(Math.random() * 100));

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 10) || 1);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const useSetTimeoutBool = () => {
  const [value, setValue] = React.useState(false);
  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(!value);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const BatteryChartDemo = (props) => {
  const { value: level } = useSetTimeout();
  const { value: nominal } = useSetTimeout();
  const { value: charging } = useSetTimeoutBool();

  const intl = useIntl();

  return (
    <>
      <ContainerChart height={150} width={150} className="card-shadow">
        <TextSpan apparence="s2">
          {intl.formatMessage({ id: "battery" })}
        </TextSpan>

        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: require(`./../../../../assets/lotties/volts.json`),
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          isPaused={false}
          isStopped={false}
          height={30}
          width={40}
        />

        {charging && (
          <TextSpan apparence="s2" style={{ marginTop: -5 }} className="mb-2">
            <FormattedMessage id="charging" />
          </TextSpan>
        )}

        <TextSpan apparence="s1">
          <TextSpan apparence="h4" className="mr-1">
            {level % 1 === 0 ? level : level?.toFixed(2)}
          </TextSpan>
          V
        </TextSpan>
      </ContainerChart>
    </>
  );
};

export default BatteryChartDemo;
