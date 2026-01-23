import React from "react";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { LabelIcon } from "../../../../../components";
import InputDateTime from "../../../../../components/Inputs/InputDateTime";
import moment from "moment";

const StyledInputWrapper = styled.div`
    input {
        font-size: 0.8rem !important;
        padding-left: 0.4rem !important;
    }
    svg {
        max-height: 0.95rem !important;
        margin-left: 0.6rem !important;
    }
`;

const ColFlex = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TimelineFilter = ({
  onFilter,
  onClear,
  filteredMin,
  filteredMax,
  setFilteredMin,
  setFilteredMax
}) => {
  const handleSearch = () => {
    if (onFilter && (filteredMin || filteredMax)) {
      const formattedMin = filteredMin
        ? moment(filteredMin).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
        : null;
      const formattedMax = filteredMax
        ? moment(filteredMax).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
        : null;

      onFilter({
        dateMin: formattedMin,
        dateMax: formattedMax,
      });
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  const hasActiveFilter = filteredMin !== undefined || filteredMax !== undefined;

  return (
    <Row className="m-0 pl-2 pr-2 pt-2" around="xs">
      <ColFlex>
        <LabelIcon
          iconName="calendar-outline"
          title={<FormattedMessage id="date.start" />}
        />
        <StyledInputWrapper>
          <InputDateTime
            onChange={(e) => setFilteredMin(e)}
            value={filteredMin}
            max={filteredMax || new Date()}
            onlyDate
          />
        </StyledInputWrapper>
      </ColFlex>
      <ColFlex className="ml-3">
        <LabelIcon
          iconName="calendar-outline"
          title={<FormattedMessage id="date.end" />}
        />
        <StyledInputWrapper>
          <InputDateTime
            onChange={(e) => setFilteredMax(e)}
            value={filteredMax}
            max={new Date()}
            min={filteredMin}
            onlyDate
            className="px-1"
          />
        </StyledInputWrapper>
      </ColFlex>
      <ColFlex className="ml-2"
        style={{ justifyContent: 'flex-end' }}
      >
        <RowFlex className="mb-1">
          <Button
            onClick={handleSearch}
            status="Primary"
            disabled={!filteredMin && !filteredMax}
            size="Tiny"
            style={{ padding: '4px' }}
          >
            <EvaIcon name="search-outline" />
          </Button>
          {hasActiveFilter && (
            <Button
              onClick={handleClear}
              status="Danger"
              appearance="ghost"
              size="Tiny"
              className="ml-1"
              style={{ padding: '2px' }}
            >
              <EvaIcon name="close-outline" />
            </Button>
          )}
        </RowFlex>
      </ColFlex>
    </Row>
  );
};

export default TimelineFilter;

