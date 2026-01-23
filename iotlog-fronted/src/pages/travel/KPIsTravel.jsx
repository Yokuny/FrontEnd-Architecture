import { Card, CardBody } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import { CardNoShadow, TextSpan } from "../../components";
import { Crane, MapMarkerDistance } from "../../components/Icons";
import { floatToStringExtendDot } from "../../components/Utils";

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export default function KPIsTravel(props) {
  const theme = useTheme()

  const { data } = props;

  const manuever = data?.find(x => x.travelType === "maneuver");
  const travel = data?.find(x => x.travelType === "travel");

  return (
    <>
      <Row className="m-0 p-4">
        <Col breakPoint={{ md: 4, xs: 6 }} className="mb-4">
          <CardNoShadow className="mb-2">
            <CardBody className="m-0">
              <RowFlex className="p-1">
                <MapMarkerDistance
                  style={{
                    height: 40,
                    width: 40,
                    fill: theme.colorPrimary500,
                    padding: 2
                  }}
                />
                <ColFlex className="ml-2">
                  <TextSpan apparence='h6' className="mt-1">
                    {travel?.count || 0}
                  </TextSpan>
                  <TextSpan apparence='p3' hint>
                    <FormattedMessage id="list.travel" />
                  </TextSpan>
                </ColFlex>
              </RowFlex>
            </CardBody>
          </CardNoShadow>
        </Col>
        <Col breakPoint={{ md: 4, xs: 6 }}>
          <CardNoShadow className="mb-2">
            <CardBody className="m-0">
              <RowFlex className="p-1">
                <EvaIcon
                  name="clock-outline"
                  status="Primary"
                  options={{
                    height: 28,
                    width: 28,
                  }}
                />
                <ColFlex className="ml-4">
                  <TextSpan apparence='h6' className="mt-1">
                    {floatToStringExtendDot(Number((travel?.time ?? 0) / 60))}
                  </TextSpan>
                  <TextSpan apparence='p3' hint>
                    <FormattedMessage id="hour.unity" /> (<FormattedMessage id="travel" />)
                  </TextSpan>
                </ColFlex>
              </RowFlex>
            </CardBody>
          </CardNoShadow>
        </Col>
        <Col breakPoint={{ md: 4, xs: 6 }}>
          <CardNoShadow className="mb-2">
            <CardBody className="m-0">
              <RowFlex className="p-1">
                <EvaIcon
                  name="activity-outline"
                  status="Primary"
                  options={{
                    height: 28,
                    width: 28,
                  }}
                />
                <ColFlex className="ml-4">

                  <TextSpan apparence='h6' className="mt-1">
                    {floatToStringExtendDot(Number(((travel?.time ?? 0) / 60)) / travel?.count)}
                  </TextSpan>
                  <TextSpan apparence='p4' hint>
                    <FormattedMessage id="average" /> (<FormattedMessage id="travel" /> HR)
                  </TextSpan>
                </ColFlex>
              </RowFlex>
            </CardBody>
          </CardNoShadow>
        </Col>
        <Col breakPoint={{ md: 4, xs: 6 }}>
          <CardNoShadow className="mb-2">
            <CardBody className="m-0">
              <RowFlex className="p-1">
                <Crane
                  style={{
                    height: 40,
                    width: 40,
                    fill: theme.colorDanger500,
                    padding: 2
                  }}
                />
                <ColFlex className="ml-4">
                  <TextSpan apparence='h6' className="mt-1">
                    {manuever?.count || 0}
                  </TextSpan>
                  <TextSpan apparence='p3' hint>
                    <FormattedMessage id="in.port" />
                  </TextSpan>
                </ColFlex>
              </RowFlex>
            </CardBody>
          </CardNoShadow>
        </Col>
        <Col breakPoint={{ md: 4, xs: 6 }}>
          <CardNoShadow className="mb-2">
            <CardBody className="m-0">
              <RowFlex className="p-1">
                <EvaIcon
                  name="clock-outline"
                  status="Danger"
                  options={{
                    height: 28,
                    width: 28,
                  }}
                />
                <ColFlex className="ml-4">

                  <TextSpan apparence='h6' className="mt-1">
                    {floatToStringExtendDot(Number((manuever?.time ?? 0) / 60))}
                  </TextSpan>
                  <TextSpan apparence='p3' hint>
                    <FormattedMessage id="hour.unity" /> (<FormattedMessage id="port" />)
                  </TextSpan>
                </ColFlex>
              </RowFlex>
            </CardBody>
          </CardNoShadow>
        </Col>
        <Col breakPoint={{ md: 4, xs: 6 }}>
          <CardNoShadow className="mb-2">
            <CardBody className="m-0">
              <RowFlex className="p-1">
                <EvaIcon
                  name="activity-outline"
                  status="Danger"
                  options={{
                    height: 28,
                    width: 28,
                  }}
                />
                <ColFlex className="ml-4">

                  <TextSpan apparence='h6' className="mt-1">
                    {floatToStringExtendDot(Number(((manuever?.time ?? 0) / 60)) / manuever?.count)}
                  </TextSpan>
                  <TextSpan apparence='p3' hint>
                    <FormattedMessage id="average" /> (<FormattedMessage id="port" /> HR)
                  </TextSpan>
                </ColFlex>
              </RowFlex>
            </CardBody>
          </CardNoShadow>
        </Col>
      </Row>
    </>
  );
}
