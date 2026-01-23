import { Button, Card, CardHeader, Col, EvaIcon, Row, Tab, Tabs } from "@paljs/ui";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { SelectMachineEnterprise, TextSpan } from "../../../components";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import ConsumptionFillOnBoard from "./Consumption";
import NoteEletronicFillOnBoard from './NoteEletronic';
import RVEFillOnBoard from "./RVE";
import { styled } from "styled-components";

const EmptyDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
`;

function FillOnBoard(props) {

  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [machine, setMachine] = useState();
  const [idMachine, setIdMachine] = useState();
  const [activeTab, setActiveTab] = useState(0);

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : "";

  return (
    <Card className="mb-0">
      <CardHeader>
        <Col breakPoint={{ xs: 12 }}>
          <Row between="xs" middle="xs">

            <Col breakPoint={{ xs: 4 }}>
              <TextSpan apparence="s1">
                <FormattedMessage id="fill.onboard" /> <FormattedMessage id="daily" />
              </TextSpan>
            </Col>

            <Col breakPoint={{ xs: 4 }}>
              <Row className="m-0" center="xs"
                style={{ flexWrap: 'nowrap' }}
                middle="xs">
                <Button size="Tiny" status="Basic" className="mr-4"
                  onClick={() => setDate(moment(date).subtract(1, 'days').format('YYYY-MM-DD'))}
                >
                  <EvaIcon name="arrow-ios-back-outline" />
                </Button>
                <InputDateTime
                  onlyDate
                  key={new Date(date).getTime()}
                  value={date}
                  onChange={(dateNew) => setDate(moment(dateNew).format('YYYY-MM-DD'))}
                />
                <Button size="Tiny" status="Basic" className="ml-4"
                  onClick={() => setDate(moment(date).add(1, 'days').format('YYYY-MM-DD'))}
                >
                  <EvaIcon name="arrow-ios-forward-outline" />
                </Button>
              </Row>
            </Col>

            <Col breakPoint={{ xs: 4 }}>
              <SelectMachineEnterprise
                onChange={setMachine}
                value={machine}
                idEnterprise={idEnterprise}
                returnMachineIdCallback={setIdMachine}
              />
            </Col>
          </Row>
        </Col>
      </CardHeader>
      <Tabs onSelect={(i) => setActiveTab(i)} activeIndex={activeTab} fullWidth responsive>
        <Tab title="RVE">
          <RVEFillOnBoard
            date={date}
            idEnterprise={idEnterprise}
            idMachine={idMachine}
            timezone={moment().format('Z')} />
        </Tab>
        <Tab title={<FormattedMessage id="event" />}>
          <NoteEletronicFillOnBoard
            date={date}
            idEnterprise={idEnterprise}
            idMachine={idMachine}
            timezone={moment().format('Z')} />
        </Tab>

        <Tab title={<FormattedMessage id="machine.supplies.consumption" />}>
          {machine ? (
            <ConsumptionFillOnBoard
              idMachine={idMachine}
              date={date}
            />
          ) : (
            <EmptyDiv>
              <EvaIcon name="alert-circle-outline"
                status="Basic"
              />
              <TextSpan apparence="p1" hint className="ml-1">
                <FormattedMessage id="machine.placeholder" />
              </TextSpan>
            </EmptyDiv>
          )}
        </Tab>

      </Tabs>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(FillOnBoard);
