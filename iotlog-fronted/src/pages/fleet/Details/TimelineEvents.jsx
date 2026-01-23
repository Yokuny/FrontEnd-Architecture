import React from "react";
import { EvaIcon } from "@paljs/ui";
import moment from "moment";
import { nanoid } from "nanoid";
import { useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { Fetch, TextSpan } from "../../../components";
import { IconBorder } from "../../../components/Icons/IconRounded";
import { getDiffDateString } from "../../travel/Utils";

const Item = styled.li`
  ${({ theme, color = "", noLine = false }) => css`
    ${!noLine
      ? `border-left: 2px solid ${color ?? theme.colorBasicFocusBorder};`
      : `border-left: 2px solid ${theme.backgroundBasicColor1};`}
  `}
  list-style: none;
`;

const ContainerIcon = styled.div`
  position: absolute;
  margin-left: -1.8rem;
`;

export default function TimeLineEvents(props) {
  const { events, idTravel } = props;

  const theme = useTheme();
  const intl = useIntl();

  const [eventsInRoute, setEventsInRoute] = React.useState();

  React.useLayoutEffect(() => {
    if (idTravel)
      getEventsAuto(idTravel);
    else {
      setEventsInRoute([])
    }
  }, [idTravel]);

  const getEventsAuto = (idTravel) => {
    if (idTravel) {
      Fetch.get(`/travel/events?idTravel=${idTravel}`)
        .then((response) => {
          setEventsInRoute(response.data?.length ? response.data : []);
        })
        .catch((e) => {
          setEventsInRoute([]);
        });
    }
  };

  const getIcon = (type) => {
    if (type === "technicalFailure")
      return {
        name: "close",
        color: theme.colorDanger500,
        bgColor: theme.colorDanger100,
        text: "technical.failure",
      };

    if (type === "speedReduction")
      return {
        name: "trending-down",
        color: theme.colorWarning500,
        bgColor: theme.colorWarning100,
        text: "speed.reduction",
      };

    if (type === "routeChange")
      return {
        name: "shuffle-2-outline",
        color: theme.colorWarning500,
        bgColor: theme.colorWarning100,
        text: "route.change",
      };

    if (type === "anchoring")
      return {
        name: "pin",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: "anchoring",
      };

    return {
      name: "close",
      color: theme.colorDefault500,
      bgColor: theme.colorDefault100,
      text: "default",
    };
  };

  const getIconInRoute = (type, typeFence) => {
    if (type === "init_travel")
      return {
        name: "radio-button-on",
        color: theme.colorPrimary500,
        bgColor: theme.colorPrimary100,
        text: intl.formatMessage({ id: "departure" }),
      };

    if (type === "finish_travel")
      return {
        name: "flag",
        color: theme.colorSuccess500,
        bgColor: theme.colorSuccess100,
        text: intl.formatMessage({ id: "arrival" }),
      };

    if (type === "geofence")
      return {
        name: "pin",
        color: theme.colorInfo500,
        bgColor: theme.colorInfo100,
        text: `${intl.formatMessage({ id: "fence" })} - ${typeFence ? intl.formatMessage({
          id: typeFence,
        }) : ''}`,
      };

    if (type === "maneuver")
      return {
        name: "sync",
        color: theme.colorBasic500,
        bgColor: theme.colorBasic100,
        text: intl.formatMessage({ id: "maneuver" }),
      };

    return {
      name: "close",
      color: theme.colorDefault500,
      bgColor: theme.colorDefault100,
      text: intl.formatMessage({ id: "default" }),
    };
  };

  const getTimeDifference = (start, end) => {
    if (!start && end) return moment(end).format("DD MMM HH:mm");

    const dateStart = moment(start);
    if (!end) return dateStart.format("DD MMM HH:mm");

    const dateEnd = moment(end);
    if (dateStart.isSame(dateEnd, "day")) {
      return `${dateStart.format("DD MMM")}, ${dateStart.format(
        "HH:mm"
      )} - ${dateEnd.format("HH:mm")} / ${intl.formatMessage({
        id: "duration",
      })}: ${getDiffDateString(start, end, intl)}`;
    }

    return `${dateStart.format("DD MMM HH:mm")} - ${dateEnd.format(
      "DD MMM HH:mm"
    )} / ${intl.formatMessage({ id: "duration" })}: ${getDiffDateString(
      start,
      end,
      intl
    )}`;
  };

  const eventsManualNormalized = () => {
    return (
      events?.map((x) => {
        const iconProps = getIcon(x.type.value);
        return {
          type: x.type.value,
          date: getTimeDifference(x.dateTimeStart, x.dateTimeEnd),
          dateSort: moment(x.dateTimeStart).toDate(),
          description: x.observation,
          iconProps,
          title: intl.formatMessage({ id: iconProps.text }),
        };
      }) || []
    );
  };

  const eventsGenerateSystemNormalized = () => {
    return (
      eventsInRoute?.map((x) => {
        const iconProps = getIconInRoute(
          x.type,
          x.geofenceStart
            ? x.geofenceStart?.type?.value
            : x.geofenceEnd?.type?.value
        );
        return {
          type: x.type.value,
          date: getTimeDifference(x.data?.dateTimeStart, x.data?.dateTimeEnd),
          dateSort: x.data?.dateTimeStart
            ? moment(x.data?.dateTimeStart).toDate()
            : moment(x.data?.dateTimeEnd).toDate(),
          description: x.geofenceStart
            ? `${x.geofenceStart?.code} - ${x.geofenceStart?.description}`
            : `${x.geofenceEnd?.code} - ${x.geofenceEnd?.description}`,
          iconProps,
          title: iconProps.text,
        };
      }) || []
    );
  };

  const eventsSorted = [
    ...eventsManualNormalized(),
    ...eventsGenerateSystemNormalized(),
  ].sort((a, b) => b.dateSort - a.dateSort);

  return (
    <>
      <div className="pt-4">
        {eventsSorted?.map((x, i) => (
          <Item
            noLine={i === eventsSorted?.length - 1}
            key={nanoid()}
            color={x.iconProps.color}
            className="pl-4 pb-4"
          >
            <ContainerIcon>
              <IconBorder
                borderColor={x.iconProps.color}
                color={x.iconProps.color}
                style={{ padding: 1 }}
              >
                <EvaIcon
                  name={x.iconProps.name}
                  options={{ width: 20, fill: "#fff" }}
                />
              </IconBorder>
            </ContainerIcon>
            <div className="col-flex pb-4 pl-2">
              <TextSpan
                apparence="c3"
                hint
                style={{ textTransform: "uppercase" }}
              >
                {x.title}
              </TextSpan>
              <TextSpan apparence="p2">{x.description}</TextSpan>
              <TextSpan
                apparence="p3"
                className="mt-1"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.date}
              </TextSpan>
            </div>
          </Item>
        ))}
      </div>
    </>
  );
}
