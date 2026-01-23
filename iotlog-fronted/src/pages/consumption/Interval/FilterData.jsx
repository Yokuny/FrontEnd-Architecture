import React from 'react';
import { Col, EvaIcon, Button, Select } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import { LabelIcon, SelectConsumptionMachine } from '../../../components';
import { Vessel } from '../../../components/Icons';
import InputDateTime from '../../../components/Inputs/InputDateTime';
import { ContainerRow, RowCenter } from '../styles';

const unitOptions = [
  { label: "Ton", value: "T" },
  { label: "L", value: "L" },
  { label: "m³", value: "m³" },
];

export default function FilterData({
  onChange,
  filterQuery,
  idEnterprise,
  onSearchCallback,
}) {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <>
      <ContainerRow className="mb-4">
        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.start" />}
          />
          <InputDateTime
            onChange={(e) => onChange("dateMin", e)}
            value={filterQuery?.dateMin}
            onlyDate
            max={filterQuery?.dateMax ? new Date(filterQuery?.dateMax) : new Date()}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.end" />}
          />
          <InputDateTime
            onChange={(e) => onChange("dateMax", e)}
            value={filterQuery?.dateMax}
            onlyDate
            max={new Date()}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
          <LabelIcon
            iconName={"droplet-outline"}
            title={<FormattedMessage id="unit" />}
          />
          <Select
            options={unitOptions}
            value={filterQuery?.unitSearch}
            onChange={(e) => onChange("unitSearch", e)}
            placeholder={intl.formatMessage({ id: "unit" })}
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 4 }} className="mb-2">
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2
                }}
              />
            )}
            title={<FormattedMessage id="vessel" />}
          />
          <div style={{ marginTop: 2.6 }}></div>
          <SelectConsumptionMachine
            isMulti={true}
            idEnterprise={idEnterprise}
            onChange={(value) =>
              onChange("machines", value)
            }
            placeholder="vessels.select.placeholder"
            value={filterQuery?.machines}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2 pt-2">
          <RowCenter>
            <Button
              className="mt-3 flex-between"
              size="Small"
              onClick={onSearchCallback}
            >
              <EvaIcon name="search-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
          </RowCenter>
        </Col>
      </ContainerRow>
    </>
  )
}
