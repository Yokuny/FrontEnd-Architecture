import React from "react";
import moment from "moment";
import { nanoid } from "nanoid";
import styled, { css, useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { Fetch, TextSpan } from "../../../../../components";
import { IconBorder } from "../../../../../components/Icons/IconRounded";
import { getIcon, getIconInRoute } from "./IconTimelineStatus";
import { DateTimeDifference } from "./DateTimeDifference";
import LoadingTimeline from "./LoadingTimeline";
import { TYPE_TRAVEL_STATUS } from "../../../../../constants";
import { setTimelineSelected } from "../../../../../actions";
import { connect } from "react-redux";

const Item = styled.li`
  ${({ theme, isSelected = false, color = "", noLine = false }) => css`
    ${!noLine
      ? `border-left: 2px solid ${color ?? theme.colorBasicFocusBorder};`
      : `border-left: 2px solid ${theme.backgroundBasicColor1};`}
    ${isSelected && ` background-color: ${theme.backgroundBasicColor2}; `}
  `}
  list-style: none;
  cursor: pointer;
`;

const ContainerIcon = styled.div`
  position: absolute;
  margin-left: -1.8rem;
`;

const statusInitAndEnd = [
  TYPE_TRAVEL_STATUS.FINISH_TRAVEL,
  TYPE_TRAVEL_STATUS.INIT_TRAVEL,
];

const TimelineTravelStatus = (props) => {
  const { idMachine, idTravel, dateMin, dateMax } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const theme = useTheme();
  const intl = useIntl();

  React.useEffect(() => {
    if (idMachine && idTravel) getData(idMachine, idTravel);
    else setData([]);
  }, [idMachine, idTravel]);

  const getData = (idMachine, idTravel) => {
    setIsLoading(true);
    let travelDetailByDatesURI = `/machineevent/timelinebydate?idMachine=${idMachine}&idTravel=${idTravel}&min=${moment(
      dateMin
    ).format("YYYY-MM-DDTHH:mm:00Z")}`;

    if (dateMax)
      travelDetailByDatesURI = `${travelDetailByDatesURI}&max=${moment(
        dateMax
      ).format("YYYY-MM-DDTHH:mm:00Z")}`;

    Fetch.get(travelDetailByDatesURI)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const renderGeofence = (geofence) => {
    return (
      <TextSpan apparence="s2">{`${geofence.description} ${
        geofence.code ? `(${geofence.code})` : ""
      }`}</TextSpan>
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingTimeline />
      ) : (
        <div className="pt-4 ml-2 mt-2">
          {data?.map((x, i) => {
            const isStatusInRoute = statusInitAndEnd.includes(x.type);

            const iconProps = isStatusInRoute
              ? getIconInRoute(x.type, theme)
              : getIcon(x.data?.status, theme);

            const isSelected = x?.id === props?.eventTimelineSelect?.id;

            return (
              <Item
                noLine={i === data?.length - 1}
                key={nanoid(5)}
                color={iconProps.bgColor}
                className="pl-4 pb-4"
                isSelected={isSelected}
                onClick={() =>
                  props.setTimelineSelected(isSelected ? undefined : x)
                }
              >
                <ContainerIcon>
                  <IconBorder
                    borderColor={iconProps.bgColor}
                    color={iconProps.bgColor}
                    style={{ padding: 1 }}
                  >
                    {iconProps.component}
                  </IconBorder>
                </ContainerIcon>
                <div className="col-flex pb-4 pl-2">
                  <TextSpan
                    apparence="c3"
                    hint
                    style={{ textTransform: "uppercase" }}
                  >
                    {intl.formatMessage({ id: iconProps.text })}
                  </TextSpan>
                  {x.geofence && renderGeofence(x)}
                  {x.geofenceStart && renderGeofence(x.geofenceStart)}
                  {x.geofenceEnd && renderGeofence(x.geofenceEnd)}
                  {x.platform && (
                    <TextSpan apparence="s2">{`${x.platform.name} ${
                      x.platform.acronym ? `(${x.platform.acronym})` : ""
                    }`}</TextSpan>
                  )}
                  <DateTimeDifference
                    start={x.data?.dateTimeStart}
                    end={x.data?.dateTimeEnd}
                  />
                </div>
              </Item>
            );
          })}
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  eventTimelineSelect: state.fleet.eventTimelineSelect,
});

const mapDispatchToProps = (dispatch) => ({
  setTimelineSelected: (eventTimelineSelect) => {
    dispatch(setTimelineSelected(eventTimelineSelect))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineTravelStatus);
