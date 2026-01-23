import React from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, EvaIcon, InputGroup, Row, Tooltip } from '@paljs/ui'
import styled, { useTheme } from 'styled-components'
import moment from 'moment'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import { DownloadCSV, Fetch, InputDecimal, LabelIcon, Modal, TextSpan } from '../../../components'
import { floatToStringExtendDot } from '../../../components/Utils'
import { Barrel, MapMarkerDistance } from '../../../components/Icons'
import { BadgeEstimated } from './Utils'
import { SkeletonThemed } from '../../../components/Skeleton'

const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .15rem;
  cursor: pointer;
`

const CardBodyStyled = styled(CardBody)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-bottom: 0rem;
`

const Tip = ({ children, contentMessage }) => {
  return (
    <>
      <Tooltip
        placement="top"
        content={contentMessage}
        trigger="hint"
      >
        {children}
      </Tooltip>
    </>
  )
}

export default function Statistics({
  data = [],
  machine = undefined,
  fetchData,
  hasPermissionEditor = false
}) {

  const intl = useIntl()
  const theme = useTheme()

  const [modalVisibility, setModalVisibility] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState()
  const [newOilReceveid, setNewOilReceveid] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)

  function handleModalVisibility(item) {
    setSelectedItem(item);
    setModalVisibility(true);
  }

  function handleSave() {
    const payload = {
      idMachine: machine?.value,
      newOilReceived: newOilReceveid,
      _id: selectedItem._id,
      idEnterprise: selectedItem.idEnterprise,
    };

    setIsLoading(true);

    Fetch.put("/consumption/update-oil-moving", payload)
      .then(() => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        if (fetchData) fetchData();
        setModalVisibility(false);
        setNewOilReceveid();
      })
      .catch(() => {
        toast.error(intl.formatMessage({ id: "error.save" }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function renderFooter() {
    return (
      <CardFooter>
        <Row end="xs" className="m-0">
          <Button
            size="Small"
            onClick={handleSave}
            disabled={isLoading || (newOilReceveid === undefined || newOilReceveid === null || newOilReceveid === '')}
          >
            <FormattedMessage id="save" />
          </Button>
        </Row>
      </CardFooter>
    )
  }

  return (
    <>
      {!!data?.length &&
        <>
          <Row className="m-0" between="xs">
            <LabelIcon title={<FormattedMessage id="resume.daily" />} />
            <DownloadCSV
              appearance="ghost"
              status="Basic"
              getData={() => data?.map(x => ({
                vessel: machine?.label,
                date: moment(x?.pollingEndDateTime || x.date).format("YYYY-MM-DD"),
                hours: floatToStringExtendDot(x?.hours, 2),
                consumptionReal: x?.consumptionReal?.value,
                consumptionUnit: x?.consumptionReal?.unit,
                consumptionRealCo2: floatToStringExtendDot(Number(x?.consumptionReal?.co2 / 1000), 2),
                co2Unit: "Ton",
                consumptionEstimate: x?.consumption?.value,
                consumptionEstimateUnit: x?.consumption?.unit,
                consumptionEstimateCo2: floatToStringExtendDot(Number(x?.consumption?.co2 / 1000), 2),
                ...x?.engines?.reduce((acc, curr) => ({
                  ...acc,
                  [curr?.description]: curr?.consumption?.value
                }), {})
              }))}
              fileName={`${machine?.label}_daily_${moment().format("YYYYMMMDDHHmmss")}`}
            />
          </Row>

          <CardBodyStyled>
            {data
              ?.sort((a, b) => new Date(b.date) - new Date(a.date))
              ?.map((item, index) => {
                const isConsumptionReal = !!item?.consumptionReal?.value;

                const consumption = isConsumptionReal
                  ? item?.consumptionReal
                  : item?.consumption;

                const date = item?.date;

                return (
                  <Card
                    key={index}
                    className="mr-3 mb-0"
                    style={{ minWidth: 200 }}
                  >
                    <CardHeader>
                      <Row className="m-0" between='xs' middlew="xs">
                        <div>
                          {item.isNeedRegeneration &&
                            <Tooltip
                              placement="top"
                              content={intl.formatMessage({
                                id: "consumption.need.regeneration"
                              })}
                              trigger="hint"
                            ><EvaIcon name="alert-triangle" status="Warning" />
                            </Tooltip>}
                          <TextSpan apparence='s2'
                            className="ml-1"
                            hint>{moment(date).format("DD MMM")}</TextSpan>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Tooltip
                            placement="top"
                            content={intl.formatMessage({
                              id: isConsumptionReal
                                ? "real.consumption"
                                : "estimated.consumption"
                            })}
                            trigger="hint"
                          >
                            <BadgeEstimated status={isConsumptionReal ? "Primary" : "Warning"}>
                              {isConsumptionReal
                                ? "SON*"
                                : "FLM*"
                              }</BadgeEstimated>
                          </Tooltip>
                          {hasPermissionEditor && (
                            <Button
                              style={{ marginRight: -10, padding: 2 }}
                              size="Tiny"
                              status="Basic"
                              appearance="ghost"
                              onClick={() => handleModalVisibility(item)}
                            >
                              <EvaIcon name="edit-outline" />
                            </Button>
                          )}
                        </div>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <RowStyled>
                        <Tip contentMessage={intl.formatMessage({ id: "hour.unity" })}>
                          <EvaIcon name="clock-outline" status="Info" />
                        </Tip>
                        <Tip contentMessage={intl.formatMessage({ id: "hour.unity" })}>
                          <TextSpan apparence='s2'>{floatToStringExtendDot(item.hours, 2)}
                            <TextSpan apparence='p3' className="ml-1" hint>HR</TextSpan>
                          </TextSpan>
                        </Tip>
                      </RowStyled>
                      <RowStyled className="mt-1">
                        <Tip contentMessage={intl.formatMessage({ id: isConsumptionReal ? "real.consumption" : "estimated.consumption" })}>
                          <EvaIcon name={isConsumptionReal ? "droplet" : "droplet"} status={isConsumptionReal ? "Primary" : "Warning"} />
                        </Tip>
                        <Tip contentMessage={intl.formatMessage({ id: isConsumptionReal ? "real.consumption" : "estimated.consumption" })}>
                          <TextSpan apparence='s2'>{floatToStringExtendDot(consumption?.value, 2)}
                            <TextSpan apparence='p3' className="ml-1" hint>{consumption?.unit}</TextSpan>
                          </TextSpan>
                        </Tip>
                      </RowStyled>
                      <RowStyled className="mt-1">
                        <Tip
                          contentMessage={`CO₂ ${intl.formatMessage({ id: isConsumptionReal ? "polling" : "flowmeter" }).toLowerCase()}`}>
                          <EvaIcon name="cloud-upload" status="Basic" />
                        </Tip>
                        <Tip
                          contentMessage={`CO₂ ${intl.formatMessage({ id: isConsumptionReal ? "polling" : "flowmeter" }).toLowerCase()}`}>
                          <TextSpan apparence='s2'>{floatToStringExtendDot(Number(consumption?.co2 / 1000), 2)}
                            <TextSpan apparence='p3' className="ml-1" hint>Ton</TextSpan>
                          </TextSpan>
                        </Tip>
                      </RowStyled>
                      {!!item?.distance && <RowStyled className="mt-1">
                        <Tip contentMessage={intl.formatMessage({ id: "distance" })}>
                          <MapMarkerDistance
                            style={{
                              marginLeft: 1,
                              height: 17, width: 17,
                              fill: theme.colorSuccess600
                            }}
                          />
                        </Tip>
                        <Tip contentMessage={intl.formatMessage({ id: "distance" })}>
                          <TextSpan apparence='s2'>{floatToStringExtendDot(item?.distance, 2)}
                            <TextSpan apparence='p3' className="ml-1" hint>nm</TextSpan>
                          </TextSpan>
                        </Tip>
                      </RowStyled>}
                      {!!item?.oil?.stock && <RowStyled className="mt-1">
                        <Tip contentMessage={intl.formatMessage({ id: "stock" })}>
                          <Barrel
                            style={{
                              marginLeft: 1,
                              height: 17, width: 17,
                              fill: theme.textBasicColor
                            }}
                          />
                        </Tip>
                        <Tip contentMessage={intl.formatMessage({ id: "stock" })}>
                          <TextSpan apparence='s2'>{floatToStringExtendDot(item?.oil?.stock, 3)}
                            <TextSpan apparence='p3' className="ml-1" hint>{item?.oil?.unit}</TextSpan>
                          </TextSpan>
                        </Tip>
                      </RowStyled>}
                      {!!(item?.oil?.received > 0) &&
                        <RowStyled className="mt-1">
                          <Tip
                            contentMessage={intl.formatMessage({ id: "fueling" })}>
                            <div style={{ display: `flex`, flexDirection: `row`, alignContent: `flex-start` }}>
                              <EvaIcon name="arrow-circle-down" status="Info" />
                              <div style={{ marginTop: -2 }}>
                                <BadgeEstimated
                                  status="Info"
                                  className="ml-1"
                                  isBg
                                >MDO
                                </BadgeEstimated>
                              </div>
                            </div>
                          </Tip>
                          <Tip
                            contentMessage={intl.formatMessage({ id: "fueling" })}>
                            <TextSpan apparence='s2'>{floatToStringExtendDot(item?.oil?.received, 3)}
                              <TextSpan apparence='p3' className="ml-1" hint>{item?.oil?.unit}</TextSpan>
                            </TextSpan>
                          </Tip>
                        </RowStyled>}
                    </CardBody>
                  </Card>)
              })}
          </CardBodyStyled>
        </>}

      <Modal
        show={modalVisibility}
        onClose={() => {
          if (!isLoading)
            setModalVisibility(false)
        }}
        size="Small"
        title="consumption.movement.adjustment"
        hideOnBlur
        renderFooter={renderFooter}
        styleContent={{ overflowX: 'hidden' }}
      >
        {isLoading
          ? <Row className="m-0">
            <Col breakPoint={{ md: 12, xs: 12 }} className="mb-4">
              <SkeletonThemed
                height={48}
              />
            </Col>
            <Col breakPoint={{ md: 12, xs: 12 }}>
              <SkeletonThemed
                height={60}
              />
            </Col>
          </Row>
          : <Row className="m-0">
            <Col breakPoint={{ md: 12, xs: 12 }} className="mb-3">
              <LabelIcon
                iconName="calendar-outline"
                renderTitle={() => (
                  <TextSpan apparence='p2' hint>
                    <FormattedMessage id="date" />
                  </TextSpan>
                )}
              />
              <TextSpan apparence='s1' className="ml-2">
                {selectedItem?.date ? moment(selectedItem?.date).format("DD MMM YYYY") : "-"}
              </TextSpan>
            </Col>

            <Col breakPoint={{ md: 12, xs: 12 }} className="mb-4">
              <LabelIcon
                iconName="droplet"
                renderTitle={() => (
                  <TextSpan apparence='p2' hint>
                    <FormattedMessage id="moving" />
                  </TextSpan>
                )}
              />
              <div className="mt-2"></div>
              <Row className="m-0" middle="xs">
                <Col breakPoint={{ md: 6, xs: 12 }}>
                  <TextSpan apparence='p2' hint>
                    <FormattedMessage id="machine.supplies.consumption.received" />:
                  </TextSpan>
                  <TextSpan apparence='s1' className="ml-2">
                    {selectedItem?.oil?.received
                      ? floatToStringExtendDot(selectedItem?.oil?.received, 2)
                      : "N/A"
                    }
                    <TextSpan apparence='p3' className="ml-1" hint>
                      {selectedItem?.oil?.unit || ""}
                    </TextSpan>
                  </TextSpan>
                </Col>
                <Col breakPoint={{ md: 6, xs: 12 }}>
                  <LabelIcon
                    iconName="edit-outline"
                    title={`${intl.formatMessage({ id: "new" })} ${selectedItem?.oil?.unit ? `(${selectedItem?.oil?.unit})` : ""}`}
                  />
                  <InputGroup fullWidth>
                    <InputDecimal
                      style={{
                        textAlign: 'right',
                      }}
                      placeholder={`${intl.formatMessage({ id: "new" })} ${selectedItem?.oil?.unit ? `${selectedItem?.oil?.unit}` : ""}`}
                      value={newOilReceveid}
                      onChange={(e) => setNewOilReceveid(e)}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>}
      </Modal>
    </>
  )
}
