import { Card, CardBody, Col, Row } from '@paljs/ui'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import { TextSpan, Tracker } from '../../../components'
import { useIntl } from 'react-intl'
import { DivCircle, getStatusColor } from './Utils'


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

export default function Benchmark(props) {

  const { data } = props;

  const intl = useIntl();
  const theme = useTheme();


  const statusDistincts = [...new Set(data?.map(x => x.status))];

  const total = statusDistincts.reduce((acc, status) => {
    acc[status] = data?.filter(x => x.status === status).length;
    return acc;
  }, {});

  const itens = [
    {
      status: 'ok',
      text: 'Ok',
      value: total?.ok || 0
    },
    // { status: 'warning', text: intl.formatMessage({ id: "warn" }), value: total?.warning || 0 },
    { status: 'anomaly', text: intl.formatMessage({ id: "anamoly.detected" }), value: total?.anomaly || 0 },
    { status: 'off', text: 'Off-line', value: total?.off || 0 }
  ]

  return (<>
    <Row>
      {itens?.map((x, i) => <Col key={i} breakPoint={{ xs: 12, md: 4 }}>
        <Card className="mb-2">
          <CardBody className="m-0">
            <RowFlex>
              <DivCircle
                style={{
                  minWidth: '17px',
                  minHeight: '17px',
                  backgroundColor: getStatusColor(x.status, theme) }}
              />
              <ColFlex className="ml-3">
                <TextSpan apparence='p2' hint>
                  {x?.text}
                </TextSpan>
                <TextSpan apparence='h6' className="mt-1">
                  {x.value}
                </TextSpan>
              </ColFlex>
            </RowFlex>
          </CardBody>
        </Card>
      </Col>)}
    </Row>
  </>)
}
