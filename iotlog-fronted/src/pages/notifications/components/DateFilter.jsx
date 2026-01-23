import React from "react";
import { FormattedMessage } from "react-intl";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import styled from "styled-components";
import { LabelIcon } from "../../../components";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

const DateFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 0.5rem;
  align-items: flex-end;
`;

const FilterButton = styled(Button)`
  height: 40px;
  margin-left: auto;
`;

const DateFilter = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const dateMin = searchParams.get('dateMin');
  const dateMax = searchParams.get('dateMax');

  const [dateFilter, setDateFilter] = React.useState({
    dateMin: null,
    dateMax: null
  });

  React.useEffect(() => {

    if (!dateMin || !dateMax) {
      setSearchParams({
        dateMin: moment(`${moment().subtract(30, 'days').format('YYYY-MM-DD')}T00:00:00`).toISOString(),
        dateMax: moment().toISOString()
      });
      setDateFilter({
        dateMin: moment(`${moment().subtract(30, 'days').format('YYYY-MM-DD')}T00:00:00`).toDate(),
        dateMax: new Date()
      });
    } else {
      setDateFilter({
        dateMin: moment(dateMin).toDate(),
        dateMax: moment(dateMax).toDate()
      });
    }
  }, []);


  const handleDateChange = (field, value) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onConfirm = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('dateMin', moment(dateFilter.dateMin).format('YYYY-MM-DDTHH:mm:ssZ'));
    newParams.set('dateMax', moment(dateFilter.dateMax).format('YYYY-MM-DDTHH:mm:ssZ'));
    setSearchParams(newParams);
  };

  return (
    <DateFilterContainer>
      <Col breakPoint={{ xs: 12, md: 5.5 }}>
        <LabelIcon
          iconName="calendar-outline"
          title={<FormattedMessage id="date.start" />}
        />
        <InputDateTime
          onChange={(e) => handleDateChange("dateMin", e)}
          value={dateFilter.dateMin}
          max={dateFilter.dateMax}
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 5.5}}>
        <LabelIcon
          iconName="calendar-outline"
          title={<FormattedMessage id="date.end" />}
        />
        <InputDateTime
          onChange={(e) => handleDateChange("dateMax", e)}
          value={dateFilter.dateMax}
          max={new Date()}
          min={dateFilter.dateMin}
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 1 }} style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Row center="xs" middle="xs" className="m-0 pb-1">
          <FilterButton
            onClick={() => onConfirm()}
            size="Tiny"
            status="Basic"
            className="flex-between"
          >
            <EvaIcon name="search-outline" className="mr-1" />
            <FormattedMessage id="filter" />
          </FilterButton>
        </Row>
      </Col>
    </DateFilterContainer>
  );
};

export default DateFilter;
