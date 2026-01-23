import React from "react";
import FailureChart from "./FailureChart";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../Utils";
import TextSpan from "../../../Text/TextSpan";
import Lottie from "react-lottie";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(!value);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const FailureChartDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <ContainerChart height={150} width={150} style={{ maxHeight: 150, maxWidth: 150 }} className="card-shadow">
      <TextSpan apparence="s2" className="mt-2">
        <FormattedMessage id="failure" />
      </TextSpan>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: require(`./../../../../assets/lotties/${
            value !== true && value !== "true" ? "check" : "fail"
          }.json`),
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        isPaused={false}
        isStopped={false}
        height={"50%"}
        width={"50%"}
      />

      <TextSpan apparence="c1" className="mb-2">
        {value?.toString()}
      </TextSpan>
    </ContainerChart>
  );
};

export default FailureChartDemo;
