import { DivIcon } from "leaflet";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";
import { nanoid } from 'nanoid';
import { useTheme } from "styled-components";
import { setRouterIsLoading } from "../../../../../actions";
import { TextSpan } from "../../../../../components";
import { Fetch } from "../../../../../components/Fetch";
import {
  getLatLonNormalize,
  formatDateDiff,
  normalizeDataPosition,
} from "../../../../../components/Utils";
import RoutingMachine from "./../RoutingMachine";

const normalizeRoute = (sensorStates) => {
  return normalizeDataPosition(sensorStates)?.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
};

const TruckRoute = (props) => {
  const theme = useTheme();
  const intl = useIntl();

  const [data, setData] = React.useState();

  React.useEffect(() => {
    getData();
  }, [
    props.hourPosition,
    props.interval,
    props.machineDetailsSelected,
    props.filterRouter,
  ]);

  const getData = () => {
    props.setRouterIsLoading(true);
    Fetch.get(
      `/sensorstate/fleet/routehistory?idMachine=${
        props.machineDetailsSelected.machine.id
      }${
        props.filterRouter?.max && props.filterRouter?.min
          ? `&min=${props.filterRouter.min}&max=${props.filterRouter.max}`
          : `&hours=${props.hourPosition}`
      }&interval=${props.filterRouter?.interval || props.interval}`
    )
      .then((response) => {
        setData(response.data);
        props.setRouterIsLoading(false);
      })
      .catch((e) => {
        props.setRouterIsLoading(false);
      });
  };

  const routeHistory = data?.length ? normalizeRoute(data) : [];

  return (
    <>
     {!!routeHistory?.length && <RoutingMachine
        key={nanoid()}
        dataPoints={routeHistory?.map((x) => ({
          date: x.date,
          latLon: x.position,
        }))}
        color={
          props.machineDetailsSelected?.modelMachine?.color ??
          theme.colorPrimary500
        }
      />}

      {props.isShowPoints && (
        <>
          {routeHistory
            ?.filter((x, i) => i > 0)
            ?.map((x, i) => (
              <Marker
                key={`po_li_tr_${x.idMachine}_${i}`}
                position={getLatLonNormalize(x.position)}
                icon={
                  new DivIcon({
                    className: "leaflet-div-icon-img adjust-pin-start",
                    iconSize: [21,21],
                    html: `<svg fill="#fff" style="background-color:${
                      props.machineDetailsSelected?.modelMachine?.color
                        ? props.machineDetailsSelected?.modelMachine?.color
                        : theme.colorDanger700
                    };display: flex;padding: 2px;border-radius: 50%;" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="radio"><rect width="24" height="24" opacity="0"/><path d="M12 8a3 3 0 0 0-1 5.83 1 1 0 0 0 0 .17v6a1 1 0 0 0 2 0v-6a1 1 0 0 0 0-.17A3 3 0 0 0 12 8zm0 4a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"/><path d="M3.5 11a6.87 6.87 0 0 1 2.64-5.23 1 1 0 1 0-1.28-1.54A8.84 8.84 0 0 0 1.5 11a8.84 8.84 0 0 0 3.36 6.77 1 1 0 1 0 1.28-1.54A6.87 6.87 0 0 1 3.5 11z"/><path d="M16.64 6.24a1 1 0 0 0-1.28 1.52A4.28 4.28 0 0 1 17 11a4.28 4.28 0 0 1-1.64 3.24A1 1 0 0 0 16 16a1 1 0 0 0 .64-.24A6.2 6.2 0 0 0 19 11a6.2 6.2 0 0 0-2.36-4.76z"/><path d="M8.76 6.36a1 1 0 0 0-1.4-.12A6.2 6.2 0 0 0 5 11a6.2 6.2 0 0 0 2.36 4.76 1 1 0 0 0 1.4-.12 1 1 0 0 0-.12-1.4A4.28 4.28 0 0 1 7 11a4.28 4.28 0 0 1 1.64-3.24 1 1 0 0 0 .12-1.4z"/><path d="M19.14 4.23a1 1 0 1 0-1.28 1.54A6.87 6.87 0 0 1 20.5 11a6.87 6.87 0 0 1-2.64 5.23 1 1 0 0 0 1.28 1.54A8.84 8.84 0 0 0 22.5 11a8.84 8.84 0 0 0-3.36-6.77z"/></g></g></svg>`,
                  })
                }
              >
                <Popup>
                  <TextSpan apparence="s2">
                    {formatDateDiff(x.date, intl)}
                  </TextSpan>
                  <br />
                  <TextSpan apparence="p2">
                    {moment(x.date).format("DD MMM / HH:mm:ss")}
                  </TextSpan>
                </Popup>
              </Marker>
            ))}
        </>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  isShowPoints: state.map.isShowPoints,
  interval: state.map.router.interval,
  hourPosition: state.map.router.hourPosition,
  filterRouter: state.map.filterRouter,
});

const mapDispatchToProps = (dispatch) => ({
  setRouterIsLoading: (isLoading) => {
    dispatch(setRouterIsLoading(isLoading));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TruckRoute);
