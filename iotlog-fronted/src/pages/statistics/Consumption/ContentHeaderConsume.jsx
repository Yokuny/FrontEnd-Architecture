import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EvaIcon,
  Popover,
  Radio,
  Row,
  Select,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, TextSpan } from "../../../components";
import FilterSearchStatistics from "./../FilterSearchStatistics";

export default function ContentHeaderConsume(props) {
  const intl = useIntl();

  const [showFilter, setShowFilter] = React.useState(false);
  const [isFiltering, setIsFiltering] = React.useState(false);

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

  const [filterData, setFilterData] = React.useState({
    filteredModel: [],
    filteredMachine: [],
    dateInit: props.minDateDefault ?? "",
    dateEnd: "",
    timeInit: "",
    timeEnd: "",
  });

  const onChange = (prop, value) => {
    setFilterData((prevstate) => ({
      ...prevstate,
      [prop]: value,
    }));
  };

  const onClearFilter = () => {
    setFilterData({
      filteredModel: [],
      filteredMachine: [],
      dateInit: props.minDateDefault ?? "",
      dateEnd: "",
      timeInit: "",
      timeEnd: "",
    });
    setIsFiltering(false);
  };

  const onFilter = (data) => {
    setShowFilter(false);
    props.onFilter(data);
    if (!data.isClearing) setIsFiltering(true);
  };

  return (
    <>
      <Row between="xs" className="pl-2 pr-2">
        <TextSpan apparence="s1">
          <FormattedMessage id={props.titleId} />
        </TextSpan>
        <Row end="xs" style={{ margin: 0 }}>
          <Popover
            className="inline-block"
            trigger="click"
            placement="top"
            overlay={
              <>
                <Card style={{ marginBottom: 0 }}>
                  <CardHeader>
                    <TextSpan apparence="s1">
                      <FormattedMessage id="setup" />
                    </TextSpan>
                  </CardHeader>
                  <CardBody className="pt-2" style={{ zIndex: 999 }}>
                    <LabelIcon
                      iconName="droplet"
                      title={`${intl.formatMessage({ id: "unit" })}`}
                    />
                    <Radio
                      className="ml-3"
                      onChange={(value) => props.setUnit(value)}
                      options={optionsUnit?.map((x) => ({
                        ...x,
                        checked: x.value === props.unit,
                      }))}
                    />
                  </CardBody>
                </Card>
              </>
            }
          >
            <Button size="Tiny" status="Basic">
              <EvaIcon name={"settings-outline"} />
            </Button>
          </Popover>
          <Button
            size="Tiny"
            className="ml-3"
            status={isFiltering ? "Info" : showFilter ? "Primary" : "Basic"}
            onClick={() => setShowFilter((prevState) => !prevState)}
          >
            <EvaIcon name={isFiltering ? "funnel" : "funnel-outline"} />
          </Button>
        </Row>
      </Row>

      {showFilter && (
        <FilterSearchStatistics
          key={`${props.titleId}_t_f`}
          onClose={() => setShowFilter(false)}
          show={showFilter}
          onFilter={onFilter}
          breakPointItens={{ md: 3 }}
          onChange={onChange}
          onClearFilter={onClearFilter}
          minDateDefault={props.minDateDefault}
          filterData={filterData}
        />
      )}
    </>
  );
}
