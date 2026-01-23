import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../Utils";
import TextSpan from "../../../Text/TextSpan";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(!value);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const BooleanChartDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <ContainerChart height={150} width={150} className="card-shadow">
      <TextSpan apparence="s2" className="mt-2">
        <FormattedMessage id="boolean_visual" />
      </TextSpan>

      <TextSpan apparence="h1">{!!value ? "On" : "Off"}</TextSpan>
      <TextSpan apparence="c1" className="mb-2">
        {value?.toString()}
      </TextSpan>
    </ContainerChart>
  );
};

export default BooleanChartDemo;
