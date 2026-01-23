import React from 'react';
import { Card, CardBody, Row, Col, EvaIcon } from '@paljs/ui';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { floatToStringExtendDot } from '../../../components/Utils';
import { TextSpan } from '../../../components';

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`


export default function MiniDashboards({ data, unit, isReal }) {

  const totalConsumption = data?.reduce((a, b) => a + ((isReal ? b?.consumptionReal?.value : b?.consumption?.value) || 0), 0)
  const totalHours = data?.reduce((a, b) => a + b?.hours, 0)

  return (
    <Row>
      <Col breakPoint={{ xs: 12, md: 3 }}>
        <Card>
          <CardBody className="m-0">
            <RowFlex>
              <EvaIcon name="droplet" status={isReal ? "Primary" : "Warning"} />
              <ColFlex className="ml-3">
                <TextSpan apparence='p2' hint>
                  <FormattedMessage id={"consumption"} /> {unit?.label}
                </TextSpan>
                <TextSpan apparence='h6' className="mt-1">
                  {floatToStringExtendDot(totalConsumption, 2)}
                </TextSpan>
              </ColFlex>
            </RowFlex>
          </CardBody>
        </Card>
      </Col>
      <Col breakPoint={{ xs: 12, md: 3 }}>
        <Card>
          <CardBody className="m-0">
            <RowFlex>
              <EvaIcon name="clock-outline" status="Info" />
              <ColFlex className="ml-3">
                <TextSpan apparence='p2' hint style={{ textTransform: `capitalize` }}>
                  <FormattedMessage id="hours" />
                </TextSpan>
                <TextSpan apparence='h6' className="mt-1">
                  {floatToStringExtendDot(totalHours, 2)}
                </TextSpan>
              </ColFlex>
            </RowFlex>
          </CardBody>
        </Card>
      </Col>
      <Col breakPoint={{ xs: 12, md: 3 }}>
        <Card>
          <CardBody className="m-0">
            <RowFlex>
              <EvaIcon name="droplet-off-outline" status={isReal ? "Primary" : "Warning"} />
              <ColFlex className="ml-3">
                <TextSpan apparence='p2' hint>
                  <FormattedMessage id="average" /> {unit?.label}/HR
                </TextSpan>
                <TextSpan apparence='h6' className="mt-1">
                  {floatToStringExtendDot(totalConsumption ? totalConsumption / totalHours : 0, 2)}
                </TextSpan>
              </ColFlex>
            </RowFlex>
          </CardBody>
        </Card>
      </Col>
      <Col breakPoint={{ xs: 12, md: 3 }}>
        <Card>
          <CardBody className="m-0">
            <RowFlex>
              <EvaIcon name="cloud-upload" status="Basic" />
              <ColFlex className="ml-3">
                <TextSpan apparence='p2' hint>
                  CO₂ Ton
                </TextSpan>
                <TextSpan apparence='h6' className="mt-1">
                  {floatToStringExtendDot(Number(data?.reduce((a, b) => a + ((isReal ? b?.consumptionReal?.co2 : b?.consumption?.co2) || 0), 0) / 1000), 2)}
                </TextSpan>
              </ColFlex>
            </RowFlex>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
