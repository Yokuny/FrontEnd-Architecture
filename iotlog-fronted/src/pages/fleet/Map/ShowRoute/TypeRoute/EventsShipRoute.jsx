import { Polyline } from "react-leaflet";
import { useTheme } from "styled-components";
import { isPositionValid } from "../../../../../components/Utils";

const EventsShipRoute = (props) => {
  const theme = useTheme();
  const { routeHistory, eventTimelineSelect } = props;

  const positionsFiltered = routeHistory
    ?.filter((x) =>
      eventTimelineSelect.data?.dateTimeEnd
        ? x[0] >=
            new Date(eventTimelineSelect.data?.dateTimeStart).getTime() / 1000 &&
          x[0] <=
            new Date(eventTimelineSelect.data?.dateTimeEnd).getTime() / 1000
        : x[0] >=
          new Date(eventTimelineSelect.data?.dateTimeStart).getTime() / 1000
    )
    ?.map((x) => [x[1],x[2]])
    ?.filter(x => isPositionValid(x));

  return (
    <>
      <Polyline
        positions={positionsFiltered}
        color={theme.colorPrimary600}
        dashArray={"10,10"}
        lineCap="square"
      />
    </>
  );
};

export default EventsShipRoute;
