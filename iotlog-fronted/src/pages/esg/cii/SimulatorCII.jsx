import React from 'react';
import { Card, CardBody, CardHeader, Col, EvaIcon, InputGroup, Row, Select, Tooltip } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { LabelIcon, TextSpan } from '../../../components'
import { Vessel, Container, Route } from '../../../components/Icons'
import SelectCIIReference from "../../register/model-machines/SelectCIIReference";
import { InputDecimal } from '../../../components/Inputs/InputDecimal';
import { TABLE, TBODY, TD, TH, THEAD, TR } from '../../../components/Table';
import CIIService from '../../../components/cii/CIIService';
import { floatToStringBrazilian, floatToStringExtendDot } from '../../../components/Utils';
import CIIRating from '../../statistics/CII/CIIRating';

const ItemBadge = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export default function SimulatorCII() {
  const theme = useTheme();
  const intl = useIntl();

  const [data, setData] = React.useState({
    consumptionIFO: 0,
    consumptionMDO: 0
  });

  const onChange = (prop, value) => {
    setData(prevState => ({ ...prevState, [prop]: value }))
  }

  const yearsFactor = [
    // {
    //   year: '2023',
    //   factor: 5
    // },
    {
      year: '2024',
      factor: 7
    },
    {
      year: '2025',
      factor: 9
    },
    {
      year: '2026',
      factor: 11
    },
    {
      year: '2027',
      factor: 13
    }
  ]


  const ciiRef = CIIService.calculateCIIReference({
    typeVessel: data?.typeVessel,
    dwt: data?.deadWeight
  })

  const referenceAc = CIIService._getRefenceAC(
    data?.typeVessel,
    data?.deadWeight,
    0
  )

  const emissionsCo2 = (data?.consumptionIFO ? data?.consumptionIFO * 3.1166 : 0) + (data?.consumptionMDO ? data?.consumptionMDO * 2.68 : 0)
  const ciiAttained = (emissionsCo2 / (data?.deadWeight * data?.distance)) * Math.pow(10, 6)

  return (<>
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="simulator.cii" />
        </TextSpan>
      </CardHeader>
      <CardBody className="m-0">
        <Row>
          <Col breakPoint={{ md: 6 }}>
            <Row>
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon
                  title={<FormattedMessage id="type.vessel" />}
                  renderIcon={() => (
                    <Vessel
                      style={{
                        height: 13,
                        width: 13,
                        color: theme.textHintColor,
                        marginRight: 5,
                        marginTop: 2,
                        marginBottom: 2,
                      }}
                    />
                  )}
                />
                <div className="mt-1"></div>
                <SelectCIIReference
                  onChange={(value) => onChange("typeVessel", value?.value)}
                  value={data?.typeVessel}
                />
              </Col>
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon
                  title={<FormattedMessage id="deadweight" />}
                  renderIcon={() => (
                    <Container
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
                />
                <InputGroup fullWidth className="mt-1">
                  <InputDecimal
                    onChange={(e) => onChange("deadWeight", e)}
                    value={data?.deadWeight}
                    sizeDecimals={2}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 6 }} className='mt-2'>
                <LabelIcon
                  title={`${intl.formatMessage({ id: 'consume' })} Ton (IFO)`}
                  iconName="droplet"
                />
                <InputGroup fullWidth>
                  <InputDecimal
                    onChange={(e) => onChange("consumptionIFO", e)}
                    value={data?.consumptionIFO}
                    sizeDecimals={3}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 6 }} className='mt-2'>
                <LabelIcon
                  title={`${intl.formatMessage({ id: 'consume' })} Ton (MDO)`}
                  iconName="droplet-outline"
                />
                <InputGroup fullWidth>
                  <InputDecimal
                    onChange={(e) => onChange("consumptionMDO", e)}
                    value={data?.consumptionMDO}
                    sizeDecimals={3}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 6 }} className='mt-2'>
                <LabelIcon
                  title={`${intl.formatMessage({ id: 'distance' })} (nm)`}
                  renderIcon={() => (
                    <Route
                      style={{
                        height: 13,
                        width: 13,
                        fill: theme.textHintColor,
                        marginRight: 5,
                      }}
                    />
                  )}
                />
                <InputGroup fullWidth>
                  <InputDecimal
                    onChange={(e) => onChange("distance", e)}
                    value={data?.distance}
                    sizeDecimals={3}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Col>
          <Col breakPoint={{ md: 6 }}>

            <TABLE>
              <THEAD>
                <TR>
                  <TH textAlign="center">
                    <TextSpan apparence='s2'>
                      CII Ref
                    </TextSpan>
                  </TH>
                  <TH textAlign="center">
                    <TextSpan apparence='s2'>
                      CII Attained
                    </TextSpan>
                  </TH>
                  {yearsFactor?.map((x) => <TH key={x.year} textAlign="center">
                    <TextSpan apparence='s2'>
                      {x.year}
                    </TextSpan>
                  </TH>)}
                </TR>
              </THEAD>
              <TBODY>
                <TR>
                  <TD textAlign="center">
                    <TextSpan apparence='p2'>
                      {floatToStringBrazilian(ciiRef, 2)}
                    </TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence='p2'>
                      {floatToStringBrazilian(ciiAttained, 2)}
                    </TextSpan>
                  </TD>
                  {yearsFactor?.map((x) => <>
                    <TD key={`a_${x.year}`} textAlign="center">
                      {!!referenceAc &&
                        <Tooltip
                          placement="top"
                          trigger="hint"
                          content={<TextSpan apparence="c1">
                            {`${x.year} (${x.factor}%)`}
                            <br />
                            CII Req: <TextSpan apparence="s2">
                              {floatToStringExtendDot(ciiRef * ((100 - x.factor) / 100), 2)}
                            </TextSpan>
                            <br />
                            CII Atteined: <TextSpan apparence="s2">
                              {floatToStringExtendDot(ciiAttained, 2)}
                            </TextSpan>
                          </TextSpan>}
                        >
                          <ItemBadge key={`${x.year}-a-b`}>
                            <CIIRating
                              dd={referenceAc?.dd}
                              ciiAttained={ciiAttained}
                              ciiReq={ciiRef * ((100 - x.factor) / 100)}
                            />
                          </ItemBadge>
                        </Tooltip>}
                    </TD>
                  </>)}
                </TR>
                {/* <TR>
                  <TD></TD>
                  <TD></TD>
                  {yearsFactor?.map((x) => <>
                    <TD key={`a_${x.year}`} textAlign="center">
                      {!!referenceAc && <TextSpan apparence='p2'>
                        {floatToStringBrazilian(ciiRef * ((100 - x.factor) / 100), 2)}
                      </TextSpan>}
                    </TD>
                  </>)}

                </TR> */}
              </TBODY>
            </TABLE>

          </Col>
          <Col breakPoint={{ md: 12 }}>

          </Col>
        </Row>
      </CardBody>
    </Card>
  </>)
}
