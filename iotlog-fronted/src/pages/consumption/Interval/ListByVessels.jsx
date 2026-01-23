import React from "react"
import { CardBody, Card, Row, Col, CardHeader, EvaIcon, Tooltip } from "@paljs/ui"
import styled from "styled-components"
import { FormattedMessage } from "react-intl"
import { TextSpan } from "../../../components"
import { floatToStringExtendDot } from "../../../components/Utils"
import { BadgeEstimated } from "../Daily/Utils"


const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .15rem;
`

export default function ListByVessels({ data, unit, isReal }) {

  const vesselsDistinct = [
    ...new Set(data?.map(x => x?.machine?.id)),
  ]

  if (vesselsDistinct?.length <= 1) return null

  return (<>
    <Row>
      {vesselsDistinct?.map((vessel, index) => {
        const dataFromThisVessel = data?.filter(x => x?.machine?.id === vessel)
        const totalHours = dataFromThisVessel?.reduce((acc, curr) => acc + curr?.hours, 0)
        const totalConsumption = dataFromThisVessel?.reduce((acc, curr) => acc + ((isReal ? curr?.consumptionReal?.value : curr?.consumption?.value) || 0), 0)
        const totalCo2 = dataFromThisVessel?.reduce((acc, curr) => acc + ((isReal ? curr?.consumptionReal?.co2 : curr?.consumption?.co2) || 0), 0)

        return <Col breakPoint={{ xs: 12, md: 3 }} key={index}>
          <Card>
            <CardHeader>
              <Row className="m-0" between="xs" middle="xs">
                <TextSpan apparence='s2' hint>{dataFromThisVessel[0]?.machine?.name}</TextSpan>
                <Tooltip
                  placement="top"
                  content={<FormattedMessage id={
                    isReal
                      ? "real.consumption"
                      : "estimated.consumption"
                  } />}
                  trigger="hint"
                >
                  <BadgeEstimated status={isReal ? "Primary" : "Warning"}>
                    {isReal
                      ? "SON*"
                      : "FLM*"
                    }</BadgeEstimated>
                </Tooltip>
              </Row>
            </CardHeader>
            <CardBody>
              <RowStyled className="mr-3">
                <EvaIcon name="clock-outline" status="Info" />
                <TextSpan apparence='s2'>{floatToStringExtendDot(totalHours, 2)}
                  <TextSpan apparence='p3' className="ml-1" hint>HR</TextSpan>
                </TextSpan>
              </RowStyled>
              <RowStyled className="mt-1 mr-4 pr-1">
                <EvaIcon name="droplet" status={isReal ? "Primary" : "Warning"} />
                <TextSpan apparence='s2'>{floatToStringExtendDot(totalConsumption, 2)}
                  <TextSpan apparence='p3' className="ml-1" hint>{unit?.label}</TextSpan>
                </TextSpan>
              </RowStyled>
              <RowStyled className="mt-1">
                <EvaIcon name="droplet-off-outline" status={isReal ? "Primary" : "Warning"} />
                <TextSpan apparence='s2'>{floatToStringExtendDot(totalHours ? totalConsumption / totalHours : 0, 3)}
                  <TextSpan apparence='p3' className="ml-1" hint>{unit?.label}/HR</TextSpan>
                </TextSpan>
              </RowStyled>
              <RowStyled className="mt-1 mr-2">
                <EvaIcon name="cloud-upload" status="Basic" />
                <TextSpan apparence='s2'>{floatToStringExtendDot(Number(totalCo2 / 1000), 2)}
                  <TextSpan apparence='p3' className="ml-1" hint>Ton</TextSpan>
                </TextSpan>
              </RowStyled>
            </CardBody>
          </Card>
        </Col>
      })}
    </Row>
  </>)
}
