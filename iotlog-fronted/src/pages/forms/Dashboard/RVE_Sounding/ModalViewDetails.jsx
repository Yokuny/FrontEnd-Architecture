import { Button, CardBody, Col, EvaIcon, Row, Tooltip } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import moment from "moment";
import { DownloadCSV, Modal, TextSpan } from "../../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";

import { calculateTimeDifference, floatToStringExtendDot } from "../../../../components/Utils";

const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  .position-col-dynamic {
    justify-content: flex-end;
  }

  position: sticky;
  top: 0;

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
  }
`;

export default function ModalViewDetails(props) {

  const [showModal, setShowModal] = React.useState(false);

  const { operations, rdo, index } = props;

  const getDataOperations = () => {
    return operations
      ?.map(x => {
        return {
          date: moment(x.dateStart).format("DD MMM YYYY"),
          operation: x.code,
          start: moment(x.dateStart).format("HH:mm"),
          end: moment(x.dateEnd).format("HH:mm"),
          duration: calculateTimeDifference(x.dateEnd, x.dateStart),
          contractMax: floatToStringExtendDot((x.consumptionDailyContract / 24) * x.diffInHours, 2)
        }
      })
  }

  const getDataRDO = () => {
    return rdo
      ?.filter(x => x.received || x.supply)
      ?.map(x => {
        return {
          date: moment(x.date).format("DD MMM YYYY"),
          time: moment(x.date).format("HH:mm"),
          timezone: moment(x.date).format("Z"),
          received: floatToStringExtendDot(x.received, 3),
          supply: floatToStringExtendDot(x.supply, 3)
        }
      })
  }

  return (
    <>
      <Tooltip
        trigger="hint"
        placement="top"
        content={
          <TextSpan apparence="p2">
            <FormattedMessage id="view" />
          </TextSpan>
        }
      >
        <Button
          status={"Basic"}
          size="Tiny"
          style={{
            padding: "2px",
          }}
          onClick={() => setShowModal(true)}
        >
          <EvaIcon name="eye-outline" />
        </Button>
      </Tooltip>
      {showModal && <Modal
        title={"polling"}
        show={showModal}
        key={index}
        onClose={() => setShowModal(false)}
        size="ExtraLarge"
        styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      >
        <Row>
          <Col breakPoint={{ xs: 12, md: 6 }}>
            <CardBody
              style={{
                maxHeight: "calc(100vh - 350px)",
                paddingTop: 0
              }}
            >
              <Row className="m-0" center="xs" middle="xs">
                <TextSpan apparence="s1" hint>
                  RDO
                </TextSpan>
              </Row>
              <TABLE>
                <TheadStyle>
                  <TRH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="date" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="hour" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="end">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="machine.supplies.consumption.received" /> (m³)
                      </TextSpan>
                    </TH>
                    <TH textAlign="end">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="machine.supplies.consumption.supplied" /> (m³)
                      </TextSpan>
                    </TH>
                  </TRH>
                </TheadStyle>
                <TBODY>
                  {rdo
                    ?.filter(x => x.received || x.supply)
                    ?.sort((a, b) => b.date - a.date)
                    ?.map((x, i) => (
                      <TR key={`${i}-${index}`}
                        isEvenColor={i % 2 === 0}
                      >
                        <TD textAlign="center">
                          <TextSpan apparence="p2">
                            {moment(x.date).format("DD MMM YYYY")}
                          </TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="p2">
                            {moment(x.date).format("HH:mm")}
                          </TextSpan>
                        </TD>
                        <TD textAlign="end">
                          <TextSpan apparence="p2">
                            {floatToStringExtendDot(x.received, 3)}
                          </TextSpan>
                        </TD>
                        <TD textAlign="end">
                          <TextSpan apparence="p2">
                            {floatToStringExtendDot(x.supply, 3)}
                          </TextSpan>
                        </TD>
                      </TR>
                    ))
                  }
                  <TR>
                    <TD colSpan={2} textAlign="end">
                      <TextSpan apparence="c2" hint>
                        <FormattedMessage id="total" />
                      </TextSpan>
                    </TD>
                    <TD textAlign="end">
                      <TextSpan apparence="c2">
                        {floatToStringExtendDot(rdo
                          ?.filter(x => x.received)
                          ?.reduce((acc, x) => acc + x.received, 0), 3)}
                      </TextSpan>
                    </TD>
                    <TD textAlign="end">
                      <TextSpan apparence="c2">
                        {floatToStringExtendDot(rdo
                          ?.filter(x => x.supply)
                          ?.reduce((acc, x) => acc + x.supply, 0), 3)}
                      </TextSpan>
                    </TD>
                  </TR>
                </TBODY>
              </TABLE>
            </CardBody>
            <Row className="m-0 pt-4" center="xs" middle="xs">
              <DownloadCSV
                getData={getDataRDO}
                appearance="ghost"
                fileName={`RDO_${moment().format("YYYYMMDD")}.csv`}
              />
            </Row>
          </Col>
          <Col breakPoint={{ xs: 12, md: 6 }}>
            <CardBody
              style={{
                maxHeight: "calc(100vh - 350px)",
                paddingTop: 0
              }}
            >
              <Row className="m-0" center="xs" middle="xs">
                <TextSpan apparence="s1" hint>
                  RVE
                </TextSpan>
              </Row>
              <TABLE>
                <TheadStyle>
                  <TRH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="date" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="operation" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="start" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="end" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="duration" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="end" style={{ width: "100px" }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="contract.max" /> (m³)
                      </TextSpan>
                    </TH>
                  </TRH>
                </TheadStyle>
                <TBODY>
                  {[...new Set(operations
                    ?.map(x => x.dateNumber))]
                    ?.sort((a, b) => b - a)
                    ?.map((dateDay, i) => {

                      const operationsFiltered = operations
                        ?.filter(x => x.dateNumber === dateDay)

                      return operationsFiltered
                        ?.map((x, indexInterno) => (
                          <TR key={`${i}-${indexInterno}-${index}`}
                            isEvenColor={i % 2 === 0}
                          >
                            {indexInterno === 0 &&
                              <TD textAlign="center"
                                rowSpan={operationsFiltered.length}
                              >
                                <TextSpan apparence="p2">
                                  {moment(x.dateStart).format("DD MMM YYYY")}
                                </TextSpan>
                              </TD>}
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {x.code}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {moment(x.dateStart).format("HH:mm")}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {moment(x.dateEnd).format("HH:mm")}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="c2">
                                {calculateTimeDifference(
                                  x?.dateEnd,
                                  x?.dateStart)}
                              </TextSpan>
                            </TD>
                            <TD textAlign="end">
                              <TextSpan apparence="s2">
                                {floatToStringExtendDot((x?.consumptionDailyContract / 24) * x?.diffInHours, 2)}
                              </TextSpan>
                            </TD>
                          </TR>
                        ))
                    })
                  }
                </TBODY>
              </TABLE>
            </CardBody>
            <Row className="m-0 pt-4" center="xs" middle="xs">
              <DownloadCSV
                getData={getDataOperations}
                appearance="ghost"
                fileName={`RVE_${moment().format("YYYYMMDD")}.csv`}
              />
            </Row>
          </Col>
        </Row>
      </Modal>}
    </>
  )
}
