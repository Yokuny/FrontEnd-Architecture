import * as React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import Select from "@paljs/ui/Select";
import { LabelIcon, TextSpan } from "../..";
import { FormattedMessage, useIntl } from "react-intl";
import FasOrderStatusTotalPieChart from "./FasOrderStatusTotalPieChart";
import FasOrderStatusPerDependantChart from "./FasOrderStatusPerDependantChart";

const FasHeaderTypesGroup = ({ filterOptions }) => {
  const intl = useIntl();

  const ORDER_DEPENDANT_AXIS_OPTIONS = [
    { value: "month", label: intl.formatMessage({ id: "month" }) },
    { value: "vessel", label: intl.formatMessage({ id: "vessel" }) },
  ];

  const [dependantAxis, setDependantAxis] = React.useState(
    ORDER_DEPENDANT_AXIS_OPTIONS[0]
  );

  return (
    <>
      <Row>
        <Col className="mb-4" breakPoint={{ md: 4 }}>
          <LabelIcon
            title={<FormattedMessage id="fas.chart.dependantAxis" />}
          />
          <Select
            value={dependantAxis}
            onChange={setDependantAxis}
            options={ORDER_DEPENDANT_AXIS_OPTIONS}
            size="Tiny"
            placeholder={intl.formatMessage({ id: "fas.chart.dependantAxis" })}
          />
        </Col>
        <TextSpan
          apparence="c2"
          style={{ width: `100%` }}
          className={"ml-4 mb-2"}
        >
          <FormattedMessage id="fas.status.chart" />
        </TextSpan>
      </Row>
      <Row>
        <FasOrderStatusTotalPieChart filterOptions={filterOptions} />
        <FasOrderStatusPerDependantChart
          filterOptions={filterOptions}
          dependantAxis={dependantAxis.value}
        />
      </Row>
    </>
  );
};

export default FasHeaderTypesGroup;
