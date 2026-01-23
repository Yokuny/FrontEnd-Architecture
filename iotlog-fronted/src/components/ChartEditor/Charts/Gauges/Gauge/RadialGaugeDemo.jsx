import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";
import RadialGaugeChart from "./RadialGaugeChart";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 5000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const RadialGaugeDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <div style={{ width: 150, height: 150 }}>
      <RadialGaugeChart
        value={value}
        noResize
        title={<FormattedMessage id="radial" />}
        data={{ maxValue: 100 }}
      />
    </div>
  );
};

export default RadialGaugeDemo;
