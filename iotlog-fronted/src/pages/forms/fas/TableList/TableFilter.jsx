import { Button, Col, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import {
  LabelIcon,
  SelectMachineEnterprise,
} from "../../../../components";
import InputDateTime from "../../../../components/Inputs/InputDateTime";
import SelectStatusOS from "../../../../components/Fas/SelectStatusOS";
import SelectFasType from "../../../../components/Select/SelectFasType";
import SelectFasPlanner from "../../../../components/Select/SelectFasPlanner";

const ColCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const TableFilter = (props) => {

  const [vessels, setVessels] = React.useState();
  const [dateStart, setDateStart] = React.useState(props.dateStartDefault);
  const [dateEnd, setDateEnd] = React.useState();
  const [status, setStatus] = React.useState();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState([]);
  const [planner, setPlanner] = React.useState([]);
  const [filterIsOpen, setFilterIsOpen] = React.useState(false);
  const [searchParams] = useSearchParams();
  const intl = useIntl();

  const { idEnterprise } = props;

  React.useEffect(() => {
    let filterActive = false;
    if (searchParams.get("idVessel")) {
      setVessels(
        searchParams
          .get("idVessel")
          .split(",")
      );
      filterActive = true;
    }
    if (searchParams.get("dateStart")) {
      setDateStart(searchParams.get("dateStart"));
      filterActive = true;
    }
    if (searchParams.get("dateEnd")) {
      setDateEnd(searchParams.get("dateEnd"));
      filterActive = true;
    }
    if (searchParams.get("status")) {
      setStatus(searchParams.get("status").split(","));
      filterActive = true;
    }
    if (searchParams.get("search")) {
      setSearch(searchParams.get("search"));
      filterActive = true;
    }
    if (searchParams.get("planner")) {
      setPlanner(searchParams.get("planner").split(","));
      filterActive = true;
    }
    if (searchParams.get("type")) {
      setType(searchParams.get("type").split(","));
      filterActive = true;
    }
    setFilterIsOpen(filterActive);
  }, []);

  const onFilter = () => {
    props.onHandleFilter({
      idVessels: vessels,
      dateStart,
      dateEnd,
      status: status,
      search,
      type: type?.map(x => x.value) || [],
      planner: planner
    });
    setFilterIsOpen(true);
  }

  const onClearFilter = () => {
    setVessels([]);
    setDateStart(props.dateStartDefault);
    setDateEnd();
    setStatus([]);
    setSearch("");
    setType([]);
    setPlanner([]);
    setFilterIsOpen(false);
    props.onHandleFilter({
      idVessels: [],
      dateStart: props.dateStartDefault,
      dateEnd: null,
      status: [],
      type: [],
      planner: [],
      search: "",
    });
  }


  return (
    <>
      <Row middle="xs" around="xs" className="mb-4">
        <Col breakPoint={{ md: 10 }} className="mb-2">
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "search" })}
              />
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({ id: "search" })}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "vessels" })}
              />
              <SelectMachineEnterprise
                value={vessels}
                onChange={(value) => setVessels(value?.map(x => x.value))}
                placeholder={"vessel"}
                isOnlyValue
                isMulti
                idEnterprise={idEnterprise}
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "status" })}
              />
              <SelectStatusOS
                onChange={(value) => setStatus(value?.map(x => x.value))}
                value={status}
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "type" })}
              />
              <SelectFasType
                onChange={(e) => setType(e)}
                value={type}
                noRegularization={false}
                isMulti={true}
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "date.start" })}
              />
              <InputDateTime
                onlyDate={true}
                onChange={(value) => setDateStart(moment(value).format('YYYY-MM-DD'))}
                value={dateStart}
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "date.end" })}
              />
              <InputDateTime
                onlyDate={true}
                onChange={(value) => setDateEnd(moment(value).format('YYYY-MM-DD'))}
                value={dateEnd}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-2">
              <LabelIcon
                title={intl.formatMessage({ id: "planner" })}
              />
              <SelectFasPlanner
                value={planner}
                onChange={(value) => setPlanner(value?.map(x => x.value))}
                placeholder={"planner"}
                isOnlyValue
                isMulti
                idEnterprise={idEnterprise}
              />
            </Col>
          </Row>
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-2">
          <ColCenter>
            <Button
              size="Tiny"
              status={filterIsOpen ? "Info" : "Basic"}
              className="flex-between"
              onClick={() => onFilter()}
            >
              <EvaIcon name="search" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
            {filterIsOpen && <Button
              size="Tiny"
              status="Danger"
              appearance="ghost"
              className="flex-between mt-4"
              onClick={onClearFilter}
            >
              <EvaIcon name="close" className="mr-1" />
              <FormattedMessage id="clear.filter" />
            </Button>}
          </ColCenter>
        </Col>
      </Row>
    </>
  );
};

export default TableFilter;
