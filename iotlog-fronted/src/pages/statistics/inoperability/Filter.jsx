import Col from "@paljs/ui/Col";
import { DateTime, LabelIcon, SelectMachineEnterprise } from "../../../components";
import React from "react";
import { Vessel } from "../../../components/Icons";
import { useTheme } from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { ContainerRow } from "../../consumption/styles";
import { Button, EvaIcon, Row, Select } from "@paljs/ui";
import { SelectView } from "../../../components/Select";


export default function Filter(props) {
  const [dateStart, setDateStart] = React.useState();
  const [dateEnd, setDateEnd] = React.useState();
  const [machine, setMachine] = React.useState();

  const theme = useTheme();
  const intl = useIntl();

  const onFilter = () => {
    props.onFilter({
      dateStart,
      dateEnd,
      idMachine: machine?.value,
      idEnterprise: props.idEnterprise,
    });
  }

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 5 }}>
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                }}
              />
            )}
            title={<FormattedMessage id="vessel" />}
          />
          <div className="mt-1"></div>
          <SelectMachineEnterprise
            onChange={(value) => setMachine(value)}
            value={machine}
            idEnterprise={props.idEnterprise}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }}>
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.start" />}
          />
          <DateTime
            onChangeDate={(value) => setDateStart(value)}
            date={dateStart}
            max={dateEnd}
            onlyDate
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }}>
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="date.end" />}
          />
          <DateTime
            onChangeDate={(value) => setDateEnd(value)}
            date={dateEnd}
            min={dateStart}
            max={maxDate}
            onlyDate
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 2 }}>
          <LabelIcon
            iconName={"eye-outline"}
            title={<FormattedMessage id="view.analytics" />}
          />
          <SelectView
            onChange={(value) => props.setView(value)}
            value={props.view}
          />
        </Col>
        <Col breakPoint={{ xs: 12, md: 1 }}>
          <Row className="m-0 pt-2" middle="xs" center="xs">
            <Button
              size="Tiny"
              status="Basic"
              className="mt-4"
              onClick={onFilter}
              disabled={props.isLoading}
            >
              <EvaIcon name="search-outline" />
            </Button>
          </Row>
        </Col>
      </ContainerRow>
    </>
  )
}
