import { Button, Col, EvaIcon } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useTheme } from "styled-components";
import { LabelIcon, SelectMachine } from "../../components";
import { Vessel } from "../../components/Icons";
import InputDateTime from "../../components/Inputs/InputDateTime";
import { ContainerRow, RowCenter } from "../consumption/styles";

export function Filter({
  onChange,
  filterQuery,
  idEnterprise,
  onSearchCallback,
}) {
  const theme = useTheme();

  return (
    <>
      <ContainerRow className="mb-4">
        <Col breakPoint={{ xs: 12, md: 4 }} className="mb-2">
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  fill: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
            title={<FormattedMessage id="vessel" />}
          />
          <div style={{ marginTop: 2.6 }}></div>
          <SelectMachine
            idEnterprise={idEnterprise}
            onChange={(value) => onChange("machine", value)}
            placeholder="vessels.select.placeholder"
            value={filterQuery?.machine}
            isMulti
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 3 }} className="mb-2">
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.start" />}
          />
          <InputDateTime
            onChange={(e) => onChange("dateMin", e)}
            value={filterQuery?.dateMin}
            max={
              filterQuery?.dateMax ? new Date(filterQuery?.dateMax) : new Date()
            }
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 3 }} className="mb-2">
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.end" />}
          />
          <InputDateTime
            onChange={(e) => onChange("dateMax", e)}
            value={filterQuery?.dateMax}
            max={new Date()}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2 mt-2">
          <RowCenter>
            <Button
              className="mt-4 flex-between"
              size="Small"
              onClick={onSearchCallback}
              disabled={!filterQuery}
            >
              <EvaIcon name="search-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
          </RowCenter>
        </Col>
      </ContainerRow>
    </>
  );
}
