import { Card, CardBody } from "@paljs/ui";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import styled, { withTheme, css } from "styled-components";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import ToolbarCalendar from "./ToolbarCalendar";
import { Fetch, SpinnerFull } from "../../../../components";
import ModalMaintenancePlan from "./ModalMaintenancePlan";
import { LANGUAGES } from "../../../../constants";

import "moment/locale/es";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Div = styled.div`
  ${({ theme, valueColor }) => css`
    background-color: transparent;
    width: 100%;
  `}
`;

function Event({ event }) {
  return (
    <span>
      <strong>{event.title}</strong>
      {event.desc && " - " + event.desc}
      {/* {event.enterprise && ' - ' + event.enterprise} */}
    </span>
  );
}

const CalendarMaintenance = (props) => {
  const { intl } = props;
  const calendarRef = React.useRef();
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [eventSelected, setEventSelected] = React.useState();

  React.useLayoutEffect(() => {
    getEvents(moment().utc());
  }, []);

  const getEvents = (dateNow, byDay = false) => {
    setIsLoading(true);
    let queryDay = byDay ? `&day=${dateNow.format("DD")}` : "";
    Fetch.get(
      `/maintenancemachine/calendar?year=${dateNow.format(
        "YYYY"
      )}&month=${dateNow.format("MM")}${queryDay}`
    )
      .then((response) => {
        setEvents(
          response.data?.map((x) => ({
            title: x.machine?.name,
            machine: x.machine,
            nextMaintenance: x.nextMaintenance,
            nextEndMaintenance: x.nextEndMaintenance,
            desc: x.maintenancePlan?.description,
            idMaintenancePlan: x.maintenancePlan?.id,
            enterprise: x.enterprise?.name,
            doneAt: x.doneAt,
            id: x.id,
            allDay: false,
            start: moment(x.nextMaintenance).utc().toDate(),
            end: moment(x.nextEndMaintenance).utc().toDate(),
          }))
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  let defaultMessages = {
    date: intl.formatMessage({ id: "date" }),
    time: intl.formatMessage({ id: "hour" }),
    event: intl.formatMessage({ id: "events" }),
    allDay: intl.formatMessage({ id: "all.day" }),
    week: intl.formatMessage({ id: "week" }),
    work_week: intl.formatMessage({ id: "work.week" }),
    day: intl.formatMessage({ id: "day" }),
    month: intl.formatMessage({ id: "month" }),
    previous: intl.formatMessage({ id: "previous" }),
    next: intl.formatMessage({ id: "next" }),
    yesterday: intl.formatMessage({ id: "yesterday" }),
    tomorrow: intl.formatMessage({ id: "tomorrow" }),
    today: intl.formatMessage({ id: "today" }),
    agenda: intl.formatMessage({ id: "schedule.date" }),
    noEventsInRange: intl.formatMessage({ id: "empty.range.events" }),
    showMore: (total) => {
      return (
        <Div>
          <span>{`+${total} ${intl.formatMessage({
            id: "more",
          })}`}</span>
        </Div>
      );
    },
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let color = props.theme.colorBasic500;
    const today = moment();

    if (moment(start).isBefore(moment(today)))
      color = props.theme.colorBasic500;
    else if (moment(start).isSame(moment(today), "day"))
      color = props.theme.colorSuccess500;
    else if (moment(start).isBefore(moment(today).add(5, 'days')))
      color = props.theme.colorWarning500;
    else if (moment(end).isAfter(moment(today).add(5, 'days')))
      color = props.theme.colorInfo500;
    else if (!event.doneAt) color = props.theme.colorDanger500;

    let style = {
      borderRadius: "2px",
      border: "0px",
      display: "block",
      fontFamily: props.theme.fontFamilyPrimary,
      fontWeight: "500",
    };

    if (calendarRef?.current?.props?.view != "agenda") {
      style = {
        ...style,
        backgroundColor: color,
        color: props.theme.textControlColor,
      };
    }

    return {
      style,
    };
  };

  const dayStyleGetter = (date, resourceId) => {
    let color = props.theme.backgroundBasicColor1;
    const today = moment();
    if (moment(date).isBefore(moment(today), "day"))
      color = props.theme.backgroundBasicColor3;
    else if (moment(date).isSame(moment(today), "day"))
      color = props.theme.colorPrimary400;

    return {
      style: {
        backgroundColor: color,
      },
    };
  };

  const localeForData = LANGUAGES.find((x) => x.locale == props.locale);
  if (localeForData) moment.locale(localeForData?.locale);
  const localizer = momentLocalizer(moment);

  return (
    <>
      <Card>
        <CardBody>
          <Calendar
            ref={calendarRef}
            localizer={localizer}
            style={{
              height: "calc(100vh - 220px)"
            }}
            defaultView="month"
            popup
            events={events}
            messages={defaultMessages}
            startAccessor="start"
            endAccessor="end"
            defaultDate={new Date()}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayStyleGetter}
            onSelectEvent={(event) => setEventSelected(event)}
            onNavigate={(newDate, view, action) => {
              getEvents(
                moment(newDate).utc(),
                ["day", "agenda"].includes(view)
              );
            }}
            onView={(view) => {
              if (view == "month") {
                getEvents(moment(calendarRef.current?.props?.date).utc());
              }
            }}
            components={{
              event: Event,
              toolbar: (props) => <ToolbarCalendar {...props} />,
            }}
            views={["month", "week"]}
          />
        </CardBody>
      </Card>
      <ModalMaintenancePlan
        event={eventSelected}
        onClose={() => setEventSelected(undefined)}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  locale: state.settings.locale,
});

const CalendarMaintenanceIntl = injectIntl(CalendarMaintenance);
const CalendarMaintenanceThemed = withTheme(CalendarMaintenanceIntl);

export default connect(mapStateToProps, undefined)(CalendarMaintenanceThemed);
