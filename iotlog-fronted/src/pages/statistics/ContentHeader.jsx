import { Button, EvaIcon, Row, Select } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TextSpan } from "../../components";
import FilterSearchStatistics from "./FilterSearchStatistics";

export default function ContentHeader(props) {
  const [showFilter, setShowFilter] = React.useState(false);
  const [filterData, setFilterData] = React.useState({
    filteredModel: [],
    filteredMachine: [],
    dateInit: props.minDateDefault || moment().startOf('month').format('YYYY-MM-DD') || "",
    dateEnd: moment().subtract(1,'day').format('YYYY-MM-DD') || "",
    timeInit: "00:00",
    timeEnd: "23:59",
    filterFast: 'month'
  });

  const intl = useIntl();

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
  };

  const onFilter = (data) => {
    props.onFilter(data);
    setShowFilter(false);
  };

  const optionsFilterFast = [
    {
      value: 'today',
      label: intl.formatMessage({ id: 'today' })
    },
    {
      value: 'month',
      label: intl.formatMessage({ id: 'in.month' })
    },
    {
      value: "year",
      label: intl.formatMessage({ id: 'in.year' })
    },
    {
      value: 7,
      label: intl.formatMessage({ id: 'last.days' }).replace('{0}', 7)
    },
    {
      value: 15,
      label: intl.formatMessage({ id: 'last.days' }).replace('{0}', 15)
    },
    {
      value: 30,
      label: intl.formatMessage({ id: 'last.days' }).replace('{0}', 30)
    },
    {
      value: "2m",
      label: intl.formatMessage({ id: 'last.months' }).replace('{0}', 2)
    },
    {
      value: "3m",
      label: intl.formatMessage({ id: 'last.months' }).replace('{0}', 3)
    },
    {
      value: "6m",
      label: intl.formatMessage({ id: 'last.months' }).replace('{0}', 6)
    },

  ]

  const onChangeFilterFast = (value) => {
    const dateFilter = getDateFilter(value);
    const newData = {
      dateMin: dateFilter.dateInitial.format('YYYY-MM-DDTHH:mm:ssZ'),
      dateMax: dateFilter.dateFinal.format('YYYY-MM-DDTHH:mm:ssZ'),
      filterFast: value
    }
    setFilterData(prevState => ({
      ...prevState,
      ...newData
    }))
    setTimeout(() => {
      props.onFilter(newData);
    }, 600)
  }

  const getDateFilter = (value) => {
    let dateInitial = moment();
    let dateFinal = moment();

    if ([7, 15, 30].includes(value)) {
      return {
        dateInitial: moment(`${dateInitial.subtract(value, 'days').format("YYYY-MM-DD")}T00:00:00${dateInitial.format("Z")}`),
        dateFinal,
      }
    }
    if (value === 'month') {
      return {
        dateInitial: moment(`${dateInitial.startOf('month').format("YYYY-MM-DD")}T00:00:00${dateInitial.format("Z")}`),
        dateFinal,
      }
    }
    if (['6m', '2m', '3m'].includes(value)) {
      return {
        dateInitial: moment(`${dateInitial.subtract(parseInt(value.replace('m', '')), 'months').format("YYYY-MM-DD")}T00:00:00${dateInitial.format("Z")}`),
        dateFinal,
      }
    }

    if (value === 'year') {
      return {
        dateInitial: moment(`${dateInitial.startOf('year').format("YYYY-MM-DD")}T00:00:00${dateInitial.format("Z")}`),
        dateFinal,
      }
    }

    return {
      dateInitial: moment(`${dateInitial.format("YYYY-MM-DD")}T00:00:00${dateInitial.format("Z")}`),
      dateFinal,
    }
  }

  return (
    <>
      <Row between="xs" className="pl-2 pr-2">
        <TextSpan apparence="s1">
          <FormattedMessage id={props.titleId} />
        </TextSpan>
        <Row className='m-0' style={{ display: 'flex' }}>
          {!!props.showFastFilter && <Select
            options={optionsFilterFast}
            className="mr-4 wf-180"
            placeholder={intl.formatMessage({ id: 'filter.fast' })}
            onChange={(value) => onChangeFilterFast(value?.value)}
            value={optionsFilterFast?.find(x => x.value === filterData?.filterFast)}
          />}
          <Button
            size="Tiny"
            status={showFilter ? "Primary" : "Basic"}
            onClick={() => setShowFilter((prevState) => !prevState)}
          >
            <EvaIcon name={showFilter ? "funnel" : "funnel-outline"} />
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
