import { Button, CardFooter, Col, EvaIcon, Row, Select } from "@paljs/ui";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, Modal, TextSpan } from "../../../../components";
import {
  TABLE,
  TBODY,
  TD,
  TH,
  THEAD,
  TR,
  TRH,
} from "../../../../components/Table";
import { useEvents } from "./useEvents";
import { CSVLink } from "react-csv";

export function ModalViewEvents({ show, onClose, events }) {
  const [selectedEvents, setSelectedEvents] = useState([]);

  const intl = useIntl();

  const { options, event, maintenance, teamChange } = useEvents();

  const filterData = () => {
    return events
      .filter((event) => selectedEvents.includes(eventType(event)))
      .sort((a, b) => eventType(a).localeCompare(eventType(b)));
  };

  const columns = () => {
    let data = new Set([]);

    if (selectedEvents.includes("event")) {
      event.map((event) => data.add(event.title));
    }

    if (selectedEvents.includes("teamChange")) {
      teamChange.map((event) => data.add(event.title));
    }

    if (selectedEvents.includes("maintenance")) {
      maintenance.map((event) => data.add(event.title));
    }

    return Array.from(data);
  };

  const eventType = (data) => {
    return data?.eventType?.value || data?.eventType;
  };

  const formatData = (event, prop, data) => {
    return event.find((event) => event.title === prop)?.format(data);
  };

  const formatToCSV = (data) => {
    return data.map((x) => {
      return columns().map((y) => {
        return eventType(x) === "event"
          ? formatData(event, y, x)
          : eventType(x) === "teamChange"
            ? formatData(teamChange, y, x)
            : eventType(x) === "maintenance"
              ? formatData(maintenance, y, x)
              : null;
      });
    });
  };

  const getInfoEvent = (data) => {
    const typeEvent = eventType(data);
    switch (typeEvent) {
      case "event":
        return {
          color: "#3EBDE8",
          title: intl.formatMessage({ id: "event" }),
        }
      case "teamChange":
        return {
          color: "#a000ff",
          title: intl.formatMessage({ id: "event.team.change" }),
        }
      case "maintenance":
        return {
          color: "#FF5538",
          title: intl.formatMessage({ id: "maintenance" }),
        }
      default:
        return {
          color: "#AEACAC",
          title: intl.formatMessage({ id: "other" }),
        }
    };
  }

  const renderBadge = (data) => {
    const { color, title } = getInfoEvent(data);
    return (
      <>
        <TextSpan
          style={{
            color: color,
            backgroundColor: `${color}1A`,
            padding: "3px 7px",
            borderRadius: "4px",
            lineHeight: "0",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "9px",
          }}>
          {title}
        </TextSpan>
      </>
    )
  }

  return (
    <Modal
      show={show}
      size="ExtraLarge"
      onClose={onClose}
      title={intl.formatMessage({ id: "view" })}
      styleContent={{
        minHeight: "200px",
        maxHeight: "80vh",
        overflowY: "scroll",
      }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs">
            <CSVLink
              data={formatToCSV(filterData())}
              filename="calendar.csv"
              separator=","
              headers={columns()}
            >
              <Button status="Primary"
                size="Tiny"
                apperaence="outline"
                appearance="ghost"
                className="flex-between"
              >
                <EvaIcon name="download-outline" className="mr-1" />
                <FormattedMessage id="download" />
              </Button>
            </CSVLink>
          </Row>
        </CardFooter>
      )}
    >
      <Col>
        <LabelIcon
          iconName="funnel-outline"
          title={intl.formatMessage({ id: "filter" })}
        />
        <Select
          placeholder={intl.formatMessage({ id: "filter" })}
          options={options}
          isMulti
          onChange={(e) => setSelectedEvents(e.map((x) => x.value))}
          value={options.filter((event) =>
            selectedEvents.includes(event.value)
          )}
        />
      </Col>
      <Col className="mt-4">
        {!!selectedEvents?.length && (
          <TABLE>
            <THEAD>
              <TRH>
                {selectedEvents.length > 1 && <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id={"type"} />
                  </TextSpan>
                </TH>}
                {selectedEvents &&
                  columns().map((data) => (
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id={data} />
                      </TextSpan>
                    </TH>
                  ))}
              </TRH>
            </THEAD>
            <TBODY>
              {filterData().map((data, index) => (
                <TR key={data.id} isEvenColor={index % 2 === 0}>
                  {selectedEvents.length > 1 &&
                    <TD textAlign="center">
                      {renderBadge(data)}
                    </TD>}
                  {columns().map((prop, index) => (
                    <TD key={`${data.id}-${index}`} textAlign="center">
                      <TextSpan apparence="s2">
                        {eventType(data) === "event"
                          ? formatData(event, prop, data) || "-"
                          : eventType(data) === "teamChange"
                            ? formatData(teamChange, prop, data) || "-"
                            : eventType(data) === "maintenance"
                              ? formatData(maintenance, prop, data) || "-"
                              : null}
                      </TextSpan>
                    </TD>
                  ))}
                </TR>
              ))}
            </TBODY>
          </TABLE>
        )}
      </Col>
    </Modal>
  );
}
