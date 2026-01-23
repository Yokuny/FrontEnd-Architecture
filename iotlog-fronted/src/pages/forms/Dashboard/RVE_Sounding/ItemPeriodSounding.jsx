import React from "react";
import { Button, CardBody, CardHeader, Col, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { CardNoShadow, LabelIcon, TextSpan } from "../../../../components";
import TableListRVESounding from "./TableListRVESounding";
import { floatToStringExtendDot } from "../../../../components/Utils";

const ItemPeriodSounding = (props) => {

  const [isOpen, setIsOpen] = React.useState(-1);

  const { data } = props;

  const totalRegisters = data?.sounding?.length || 0;

  let registersBroken4 = parseInt(totalRegisters / 3) + 1;
  registersBroken4 = registersBroken4 > 0 ? registersBroken4 : 1;

  return (
    <>
      {new Array(registersBroken4).fill(0).map((x, i) => {

        const dataInThisPeriod = data?.sounding?.slice(i * 3, ((i + 1) * 3) + 1);

        if (!dataInThisPeriod?.length) return null;

        const lastIndex = dataInThisPeriod.length - 1;

        const rdosInThisInterval = data?.rdo
          ?.filter((rdo) =>
            moment(rdo.date).isSameOrAfter(moment(dataInThisPeriod[0].date)) &&
            moment(rdo.date).isSameOrBefore(moment(dataInThisPeriod[lastIndex] ? dataInThisPeriod[lastIndex]?.date : new Date()))
          )

        const operationsInThisInterval = data.operations
          ?.filter((operation) =>
            moment(operation.dateStart).isSameOrAfter(moment(dataInThisPeriod[0].date)) &&
            moment(operation.dateStart).isSameOrBefore(moment(dataInThisPeriod[lastIndex] ? dataInThisPeriod[lastIndex]?.date : new Date()))
          )

        const totalSupply = rdosInThisInterval
          ?.reduce((acc, rdo) => acc + rdo.supply, 0)

        const totalReceive = rdosInThisInterval
          ?.reduce((acc, rdo) => acc + rdo.received, 0)

        const consumed = lastIndex
          ? (dataInThisPeriod[0]?.volume + totalReceive) - (dataInThisPeriod[lastIndex]?.volume + totalSupply)
          : 0

        const maxAllow = operationsInThisInterval
          ?.reduce((acc, operation) => acc +
            (operation?.consumptionDailyContract
              ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
              : 0),
            0)

        return <CardNoShadow key={i}>
          <CardHeader>
            <Row middle="xs" between="xs">
              <Col breakPoint={{ xs: 11, md: 11 }}>
                <Row middle="xs">
                  <Col breakPoint={{ xs: 12, md: 1.5 }} style={{ display: "flex", flexDirection: "column" }}>
                    <LabelIcon
                      title={<FormattedMessage id="start" />}
                    />
                    <Row className="m-0" middle="xs">
                      {/* <EvaIcon name="clock-outline" status="Basic" className="mr-1" /> */}
                      <TextSpan apparence='p2'>
                        {dataInThisPeriod[0]?.date ? moment(dataInThisPeriod[0].date).format("DD MMM, HH:mm") : ""}
                      </TextSpan>
                    </Row>
                    <Row className="m-0" middle="xs">
                      {/* <EvaIcon name="droplet-outline" status="Basic" className="mr-1" /> */}
                      <TextSpan apparence='s2'>
                        {floatToStringExtendDot(dataInThisPeriod[0]?.volume, 3)}
                        <TextSpan apparence="p3" hint className="ml-1">
                          m³
                        </TextSpan>
                      </TextSpan>
                    </Row>
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 1.5 }} style={{ display: "flex", flexDirection: "column" }}>
                    <LabelIcon
                      title={<FormattedMessage id="end" />}
                    />
                    <Row className="m-0" middle="xs">
                      {/* <EvaIcon name="clock-outline" status="Basic" className="mr-1" /> */}
                      <TextSpan apparence='p2'>
                        {dataInThisPeriod[lastIndex]?.date ? moment(dataInThisPeriod[lastIndex].date).format("DD MMM, HH:mm") : ""}
                      </TextSpan>
                    </Row>
                    <Row className="m-0" middle="xs">
                      {/* <EvaIcon name="droplet-outline" status="Basic" className="mr-1" /> */}
                      <TextSpan apparence='s2'>
                        {floatToStringExtendDot(dataInThisPeriod[lastIndex]?.volume, 3)}
                        <TextSpan apparence="p3" hint className="ml-1">
                          m³
                        </TextSpan>
                      </TextSpan>
                    </Row>
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 2.5 }}>
                    <LabelIcon
                      title={<FormattedMessage id="moving" />}
                    />
                    <Row className="m-0" middle="xs">
                      <EvaIcon name="arrow-circle-down-outline" status="Basic" className="mr-1" />
                      <TextSpan apparence='p2' className>
                        {floatToStringExtendDot(totalReceive, 3)}
                        <TextSpan apparence="p3" hint className="ml-1">
                          m³
                        </TextSpan>
                        <TextSpan apparence="p3" hint className="ml-1">
                          <FormattedMessage id="machine.supplies.consumption.received" />
                        </TextSpan>
                      </TextSpan>
                    </Row>
                    <Row className="m-0" middle="xs">
                      <EvaIcon name="arrow-circle-up-outline" status="Basic" className="mr-1" />
                      <TextSpan apparence='p2'>
                        {floatToStringExtendDot(totalSupply, 3)}
                        <TextSpan apparence="p3" hint className="ml-1">
                          m³
                        </TextSpan>
                        <TextSpan apparence="p3" hint className="ml-1">
                          <FormattedMessage id="machine.supplies.consumption.supplied" />
                        </TextSpan>
                      </TextSpan>
                    </Row>
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 2 }}>
                    <LabelIcon
                      title={<FormattedMessage id="maximum" />}
                    />
                    <Row className="m-0" middle="xs">
                      <EvaIcon name={"trending-up-outline"}
                        status={maxAllow && consumed && maxAllow < consumed ? "Danger" : "Basic"}
                        className="mr-1" />
                      <TextSpan apparence='p2'>
                        {floatToStringExtendDot(maxAllow, 3)}
                        <TextSpan apparence="p3" hint className="ml-1">
                          m³
                        </TextSpan>
                      </TextSpan>
                    </Row>
                  </Col>
                  <Col breakPoint={{ xs: 12, md: 2.5 }}>
                    <Row
                      className="m-0"
                      middle="xs" center="xs">
                      <Col breakPoint={{ md: 12 }}>
                        <LabelIcon
                          title={<FormattedMessage id="consumption" />}
                        />
                        <Row className="m-0" middle="xs">
                          <EvaIcon name="droplet-outline" status={
                            maxAllow && consumed
                              ? maxAllow > consumed ? "Success" : "Danger"
                              : "Basic"} className="mr-1" />
                          <TextSpan apparence='s1'>
                            {floatToStringExtendDot(consumed, 3)}
                            <TextSpan apparence="p3" hint className="ml-1">
                              m³
                            </TextSpan>
                          </TextSpan>
                        </Row>
                      </Col>
                    </Row>
                  </Col>

                  <Col breakPoint={{ xs: 12, md: 2 }}>
                    <Row
                      className="m-0"
                      middle="xs" center="xs">
                      {maxAllow < consumed && <Button
                        appearance="ghost"
                        style={{
                          border: 0,
                          fontSize: '0.55rem'
                        }}
                        className="flex-between"
                        status={"Danger"}
                        size="Tiny"
                      >
                        <EvaIcon
                          options={{
                            height: 19,
                          }}
                          name="alert-triangle" className="mr-1" />
                        <FormattedMessage id="in.excess" />
                      </Button>}
                      {dataInThisPeriod?.length >= 4 && maxAllow > consumed && <Button
                        appearance="ghost"
                        style={{
                          border: 0,
                          fontSize: '0.55rem'
                        }}
                        status={"Success"}
                        size="Tiny"
                      >
                        <EvaIcon
                          options={{
                            height: 19,
                          }}
                          name="trending-down-outline" className="mr-1" />
                        <FormattedMessage id="below.contract" />
                      </Button>}
                      {dataInThisPeriod?.length < 4 && <Button
                        appearance="ghost"
                        style={{
                          border: 0,
                          fontSize: '0.5rem'
                        }}
                        className="flex-between"
                        status={"Warning"}
                        size="Tiny"
                      >
                        <EvaIcon
                          options={{
                            height: 18,
                          }}
                          name="info" className="mr-1" />
                        <FormattedMessage id="period.not.close" />
                      </Button>}
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col breakPoint={{ xs: 11, md: 1 }}>
                <Button
                  appearance="ghost"
                  status="Basic"
                  className="ml-2"
                  onClick={() => setIsOpen(prev => prev === i ? -1 : i)}
                >
                  <EvaIcon name={isOpen === i
                    ? "arrow-ios-upward-outline" : "arrow-ios-downward-outline"} />
                </Button>
              </Col>
            </Row>

          </CardHeader>
          {isOpen === i &&
            <CardBody>
              <TableListRVESounding
                data={{
                  ...data,
                  sounding: dataInThisPeriod,
                }}
                key={props.key}
              />
            </CardBody>
          }
        </CardNoShadow>
      })}
    </>
  )
}

export default ItemPeriodSounding;
