import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";
import Lottie from "react-lottie";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(3);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const AreaSafetyDemo = (props) => {
  const { value } = useSetTimeout();

  let animations = [
    "scanner_green",
    "scanner_yellow",
    "scanner_orange",
    "scanner_red",
  ];

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require(`./../../../../../assets/lotties/${animations[value]}.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <ContainerChart width={150} height={150} className="card-shadow">
        <TextSpan apparence="s2" className="mt-2">
          <FormattedMessage id="safety" />
        </TextSpan>

        <Lottie
          options={defaultOptions}
          isPaused={false}
          isStopped={false}
          height={90}
          width={90}
        />

        <TextSpan apparence="c1" className="mb-2">
          {`Area ${value}`}
        </TextSpan>
      </ContainerChart>
    </>
  );
};

export default AreaSafetyDemo;
