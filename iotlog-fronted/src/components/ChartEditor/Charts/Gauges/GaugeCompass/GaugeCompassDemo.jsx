import React from "react";
import { FormattedMessage } from "react-intl";
import GaugeCompassChart from "./GaugeCompassChart";

const getRandomArbitrary = (min, max) => {
  return parseInt(Math.floor(Math.random() * (max - min)) + min);
};

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(getRandomArbitrary(0, 350));
    }, 4000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const GaugeCompassDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <div style={{ width: 150, height: 150 }}>
      <GaugeCompassChart
        value={value}
        title={<FormattedMessage id="compass" />}
      />
    </div>
  );
};

export default GaugeCompassDemo;
