import { Button, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import styled from "styled-components";
import FilterSearchStatistics from "./FilterSearchStatistics";
import { useSearchParams } from "react-router-dom";

const Col = styled.div`
display: flex;
flex-direction: column;
`

export default function ContentHeader(props) {

  const [showFilter, setShowFilter] = React.useState(false);
  const [filterData, setFilterData] = React.useState({
    filteredModel: [],
    filteredMachine: [],
    dateInit: moment().subtract(8, `days`).format('YYYY-MM-DD'),
    dateEnd: moment().subtract(1, `days`).format('YYYY-MM-DD'),
    unit: "m³"
  });

  const [, setSearchParams] = useSearchParams();

  const onFilter = (data) => {

    const filter = [
      ["dateStart", data.dateMin],
      ["dateEnd", data.dateMax],
    ]

    if (data.filteredMachine?.length) {
      filter.push(["filteredMachine", data.filteredMachine.map(x => x.value).join(",")]);
    }

    if (data.filteredModel?.length) {
      filter.push(["filteredModel", data.filteredModel.map(x => x.value).join(",")]);
    }

    setSearchParams(filter);

    setShowFilter(false);
  };

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
      dateInit: moment().subtract(8, `days`).format('YYYY-MM-DD'),
      dateEnd: moment().subtract(1, `days`).format('YYYY-MM-DD'),
      unit: "m³"
    });
  }

  return (
    <>
      <Row between="xs" className="pl-2 pr-2">
        <Col>
          {props.children}
        </Col>
        <div className="pt-2">
          <Button
            size="Tiny"
            status={showFilter ? "Primary" : "Basic"}
            onClick={() => setShowFilter((prevState) => !prevState)}
          >
            <EvaIcon name={showFilter ? "funnel" : "funnel-outline"} />
          </Button>
        </div>
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
            showUnit={props.showUnit || false}
          />
        )}
      </Row>
    </>
  );
}
