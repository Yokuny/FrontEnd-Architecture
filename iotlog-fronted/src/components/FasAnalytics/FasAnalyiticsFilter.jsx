import * as React from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { Row, Col, Button } from "@paljs/ui";
import { EvaIcon } from "@paljs/ui/Icon";
import Select from "@paljs/ui/Select";
import moment from "moment";
import SelectStatusOS from "../Fas/SelectStatusOS";
import SelectFasType from "../Select/SelectFasType";
import { SelectMachineEnterprise, LabelIcon } from "../";

import InputDateTime from "../Inputs/InputDateTime";
const FasAnalyticsFilter = ({ onSearch, useOrderFilters, ...props }) => {
  React.useLayoutEffect(() => {
    setFilterValue(null);
  }, [useOrderFilters]);
  const intl = useIntl();
  const selectMonthsOptions = [
    {
      label: intl.formatMessage({ id: "january" }),
      value: "january",
    },
    {
      label: intl.formatMessage({ id: "february" }),
      value: "february",
    },
    {
      label: intl.formatMessage({ id: "march" }),
      value: "march",
    },
    {
      label: intl.formatMessage({ id: "april" }),
      value: "april",
    },
    {
      label: intl.formatMessage({ id: "may" }),
      value: "may",
    },
    {
      label: intl.formatMessage({ id: "june" }),
      value: "june",
    },
    {
      label: intl.formatMessage({ id: "july" }),
      value: "july",
    },
    {
      label: intl.formatMessage({ id: "august" }),
      value: "august",
    },
    {
      label: intl.formatMessage({ id: "september" }),
      value: "september",
    },
    {
      label: intl.formatMessage({ id: "october" }),
      value: "october",
    },
    {
      label: intl.formatMessage({ id: "november" }),
      value: "november",
    },
    {
      label: intl.formatMessage({ id: "december" }),
      value: "december",
    },
  ];

  const selectFilterOptions = [
    {
      label: intl.formatMessage({ id: "serviceDate.month" }),
      value: "serviceDate.month",
    },
    {
      label: intl.formatMessage({ id: "serviceDate.range" }),
      value: "serviceDate.range",
    },
  ];

  const selectYearsOptions = [
    {
      label: "2023",
      value: 2023,
    },
    {
      label: "2024",
      value: 2024,
    },
    {
      label: "2025",
      value: 2025,
    },
  ];

  const [selectedFilter, setSelectedFilter] = React.useState(
    selectFilterOptions[1]
  );
  const [vesselId, setVesselId] = React.useState(null);
  const [filterValue, setFilterValue] = React.useState();

  const changeSelectedFilter = (value) => {
    setSelectedFilter(value);
    setFilterValue(null);
  };

  const changeFilterValue = (prop, value) => {
    setFilterValue({
      ...filterValue,
      [prop]: value?.value ? value.value : value,
    });
  };

  const resetFilter = () => {
    setFilterValue(null);
    setVesselId(null);
    setSelectedFilter(selectFilterOptions[1]);
    onSearch(null);
  };

  return (
    <Row className="mb-4">
      <Col breakPoint={{ lg: 4, md: 4 }}>
        <LabelIcon title={<FormattedMessage id="filter.by.date" />} />
        <Select
          className="mb-2"
          defaultValue={selectFilterOptions[1]}
          options={selectFilterOptions}
          placeholder={intl.formatMessage({
            id: "select.completed.chart.filter",
          })}
          onChange={changeSelectedFilter}
          value={selectedFilter}
          menuPosition="fixed"
          isClearable
        />
      </Col>
      {selectedFilter?.value === "serviceDate.range" && (
        <>
          <Col breakPoint={{ lg: 4, md: 4 }}>
            <LabelIcon title={<FormattedMessage id="date.start" />} />
            <InputDateTime
              onlyDate
              value={filterValue?.service_date_gte}
              onChange={(e) =>
                changeFilterValue(
                  "service_date_gte",
                  moment(e).format("YYYY-MM-DD")
                )
              }
            />
          </Col>
          <Col breakPoint={{ lg: 4, md: 4 }}>
            <LabelIcon title={<FormattedMessage id="date.end" />} />
            <InputDateTime
              onlyDate
              value={filterValue?.service_date_lte}
              onChange={(e) =>
                changeFilterValue(
                  "service_date_lte",
                  moment(e).format("YYYY-MM-DD")
                )
              }
            />
          </Col>
        </>
      )}
      {selectedFilter?.value === "serviceDate.month" && (
        <>
          <Col breakPoint={{ lg: 4, md: 4 }}>
            <LabelIcon title={<FormattedMessage id="month" />} />
            <Select
              className="mb-2"
              options={selectMonthsOptions}
              placeholder={intl.formatMessage({ id: "month" })}
              onChange={(e) => changeFilterValue("service_date_month", e.value)}
              menuPosition="fixed"
            />
          </Col>
          <Col breakPoint={{ lg: 4, md: 4 }}>
            <LabelIcon title={<FormattedMessage id="year" />} />
            <Select
              className="mb-2"
              options={selectYearsOptions}
              placeholder={intl.formatMessage({ id: "year" })}
              onChange={(e) => changeFilterValue("service_date_year", e.value)}
              menuPosition="fixed"
            />
          </Col>
        </>
      )}

      <Col breakPoint={{ md: 12 }}>
        <LabelIcon title={<FormattedMessage id="filter.by.vessel" />} />
        <SelectMachineEnterprise
          placeholder="filter.by.vessel"
          onChange={(e) => changeFilterValue("vessel_id", e?.value)}
          idEnterprise={props?.enterprises[0]?.id}
          value={vesselId}
        />
      </Col>

      {useOrderFilters && (
        <Col breakPoint={{ md: 9 }} className="mb-2">
          <LabelIcon title={intl.formatMessage({ id: "status" })} />
          <SelectStatusOS
            onChange={(value) =>
              changeFilterValue(
                "status",
                value?.map((x) => x.value)
              )
            }
            value={filterValue?.status}
          />
        </Col>
      )}
      {
        <Col breakPoint={{ md: 9 }} className="mb-2">
          <LabelIcon title={intl.formatMessage({ id: "type" })} />
          <SelectFasType
            onChange={(value) =>
              changeFilterValue(
                "type",
                value.map((e) => e.value)
              )
            }
            isMulti
            noRegularization={false}
          />
        </Col>
      }
      <Col breakPoint={{ lg: 3, md: 12 }} className="pt-4">
        <Row className="m-0 pt-1" center="xs" middle="xs">
          <Button
            size="Tiny"
            status="Info"
            className="mr-1 flex-between"
            onClick={() => onSearch(filterValue)}
            disabled={!filterValue}
          >
            <EvaIcon name="search-outline" />
            <FormattedMessage id="filter" className="ml-1" />
          </Button>
          <Button
            size="Tiny"
            status="Danger"
            className="mr-2 flex-between"
            appearance="ghost"
            onClick={resetFilter}
          >
            <FormattedMessage id="clear.filter" />
          </Button>
        </Row>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(FasAnalyticsFilter);
