import React from "react";
import { EvaIcon } from "@paljs/ui";
import moment from "moment";
import { nanoid } from "nanoid";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../components";
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
  const { events } = props;

  const theme = useTheme();
  const intl = useIntl();

  const getIconInRoute = (type) => {
    if (type === "init_travel")
      return {
        name: "radio-button-on",
        color: theme.colorPrimary500,
        text: intl.formatMessage({ id: "departure" }),
      };

    if (type === "finish_travel")
      return {
        name: "flag",
        color: theme.colorSuccess500,
        text: intl.formatMessage({ id: "arrival" }),
      };

    if (type === "load")
      return {
        name: "cube",
        color: theme.colorInfo500,
        text: intl.formatMessage({ id: "load.active" }),
      };

    if (type === "fuel")
      return {
        name: "droplet",
        color: theme.colorPrimary900,
        text: intl.formatMessage({ id: "fill" }),
      };

      if (type === "other")
      return {
        name: "info-outline",
        color: theme.colorInfo700,
        text: intl.formatMessage({ id: "other" }),
      };

    return {
      name: "close",
      color: theme.colorDefault500,
      text: intl.formatMessage({ id: "default" }),
    };
  };

  const getTimeDifference = (start, end) => {
    if (!start && end) return {
      line1: moment(end).format("DD MMM HH:mm")
    }

    const dateStart = moment(start);
    if (!end) return {
      line1: dateStart.format("DD MMM HH:mm")
    }

    const dateEnd = moment(end);
    if (dateStart.isSame(dateEnd, "day")) {
      return {
        line1: `${dateStart.format("DD MMM")}, ${dateStart.format("HH:mm")} - ${dateEnd.format("HH:mm")}`,
        line2: `${intl.formatMessage({ id: "duration" })}: ${getDiffDateString(start, end, intl)}`
      }
    }

    return {
      line1: `${dateStart.format("DD MMM HH:mm")} - ${dateEnd.format("DD MMM HH:mm")}`,
      line2: `${intl.formatMessage({ id: "duration" })}: ${getDiffDateString(start, end, intl)}`
    };
  };


  const eventsGenerateSystemNormalized = () => {
    return (
      events?.map((x) => {
        const iconProps = getIconInRoute(
          x.type,
          x.geofenceStart
            ? x.geofenceStart?.type?.value
            : x.geofenceEnd?.type?.value
        );
        return {
          type: x.type.value,
          dateShow: getTimeDifference(x.dateTimeStart, x.dateTimeEnd),
          dateSort: x.dateTimeStart
            ? moment(x.dateTimeStart).toDate()
            : moment(x.dateTimeEnd).toDate(),
          description: x.description,
          iconProps,
          title: `${iconProps.text}${x.title ? ` ${x.title}` : ''}`,
        };
      }) || []
    );
  };

  const eventsSorted = eventsGenerateSystemNormalized().sort((a, b) => a.dateSort - b.dateSort);

  return (
    <>
      <div className="pt-2">
        <LabelIcon
          iconName={"list-outline"}
          title={<FormattedMessage id="events" />}
        />
        <div className="mt-2"></div>
        {eventsSorted?.map((x, i) => (
          <Item
            noLine={i === eventsSorted.length - 1}
            key={nanoid(5)}
            color={i === eventsSorted.length - 1 ? '' : eventsSorted[i+1].iconProps.color}
            className="pl-4 ml-2 pb-4"
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
                style={{ lineHeight: "13px", wordWrap: "break-word" }}
              >
                {x.dateShow?.line1}
              </TextSpan>
              {x.dateShow?.line2 && <TextSpan
                apparence="p3"
                className="mt-1"
                hint
                style={{ lineHeight: "13px", wordWrap: "break-word" }}
              >
                {x.dateShow?.line2}
              </TextSpan>}
            </div>
          </Item>
        ))}
      </div>
    </>
  );
}
