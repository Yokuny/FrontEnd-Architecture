import React from "react";
import { FormattedMessage } from "react-intl";
import RadialGaugeHalfChart from "./RadialGaugeHalfChart";

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 4000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const RadialGaugeHalfDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <div style={{ width: 150, height: 150 }}>
      <RadialGaugeHalfChart
        value={value}
        noResize
        title={<FormattedMessage id="radial.half" />}
        data={{ maxValue: 100 }}
      />
    </div>
  );
};

export default RadialGaugeHalfDemo;
