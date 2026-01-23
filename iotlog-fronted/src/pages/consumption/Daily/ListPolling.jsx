import { Button, Card, CardBody, CardHeader, EvaIcon, Row, Tooltip, Col, CardFooter } from '@paljs/ui'
import moment from 'moment'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { toast } from 'react-toastify'
import styled, { keyframes } from 'styled-components'
import { DateTime, DownloadCSV, Fetch, LabelIcon, Modal, TextSpan } from '../../../components'
import { floatToStringExtendDot } from '../../../components/Utils'

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotatingIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${rotateAnimation} 2s linear infinite; /* Adjust the duration and other properties as needed */
`;

const RowStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .15rem;
`

const CardBodyStyled = styled(CardBody)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-bottom: 0rem;
`

export default function ListPolling({
  fetchData,
  data = [],
  machine = undefined,
  hasPermissionEditor = false
}) {

  const [modalVisibility, setModalVisibility] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState()
  const [selectedTimeStart, setSelectedTimeStart] = React.useState()
  const [selectedTimeEnd, setSelectedTimeEnd] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)

  const itens = data?.filter(x => x?.pollingEnd?.length)

  const intl = useIntl();

  function handleModalVisibility(item) {
    setSelectedTimeStart();
    setSelectedTimeEnd();
    setSelectedItem(item);
    setModalVisibility(true);
  }

  function updateDateTime(oldDate, startOrEnd, newTime) {
    let dateTime = moment(oldDate);

    if (startOrEnd === 'start') {
      const [startHours, startMinutes] = newTime.split(':');
      dateTime = dateTime.set({ hours: startHours, minutes: startMinutes });
    } else {
      const [endHours, endMinutes] = newTime.split(':');
      dateTime = dateTime.set({ hours: endHours, minutes: endMinutes });
    }

    return dateTime.format();
  }

  function handleSave() {

    let updatedStartTime
    let updatedEndTime

    if (selectedTimeStart) updatedStartTime = updateDateTime(selectedItem.pollingStartDateTime, 'start', selectedTimeStart);
    if (selectedTimeEnd) updatedEndTime = updateDateTime(selectedItem.pollingEndDateTime, 'end', selectedTimeEnd);

    const payload = {
      idMachine: machine?.value,
      newStartDate: updatedStartTime || undefined,
      newEndDate: updatedEndTime || undefined,
      _id: selectedItem._id,
      idEnterprise: selectedItem.idEnterprise,
      timezone: moment().format("Z")
    };

    setIsLoading(true);

    Fetch.put("/consumption/update-polling", payload)
      .then(() => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        fetchData(machine);
      })
      .catch(() => {
        toast.error(intl.formatMessage({ id: "error.save" }));
      })
      .finally(() => {
        setModalVisibility(false);
        setIsLoading(false);
        setSelectedTimeStart(null);
        setSelectedTimeEnd(null);
      });
  }

  function renderFooter() {
    return (
      <CardFooter>
        <Row end="xs" className="m-0">
          <Button
            size="Small"
            onClick={handleSave}
            disabled={isLoading || (!selectedTimeEnd && !selectedTimeStart)}
          >
            <FormattedMessage id="save" />
          </Button>
        </Row>
      </CardFooter>
    )
  }

  return (
    <>
      {!!itens?.length &&
        <>
          <Row className="m-0" between="xs">
            <LabelIcon title={<FormattedMessage id="polling" />} />
            <DownloadCSV
              appearance="ghost"
              status="Basic"
              getData={() => itens?.map(x => ({
                vessel: machine?.label,
                date: moment(x?.pollingEndDateTime).format("YYYY-MM-DD"),
                time: moment(x?.pollingEndDateTime).format("HH:mm"),
                timezone: moment(x?.pollingEndDateTime).format("Z"),
                ...x?.pollingEnd?.reduce((acc, curr) => (
                  {
                    ...acc,
                    [curr?.description]: floatToStringExtendDot(curr?.value, (curr?.unit || "").toLowerCase() === "hr" ? 2 : 3),
                    [`${curr?.description}_unit`]: curr?.unit
                  }), {})
              }))}
              fileName={`${machine?.label}_polling_${moment().format("YYYYMMMDDHHmmss")}`}
            />
          </Row>
        </>}
      <CardBodyStyled>
        {itens
          ?.sort((a, b) => new Date(b.date) - new Date(a.date))
          ?.map((item, index) => (
            <Card
              key={index}
              className="mr-3 mb-0"
              style={{ minWidth: 250 }}
            >
              <CardHeader>
                <Row className="m-0" between>
                  <div>
                    <EvaIcon name="calendar-outline" status="Basic" />
                    <TextSpan apparence='s2' className="ml-1" hint>
                      {moment(item?.pollingEndDateTime).format("DD MMM HH:mm")}
                    </TextSpan>
                  </div>

                  {hasPermissionEditor &&
                    item?.status === 'processed' && (
                    <Button
                      style={{ marginRight: -4 }}
                      size="Tiny"
                      appearance="ghost"
                      onClick={() => handleModalVisibility(item)}
                    >
                      <EvaIcon name="edit-outline" />
                    </Button>
                  )}
                  {item?.status === 'processing' && (
                    <RotatingIconContainer>
                      <EvaIcon name="refresh-outline" status='Basic' />
                    </RotatingIconContainer>
                  )}

                </Row>
              </CardHeader>
              <CardBody>
                {item?.status === 'processing' ?
                  <>
                    <RowStyled>
                      <TextSpan apparence='p2' hint>
                        <FormattedMessage id="processing" /> ...
                      </TextSpan>
                    </RowStyled>
                  </>
                  :
                  <>
                    {item?.pollingEnd?.map((polling, i) => (
                      <RowStyled key={`${i}-${index}`}>
                        <TextSpan apparence='p2'>{polling?.description}</TextSpan>
                        <TextSpan apparence='s2'>{floatToStringExtendDot(polling?.value, (polling?.unit || "").toLowerCase() === "hr" ? 2 : 3)}
                          <TextSpan apparence='p3' className="ml-1" hint>{polling?.unit}</TextSpan>
                        </TextSpan>
                      </RowStyled>
                    ))}
                  </>}
              </CardBody>
            </Card>))}
      </CardBodyStyled >


      <Modal
        show={modalVisibility}
        onClose={() => setModalVisibility(false)}
        size="Small"
        title="polling"
        hideOnBlur
        renderFooter={renderFooter}
        styleContent={{ overflowX: 'hidden' }}
      >

        <Row clasName="m-0">
          <Col breakPoint={{ md: 12, xs: 12 }}>
            <LabelIcon
              renderTitle={
                () => <TextSpan apparence='s2' hint>
                  <FormattedMessage id="start" />
                </TextSpan>
              }
            />
          </Col>
          <Col breakPoint={{ md: 3, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName={"calendar-outline"}
              title={<FormattedMessage id="date" />}
            />
            <div className="mt-2"></div>
            <TextSpan apparence='s1' className="ml-2" hint>
              {selectedItem?.pollingStartDateTime ? moment(selectedItem?.pollingStartDateTime).format("DD MMM") : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ md: 3, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName={"clock-outline"}
              title={<FormattedMessage id="hour.unity" />}
            />
            <div className="mt-2"></div>
            <TextSpan apparence='s1' className="ml-2" hint>
              {selectedItem?.pollingStartDateTime ? moment(selectedItem?.pollingStartDateTime).format("HH:mm") : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ md: 6, xs: 12 }} className="mb-4">
            <LabelIcon
              iconName={"clock-outline"}
              title={<FormattedMessage id="new" />}
            />
            <DateTime
              time={selectedTimeStart}
              onlyTime
              onChangeTime={setSelectedTimeStart}
            />
          </Col>

          <Col breakPoint={{ md: 12, xs: 12 }}>
            <LabelIcon
              renderTitle={
                () => <TextSpan apparence='s2' hint>
                  <FormattedMessage id="end" />
                </TextSpan>
              }
            />
          </Col>
          <Col breakPoint={{ md: 3, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName={"calendar-outline"}
              title={<FormattedMessage id="date" />}
            />
            <div className="mt-2"></div>
            <TextSpan apparence='s1' className="ml-2" hint>
              {selectedItem?.pollingEndDateTime ? moment(selectedItem?.pollingEndDateTime).format("DD MMM") : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ md: 3, xs: 6 }} className="mb-4">
            <LabelIcon
              iconName={"clock-outline"}
              title={<FormattedMessage id="hour.unity" />}
            />
            <div className="mt-2"></div>
            <TextSpan apparence='s1' className="ml-2" hint>
              {selectedItem?.pollingEndDateTime ? moment(selectedItem?.pollingEndDateTime).format("HH:mm") : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ md: 6, xs: 12 }} className="mb-4">
            <LabelIcon
              iconName={"clock-outline"}
              title={<FormattedMessage id="new" />}
            />
            <DateTime
              time={selectedTimeEnd}
              onlyTime
              onChangeTime={setSelectedTimeEnd}
            />
          </Col>
        </Row>

      </Modal>
    </>
  )
}
