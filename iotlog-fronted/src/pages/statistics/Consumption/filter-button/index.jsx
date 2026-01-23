import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  EvaIcon,
  Radio,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import Overlay from "../../../../components/Overlay";

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function FilterButton(props) {
  const intl = useIntl();
  const [dateFilter, setDateFilter] = React.useState("1m");
  const [unit, setUnit] = React.useState("m³");
  const buttonOutRef = React.useRef();
  const optionsUnit = [
    {
      value: "m³",
      label: "m³",
    },
    {
      value: "L",
      label: "L",
    },
    {
      value: "T",
      label: "T",
    },
  ];

  const optionsDate = [
    {
      value: "1m",
      label: intl.formatMessage({ id: "in.month" }),
    },
    {
      value: "2m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "2"),
    },
    {
      value: "3m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "3"),
    },
    {
      value: "6m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "6"),
    },
    {
      value: "12m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "12"),
    },
  ];

  const onFilter = () => {
    buttonOutRef.current && buttonOutRef.current.click();
    props.onApply({ dateFilter, unit });
  };

  return (
    <>
      <button ref={buttonOutRef} style={{ display: "none" }}></button>
      <Overlay
        className="inline-block"
        trigger="click"
        placement="top"
        target={
          <>
            <Button size="Tiny" status={props.status || "Control"}>
              <EvaIcon name="funnel-outline" />
            </Button>
          </>
        }
      >
        <Card style={{ marginBottom: 0 }}>
          <CardHeader>
            <TextSpan apparence="s1">
              <FormattedMessage id="filter" />
            </TextSpan>
          </CardHeader>
          <CardBody className="pt-2" style={{ zIndex: 999 }}>
            <Row>
              <Col>
                <LabelIcon
                  iconName="calendar-outline"
                  title={`${intl.formatMessage({ id: "period" })}`}
                />
                <Radio
                  className="ml-3"
                  key={"rd_periodo"}
                  onChange={(value) => setDateFilter(value)}
                  options={optionsDate?.map((x) => ({
                    ...x,
                    checked: x.value == dateFilter,
                  }))}
                />
              </Col>
              <Col>
                <LabelIcon
                  iconName="droplet-outline"
                  title={`${intl.formatMessage({ id: "unit" })}`}
                />
                <Radio
                  key={"rd_unit"}
                  className="ml-3"
                  onChange={(value) => setUnit(value)}
                  status="Info"
                  options={optionsUnit?.map((x) => ({
                    ...x,
                    checked: x.value === unit,
                  }))}
                />
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Row>
              <Button onClick={onFilter} status={"Info"} size="Small">
                <FormattedMessage id="filter" />
              </Button>
            </Row>
          </CardFooter>
        </Card>
      </Overlay>
    </>
  );
}
