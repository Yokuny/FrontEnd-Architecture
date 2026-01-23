import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";
import { Agv } from "../../../../Icons";
import { IconCircle, ContainerAnimated } from "./../ModeCombine/BaseMode";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(1);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 3));
    }, 6000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const ModeStatusImageDemo = (props) => {
  const { value } = useSetTimeout();
  const { height = 100, width = 100 } = props;

  const getDetails = () => {
    switch (value) {
      case 1:
        return {
          image: "https://siot-file.konztec.com/images/automation.png",
          textID: "manual",
        };
      case 2:
        return {
          image: "https://siot-file.konztec.com/images/automatic.png",
          textID: "automatic",
        };
      default:
        return {
          image: "https://siot-file.konztec.com/images/automatic.png",
          textID: "automatic",
        };
    }
  };

  const detailsChidlren = getDetails();

  return (
    <>
      <ContainerChart width={150} height={150} className="card-shadow">
        <TextSpan apparence="s2" className="mt-2">
          <FormattedMessage id="status.image" />
        </TextSpan>

        <img
          style={{
            objectFit: "contain",
            marginTop: 10,
            marginBottom: 10
          }}
          height={height - 50}
          width={width - 20}
          src={detailsChidlren.image}
          alt={"demo_status_image"}
        />

        <TextSpan apparence="c1" className="mb-2">
          <FormattedMessage id={detailsChidlren.textID} />
        </TextSpan>
      </ContainerChart>
    </>
  );
};

export default ModeStatusImageDemo;
