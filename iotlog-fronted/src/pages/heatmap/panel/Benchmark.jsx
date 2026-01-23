import { Card, CardBody, Col, Row } from '@paljs/ui'
import React from 'react'
import styled from 'styled-components'
import { TextSpan, Tracker } from '../../../components'


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

  const { total } = props;

  const itens = [
    {
      status: 'Success',
      text: 'Working',
      value: total?.working || 0
    },
    { status: 'Danger', text: "Em alerta", value: total?.inalert || 0 },
    { status: 'Warning', text: "Atenção", value: total?.warning || 0 },
    { status: 'Info', text: "Parado", value: total?.stopped || 0 },
    { status: 'Basic', text: "Off-line", value: total?.off || 0 },
  ]

  return (<>
    <Row>
      {itens?.map((x, i) => <Col key={i} breakPoint={{ xs: 12, md: 2.4 }}>
        <Card className="mb-2">
          <CardBody className="m-0">
            <RowFlex>
              <Tracker itens={[{
                status: x?.status,
                tooltip: x?.text,
              }]} />
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
