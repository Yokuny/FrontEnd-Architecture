import React from "react"
import { FormattedMessage } from "react-intl"
import { Button, Card, CardBody, CardHeader, Row, EvaIcon } from "@paljs/ui"
import AddButton from "../../../components/Button/AddButton"
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from '../../../components/Table';
import { TextSpan } from "../../../components";
import moment from "moment";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../components/Utils";
import { useTheme } from "styled-components";

export default function GroupEventList({
  formData,
  eventForm,
  editEvent,
}) {
  const theme = useTheme()
  return (
    <>
      <Card
        style={{
          boxShadow: "none",
          border: `1px solid ${theme.borderBasicColor3}`,
          marginBottom: `1.0rem`
        }}
      >
        <CardHeader>
          <EvaIcon name="info-outline" status="Info" className="mr-2" />
          <FormattedMessage id="events" />
        </CardHeader>
        <CardBody>
          {!!formData?.events?.length && <TABLE>
            <THEAD>
              <TRH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="date" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="status" />
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="speed" /> (<FormattedMessage id="kn" />)
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    Engine BB (RPM)
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    Engine BE (RPM)
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="machine.supplies.consumption.oil" />
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="machine.supplies.consumption.potable.water" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="observation" />
                  </TextSpan>
                </TH>
                <TH />
              </TRH>
            </THEAD>
            <TBODY>
              {formData?.events?.map((event, eventIndex) => (
                <TR key={eventIndex}
                  isEvenColor={eventIndex % 2 === 0}
                >
                  <TD>
                    <TextSpan apparence="s2">
                      {moment(event.datetime).format("DD/MM/YYYY HH:mm")}
                    </TextSpan>
                  </TD>
                  <TD>
                    <TextSpan apparence="s2">
                      {event.status || ""}
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    <TextSpan apparence="s2">
                      {event.speed !== undefined ?
                        `${floatToStringBrazilian(event.speed, 1)}`
                        : ``
                      }
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    <TextSpan apparence="s2">
                      {event?.engine?.rpmBB !== undefined ?
                        `${floatToStringBrazilian(event?.engine?.rpmBB, 1)}`
                        : ``
                      }
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    <TextSpan apparence="s2">
                      {event?.engine?.rpmBE !== undefined ?
                        `${floatToStringBrazilian(event?.engine?.rpmBE, 1)}`
                        : ``
                      }
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    {event.stock?.oil?.value !== undefined &&
                      <>
                        <TextSpan apparence="s2">
                          {floatToStringExtendDot(event.stock?.oil?.value, 2)}
                        </TextSpan>
                        <TextSpan apparence="p2" hint className="ml-1">
                          {event.stock?.oil?.unit}
                        </TextSpan>
                      </>
                    }
                  </TD>
                  <TD textAlign="end">
                    {event.stock?.water?.value !== undefined &&
                      <>
                        <TextSpan apparence="s2">
                          {floatToStringExtendDot(event.stock?.water?.value, 2)}
                        </TextSpan>
                        <TextSpan apparence="p2" hint className="ml-1">
                          {event.stock?.water?.unit}
                        </TextSpan>
                      </>
                    }
                  </TD>
                  <TD>
                    <TextSpan apparence="s2">
                      {event.observation}
                    </TextSpan>
                  </TD>
                  <TD>
                    <Button
                      onClick={() => editEvent(eventIndex)}
                      size="tiny"
                      appearance="ghost"
                      disabled={!!formData?.isFinishVoyage}
                    >
                      <EvaIcon name="edit-outline" />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBODY>
          </TABLE>}

          <Row className="m-0 mt-2" center="xs">
            <AddButton
              textId="add.event"
              disabled={!formData?.asset || !!formData?.isFinishVoyage}
              iconName="file-add-outline"
              appearance="ghost"
              status="Basic"
              onClick={() => eventForm()} />
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
