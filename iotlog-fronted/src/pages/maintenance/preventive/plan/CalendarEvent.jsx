import { Card, CardBody } from "@paljs/ui";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { css, useTheme } from "styled-components";

import { Fetch, SpinnerFull } from "../../../../components";
import { LANGUAGES } from "../../../../constants";
import ModalEditEventSchedule from "./ModalEditEventSchedule";
import ModalFilter from "./ModalFilter";
import { ModalViewEvents } from "./ModalViewEvents";
import ToolbarCalendar from "./ToolbarCalendar";

import "moment/locale/es";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Div = styled.div`
  ${({ theme, valueColor }) => css`
    background-color: transparent;
    width: 100%;
  `}
`;

const CardStyled = styled(Card)`
  ${({ theme }) => css`
    .rbc-show-more {
      // color: ${theme.borderPrimaryColor2};
    }

    .rbc-button-link {
      font-weight: bold;
    }
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

const CalendarEvent = (props) => {
  const calendarRef = React.useRef();
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [eventSelected, setEventSelected] = React.useState();
  const [isShowFilter, setIsShowFilter] = React.useState(false);
  const [showView, setShowView] = useState(false);

  const filterRef = React.useRef({});

  const hasPermissionEdit = props.items?.some(
    (x) => x === "/event-schedule-edit"
  );

  const intl = useIntl();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    if (props.isReady)
      findFetchEvents(
        moment(calendarRef.current?.props?.date).utc() || moment().utc()
      );

    return () => {
      filterRef.current = {};
    };
  }, [props.isReady, eventSelected]);

  const findFetchEvents = (dateNow, byDay = false) => {
    const { filterMachine, type, filterMaintenancePlan, managers, status } =
      filterRef.current;

    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";
    let filter = [
      `idEnterprise=${idEnterpriseFilter}`,
      `month=${dateNow.format("MM")}`,
      `year=${dateNow.format("YYYY")}`,
    ];
    if (filterMachine?.length)
      filterMachine.forEach((x) => filter.push(`idMachine[]=${x.value}`));
    if (filterMaintenancePlan?.length)
      filterMaintenancePlan.forEach((x) =>
        filter.push(`idMaintenancePlan[]=${x.value}`)
      );
    if (type) filter.push(`eventType=${type}`);
    if (managers?.length)
      managers.forEach((x) => filter.push(`managers[]=${x.value}`));
    if (byDay) filter.push(`day=${dateNow.format("DD")}`);

    setIsLoading(true);
    Fetch.get(`/event-schedule?${filter?.join("&")}`)
      .then((response) => {
        const maintenanceWindows = response.data?.map((x) => {
          if (x.eventType === "teamChange") {
            let labelQlp = `${x.qlp?.name} - ${x.qlp?.month}`;
            if (x.qlp?.qt) labelQlp = `${labelQlp} - ${x.qlp?.qt}`;
            return {
              title: x.machine?.name,
              machine: x.machine,

              date: x.date ? moment(x.date).format("YYYY-MM-DD") : x.date,
              qlp: x.qlp ? { value: x.qlp?.id, label: labelQlp } : null,
              local: x.local,
              idMachine: x.idMachine,
              idEnterprise: x.idEnterprise,
              eventType: { value: x.eventType },

              desc: intl.formatMessage({ id: "event.team.change" }),
              id: x.id,
              allDay: false,
              start: moment(x.date).utc().toDate(),
              end: moment(x.date).utc().toDate(),
              repeat: x.repeat,
              notifications: x.notifications,
              users: x.users,
            };
          } else if (x.eventType === "maintenance") {
            const start = x.dateDoneInit
              ? x.dateDoneInit
              : x.datePlanInit
              ? x.datePlanInit
              : x.dateWindowInit;
            const end = x.dateDoneEnd
              ? x.dateDoneEnd
              : x.datePlanEnd
              ? x.datePlanEnd
              : x.dateWindowEnd;
            return {
              title: x.machine?.name,
              machine: x.machine,

              dateDoneInit: x.dateDoneInit
                ? moment(x.dateDoneInit).format("YYYY-MM-DD")
                : x.dateDoneInit,
              dateDoneEnd: x.dateDoneEnd
                ? moment(x.dateDoneEnd).format("YYYY-MM-DD")
                : x.dateDoneEnd,
              datePlanInit: x.datePlanInit
                ? moment(x.datePlanInit).format("YYYY-MM-DD")
                : x.datePlanInit,
              datePlanEnd: x.datePlanEnd
                ? moment(x.datePlanEnd).format("YYYY-MM-DD")
                : x.datePlanEnd,
              dateWindowInit: x.dateWindowInit
                ? moment(x.dateWindowInit).format("YYYY-MM-DD")
                : x.dateWindowInit,
              dateWindowEnd: x.dateWindowEnd
                ? moment(x.dateWindowEnd).format("YYYY-MM-DD")
                : x.dateWindowEnd,
              observation: x.observation,

              desc: x.maintenancePlan?.description,
              idMachine: x.idMachine,
              idMaintenancePlan: x.idMaintenancePlan,
              idEnterprise: x.idEnterprise,
              eventType: x.eventType,

              id: x.id,
              allDay: true,
              start: moment(start).utc().toDate(),
              end: end ? moment(end).utc().toDate() : moment().utc().toDate(),
            };
          } else if (x.eventType === "event") {
            return {
              eventType: { value: x.eventType },
              title: x.observation,
              desc: intl.formatMessage({ id: "event" }),
              id: x.id,
              allDay: false,
              start: moment(x.date).utc().toDate(),
              end: moment(x.date).utc().toDate(),
              date: x.date ?? moment(x.date),
              idEnterprise: x.idEnterprise,
              users: x.users,
              observation: x.observation,
              repeat: x.repeat,
              notifications: x.notifications,
            };
          }
        });
        if (status === "next") {
          setEvents(
            maintenanceWindows.filter(
              (m) =>
                (!m.dateDoneInit &&
                  moment(m.datePlanEnd).isAfter(moment().utc().toDate())) ||
                (moment(m.dateWindowEnd).isAfter(moment().utc().toDate()) &&
                  !m.datePlanEnd) ||
                moment(m.date).isAfter(moment().utc().toDate())
            )
          );
        } else if (status === "late") {
          setEvents(
            maintenanceWindows.filter(
              (m) =>
                (!m.dateDoneEnd &&
                  (moment(m.datePlanEnd).isBefore(moment().utc().toDate()) ||
                    (moment(m.dateWindowEnd).isBefore(
                      moment().utc().toDate()
                    ) &&
                      !m.datePlanEnd))) ||
                moment(m.date).isBefore(moment().utc().toDate())
            )
          );
        } else {
          setEvents(maintenanceWindows);
        }
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
    let style = {
      borderRadius: "2px",
      border: "0px",
      display: "block",
      fontFamily: theme.fontFamilyPrimary,
      fontWeight: "500",
    };

    let color = theme.colorBasic500;
    const today = moment();
    if (event.eventType?.value === "teamChange") color = "#a000ff";
    else if (event.dateDoneInit) color = theme.colorSuccess500; // verde
    else if (event.datePlanInit) {
      if (moment(event.datePlanInit).isBefore(moment(today)))
        color = theme.colorDanger500; //vermelho
      else color = theme.colorBasic500; //cinza
    } else {
      if (moment(event.dateWindowEnd).isBefore(moment(today)))
        color = theme.colorDanger500; //vermelho
      else color = theme.colorInfo500; //azul
      style = {
        ...style,
        height: "16px",
        fontSize: "10px",
        lineHeight: "1",
      };
    }

    if (calendarRef?.current?.props?.view !== "agenda") {
      style = {
        ...style,
        backgroundColor: color,
        color: theme.textControlColor,
      };
    }

    return {
      style,
    };
  };

  const dayStyleGetter = (date, resourceId) => {
    let color = theme.backgroundBasicColor1;
    const today = moment();
    if (moment(date).isBefore(moment(today), "day"))
      color = theme.backgroundBasicColor3;
    else if (moment(date).isSame(moment(today), "day"))
      color = theme.colorPrimary400;

    return {
      style: {
        backgroundColor: color,
      },
    };
  };

  const onChangeFilter = (prop, value) => {
    if (prop === "clear") {
      filterRef.current = {};
      setIsShowFilter(false);
      findFetchEvents(moment().utc());
    } else {
      filterRef.current[prop] = value;
    }
  };

  const onFilter = () => {
    setIsShowFilter(false);
    findFetchEvents(moment(calendarRef.current?.props?.date).utc());
  };

  const localeForData = LANGUAGES.find((x) => x.locale === props.locale);
  if (localeForData) moment.locale(localeForData?.locale);
  const localizer = momentLocalizer(moment);

  return (
    <>
      <CardStyled className="mb-0">
        <CardBody>
          <Calendar
            ref={calendarRef}
            localizer={localizer}
            style={{
              height: "calc(100vh - 230px)",
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
            onSelectEvent={(event) => {
              if (hasPermissionEdit) setEventSelected(event);
            }}
            onNavigate={(newDate, view, action) => {
              findFetchEvents(
                moment(newDate).utc(),
                ["day", "agenda"].includes(view)
              );
            }}
            onView={(view) => {
              if (view === "month") {
                findFetchEvents(moment(calendarRef.current?.props?.date).utc());
              }
            }}
            components={useMemo(
              () => ({
                event: Event,
                toolbar: (props) => (
                  <ToolbarCalendar
                    {...props}
                    setEventSelected={setEventSelected}
                    setFilterShow={(value) => setIsShowFilter(value)}
                    isShowFilter={isShowFilter}
                    setShowView={() => setShowView(!showView)}
                  />
                ),
              }),
              [showView]
            )}
            views={["month", "week"]}
          />
        </CardBody>
      </CardStyled>
      {eventSelected && (
        <ModalEditEventSchedule
          event={eventSelected}
          idEnterprise={
            props.enterprises?.length ? props.enterprises[0].id : ""
          }
          onClose={() => setEventSelected(null)}
        />
      )}
      <ModalFilter
        show={isShowFilter}
        onClose={() => setIsShowFilter(false)}
        idEnterprise={props.enterprises?.length ? props.enterprises[0].id : ""}
        onChangeFilter={onChangeFilter}
        filterData={filterRef.current}
        onFilter={onFilter}
      />

      <ModalViewEvents
        show={showView}
        onClose={() => setShowView(false)}
        events={events}
      />

      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  locale: state.settings.locale,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(CalendarEvent);
