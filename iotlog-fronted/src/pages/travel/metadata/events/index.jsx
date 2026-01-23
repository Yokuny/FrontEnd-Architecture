import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Select,
} from "@paljs/ui";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { addDataVoyage } from "../../../../actions";
import { DateTime, TextSpan } from "../../../../components";

const ColDate = styled(Col)`
  input {
    line-height: 1.1rem;
  }

  a svg {
    top: -7px;
    position: absolute;
    right: -5px;
  }
`;

export const allFieldsRequiredInEventAreFilled = (eventLine) => {
  return (
    !eventLine?.observation ||
    !eventLine?.type?.value ||
    !eventLine?.dateStart ||
    !eventLine?.timeStart ||
    !eventLine?.dateEnd ||
    !eventLine?.timeEnd ||
    !eventLine?.dateOk
  );
};

const EventsTravel = (props) => {
  const intl = useIntl();

  const { data, addDataVoyage } = props;

  const isDisabledAddEvent = () => {
    return (
      !!data?.events?.length &&
      allFieldsRequiredInEventAreFilled(data?.events[data?.events?.length - 1])
    );
  };

  const mountDate = (date, time) => {
    return moment(`${moment(date).format("YYYY-MM-DD")}T${time}`).toDate();
  };

  const isDatesAreValidAndShowMessage = (eventLine) => {
    if (
      eventLine.dateStart &&
      eventLine.dateEnd &&
      eventLine.timeStart &&
      eventLine.timeEnd
    ) {
      if (
        moment(eventLine.dateTimeEnd).isBefore(moment(eventLine.dateTimeStart))
      ) {
        toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
        return false;
      }
      if (
        moment(eventLine.dateTimeStart).isBefore(moment(data.dateTimeStart))
      ) {
        toast.warn(
          intl.formatMessage({
            id: "date.start.is.before.date.travel",
          })
        );
        return false;
      }
    }

    return true;
  };

  const onChangeItemEvent = (index, prop, value) => {
    const eventToEdit = data?.events[index];
    eventToEdit[prop] = value;

    if (prop === "dateStart") {
      eventToEdit.dateTimeStart = mountDate(value, eventToEdit.timeStart);
      eventToEdit.dateOk = isDatesAreValidAndShowMessage(eventToEdit);
    } else if (prop === "timeStart") {
      eventToEdit.dateTimeStart = mountDate(eventToEdit.dateStart, value);
      eventToEdit.dateOk = isDatesAreValidAndShowMessage(eventToEdit);
    } else if (prop === "dateEnd") {
      eventToEdit.dateTimeEnd = mountDate(value, eventToEdit.timeEnd);
      eventToEdit.dateOk = isDatesAreValidAndShowMessage(eventToEdit);
    } else if (prop === "timeEnd") {
      eventToEdit.dateTimeEnd = mountDate(eventToEdit.dateEnd, value);
      eventToEdit.dateOk = isDatesAreValidAndShowMessage(eventToEdit);
    }

    addDataVoyage({
      events: [
        ...data?.events?.slice(0, index),
        eventToEdit,
        ...data?.events?.slice(index + 1),
      ],
    });
  };

  const onChange = (prop, value) => {
    addDataVoyage({
      [prop]: value,
    });
  };

  return (
    <>
      <Col breakPoint={{ md: 12 }} className="mt-4">
        {data?.events?.map((event, i) => (
          <Card key={`event-${i}`} style={i > 0 ? { marginTop: -28 } : {}}>
            <CardHeader>
              <TextSpan apparence="s1">{`#${i + 1}`}</TextSpan>
            </CardHeader>
            <CardBody>
              <Row style={{ margin: 0 }}>
                <Col breakPoint={{ md: 11 }}>
                  <Row middle>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="type.event" />
                      </TextSpan>
                      <Select
                        className="mt-1"
                        options={props.optionsEvents}
                        menuPosition="fixed"
                        placeholder={intl.formatMessage({
                          id: "type.event",
                        })}
                        onChange={(value) =>
                          onChangeItemEvent(i, "type", value)
                        }
                        value={event?.type}
                      />
                    </Col>
                    <ColDate breakPoint={{ md: 4 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="date.start" />
                      </TextSpan>
                      <DateTime
                        className="mt-1"
                        onChangeDate={(value) =>
                          onChangeItemEvent(i, "dateStart", value)
                        }
                        onChangeTime={(value) =>
                          onChangeItemEvent(i, "timeStart", value)
                        }
                        min={data?.dateTimeStart}
                        date={event?.dateStart}
                        time={event?.timeStart}
                        breakPointDate={{ md: 7, sm: 7, xs: 7 }}
                        breakPointTime={{ md: 5, sm: 5, xs: 5 }}
                      />
                    </ColDate>
                    <ColDate breakPoint={{ md: 4 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="date.end" />
                      </TextSpan>
                      <DateTime
                        className="mt-1"
                        onChangeDate={(value) =>
                          onChangeItemEvent(i, "dateEnd", value)
                        }
                        onChangeTime={(value) =>
                          onChangeItemEvent(i, "timeEnd", value)
                        }
                        date={event?.dateEnd}
                        min={data?.dateStart}
                        time={event?.timeEnd}
                        breakPointDate={{ md: 7, sm: 7, xs: 7 }}
                        breakPointTime={{ md: 5, sm: 5, xs: 5 }}
                      />
                    </ColDate>
                    <Col breakPoint={{ md: 12 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="observation" />
                      </TextSpan>
                      <InputGroup fullWidth className="mt-1">
                        <textarea
                          rows={2}
                          value={event?.observation}
                          onChange={(e) =>
                            onChangeItemEvent(i, "observation", e.target.value)
                          }
                          placeholder={intl.formatMessage({
                            id: "observation",
                          })}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col breakPoint={{ md: 1 }} className="col-flex-center">
                  <Button
                    status="Danger"
                    appearance="ghost"
                    size="Tiny"
                    onClick={() => {
                      onChange(
                        "events",
                        data?.events?.filter((x, z) => z != i)
                      );
                    }}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        ))}

        <Button
          style={!!(data?.events?.length > 0) ? { marginTop: -14 } : {}}
          size="Tiny"
          status="Info"
          className="flex-between"
          disabled={isDisabledAddEvent()}
          onClick={() => {
            if (data?.events?.length) {
              onChange("events", [...data?.events, {}]);
              return;
            }
            onChange("events", [{}]);
          }}
        >
          <EvaIcon className="mr-1" name="plus-outline" />
          <FormattedMessage id="add.event" />
        </Button>
      </Col>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.voyage.data,
});

const mapDispatchToProps = (dispatch) => ({
  addDataVoyage: (item) => {
    dispatch(addDataVoyage(item));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsTravel);
