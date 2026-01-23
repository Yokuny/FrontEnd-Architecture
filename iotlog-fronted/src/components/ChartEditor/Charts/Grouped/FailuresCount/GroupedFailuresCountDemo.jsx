import { Col, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import TextSpan from "../../../../Text/TextSpan";
import { ContainerChart } from "../../../Utils";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 20));
    }, 4000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

export default function GroupedFailuresCountDemo({
  height = 200,
  width = 200,
}) {
  const { value } = useSetTimeout();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require(`../../../../../assets/lotties/check.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultFailOptions = {
    loop: true,
    autoplay: true,
    animationData: require(`../../../../../assets/lotties/fail.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow">
        <TextSpan apparence="s2">
          <FormattedMessage id="failure" />
        </TextSpan>

        <Row style={{ maxWidth: width - 20 }}>
          {new Array(6).fill().map((x, i) => (
            <Col breakPoint={{ md: 4 }} className="mb-4" key={i}>
              <Lottie
                options={(value - i) <= 0 ? defaultOptions : defaultFailOptions}
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
