import React from "react";
import { FormattedMessage } from "react-intl";
import OnOffChart from "./OnOffChart";

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

const OnOffDemo = (props) => {
  const { value } = useSetTimeout();

  return (
    <div style={{ width: 150, height: 150 }}>
    <OnOffChart
      value={value}
      title={<FormattedMessage id="active.on.off" />}
      description={value?.toString()}
    />
    </div>
  );
};

export default OnOffDemo;
