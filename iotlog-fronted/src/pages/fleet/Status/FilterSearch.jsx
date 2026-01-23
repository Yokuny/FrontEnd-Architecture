import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  LabelIcon,
  SelectMachineEnterprise,
  SelectModelMachine,
} from "../../../components";

const FilterSearch = (props) => {
  const [filteredModel, setFilteredModel] = React.useState(
    JSON.parse(localStorage.getItem("filter_model_fleet") || "[]")
  );
  const [filteredMachine, setFilteredMachine] = React.useState(
    JSON.parse(localStorage.getItem("filter_machine_fleet") || "[]")
  );

  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  const onSearch = () => {
    localStorage.setItem("filter_model_fleet", JSON.stringify(filteredModel));
    localStorage.setItem(
      "filter_machine_fleet",
      JSON.stringify(filteredMachine)
    );
    props.onFilter({
      filteredModel,
      filteredMachine,
    });
  };

  const onClear = () => {
    localStorage.setItem("filter_model_fleet", "[]");
    localStorage.setItem("filter_machine_fleet", "[]");
    props.onFilter({
      filteredModel: [],
      filteredMachine: [],
    });
  };

  const isFiltered = !!(filteredMachine?.length || filteredModel?.length);

  return (
    <>
      <Row className="mb-4 mr-4" center="xs">
        <Col className="mb-2 mt-2" breakPoint={{ xs: 12, md: 12 }}>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.model" />}
          />
          <SelectModelMachine
            idEnterprise={idEnterprise}
            onChange={(e) => setFilteredModel(e)}
            value={filteredModel}
            isMulti
            menuPosition="relative"
          />
        </Col>
        <Col className="mb-1" breakPoint={{ xs: 12, md: 12 }}>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.active" />}
          />
          <SelectMachineEnterprise
            idEnterprise={idEnterprise}
            onChange={(e) => setFilteredMachine(e.map(x => x.value))}
            value={filteredMachine}
            isMulti
            menuPosition="relative"
            isOnlyValue
          />
        </Col>
        {isFiltered && (
          <Col breakPoint={{ xs: 6, md: 6 }}>
            <Button
              size="Tiny"
              className="mt-4 mb-4 mr-4 flex-between"
              status="Danger"
              appearance="ghost"
              onClick={onClear}
            >
              <EvaIcon name="close-circle" className="mr-1" />
              <FormattedMessage id="clear.filter" />
            </Button>
          </Col>
        )}
        <Col breakPoint={{ xs: 6, md: 6 }}>
          <Button
            size="Small"
            className="mt-4 mb-4 mr-4 flex-between"
            status="Success"
            fullWidth={!isFiltered}
            onClick={onSearch}
          >
            <EvaIcon name="search" className="mr-1" />
            <FormattedMessage id="filter" />
          </Button>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FilterSearch);
