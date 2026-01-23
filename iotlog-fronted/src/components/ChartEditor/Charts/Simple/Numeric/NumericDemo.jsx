import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";

const unitsDemo = [
  "cm",
  "m/s",
  "km/h",
  "kg",
  "g",
  "psi/bar",
  "W",
  "V",
  "L",
  "ml",
];

const useSetTimeoutUnit = () => {
  const [value, setValue] = React.useState(
    unitsDemo[Math.floor(Math.random() * 10)]
  );

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(unitsDemo[Math.floor(Math.random() * 10)]);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const useSetTimeout = () => {
  const [value, setValue] = React.useState(5);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValue(Math.floor(Math.random() * 1000));
    }, 3000);
    return () => clearTimeout(timeout);
  }, [value]);

  return { value };
};

const NumericChartDemo = (props) => {
  const { value } = useSetTimeout();
  const { value: unit } = useSetTimeoutUnit();

  return (
    <ContainerChart className="card-shadow" height="150" width="150">
      <TextSpan apparence="s2" className="mt-2">
        <FormattedMessage id="numeric" />
      </TextSpan>

      <TextSpan apparence="h1" style={{ fontSize: "2.8rem" }}>
        {value}
      </TextSpan>

      <TextSpan apparence="c1" className="mb-2">
        {unit}
      </TextSpan>
    </ContainerChart>
  );
};

export default NumericChartDemo;
