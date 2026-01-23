import React from "react";
import { FormattedMessage } from "react-intl";
import { ContainerChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";
import { Col, Row } from "@paljs/ui";
import moment from "moment";

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

const InfoDemo = (props) => {
  const { value } = useSetTimeout();
  const { value: unit } = useSetTimeoutUnit();

  return (
    <ContainerChart className="card-shadow" height="150" width="150">
      <TextSpan apparence="s2" className="mt-2">
        <FormattedMessage id="list.info" />
      </TextSpan>

      <Col>
        <Row className="mb-1 pl-4 pr-4">
          <TextSpan apparence="s3">
            Sensor 1:
            <TextSpan apparence="c1"> {value}</TextSpan>
            <TextSpan apparence="c1"> {unit}</TextSpan>
          </TextSpan>
        </Row>
        <Row className="mb-1 pl-4 pr-4">
          <TextSpan apparence="s3">
            Sensor 2:
            <TextSpan apparence="c1"> {value * 1.5}</TextSpan>
            <TextSpan apparence="c1"> {unit}</TextSpan>
          </TextSpan>
        </Row>
        <Row className="mb-1 pl-4 pr-4">
          <TextSpan apparence="s3">
            Date:
            <TextSpan apparence="c1"> {moment().format('YYYY-MM-DD HH:mm')}</TextSpan>
          </TextSpan>
        </Row>
      </Col>
      <div></div>
    </ContainerChart>
  );
};

export default InfoDemo;
