import moment from "moment";
import { Card, CardBody, CardHeader, Col, Row, Select } from "@paljs/ui";
import ConsumeTrip from "./ConsumeTrip";
import React from "react";
import ContentHeader from "../ContentHeader";
import { useIntl } from "react-intl";
import { LabelIcon } from "../../../components";
import ContentHeaderConsume from "./ContentHeaderConsume";

const StatisticsConsume = (props) => {
  const intl = useIntl();

  const [filter, setFilter] = React.useState({
    dateMin: `${moment(`${new Date().getFullYear()}-01-01T00:00:00`).format(
      "YYYY-MM-DDTHH:mm:ssZ"
    )}`,
  });
  const [unit, setUnit] = React.useState("L");

  return (
    <>
      <Card>
        <CardHeader>
          <ContentHeaderConsume
            onFilter={(filterParams) => setFilter(filterParams)}
            titleId="statistics.consume"
            minDateDefault={`${new Date().getFullYear()}-01-01`}
            unit={unit}
            setUnit={setUnit}
          />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 12 }} className="pt-4">
              <ConsumeTrip filter={filter} unitDefault={unit} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default StatisticsConsume;
