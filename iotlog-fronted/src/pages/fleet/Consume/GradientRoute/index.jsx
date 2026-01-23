import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { setEventsStatusConsume, setRouteConsumptionData } from "../../../../actions";
import { Fetch, SpinnerFull } from "../../../../components";
import LineRoute from "./LineRoute";
import { POSITION_DATA_CONSUME } from "../Constants";

const ConsumeGradientRoute = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (props.machineConsumptionSelected?.machine?.id) {
      getData({
        idMachine: props.machineConsumptionSelected.machine.id,
        filterRouter: props.filterRouter,
        hourPosition: props.hourPosition,
        interval: props.interval,
      });
    }
    return () => {
      props.setEventsStatusConsume([]);
      props.setRouteConsumptionData([], undefined)
    };
  }, [
    props.hourPosition,
    props.interval,
    props.machineConsumptionSelected,
    props.filterRouter,
  ]);

  const getData = ({ idMachine, filterRouter, hourPosition, interval }) => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/fleet/historyconsume/details?idMachine=${idMachine}${filterRouter?.min && filterRouter?.max
        ? `&min=${filterRouter?.min}&max=${filterRouter?.max}`
        : `&min=${moment().subtract(24, 'hours').format('YYYY-MM-DDTHH:mm:ss')}&max=${moment().format('YYYY-MM-DDTHH:mm:ss')}`
      }&interval=1`
    )
      .then((response) => {
        if (response.data?.states?.length) {
          const dataSortered = response.data?.states
            ?.filter((x) => x?.length
              && x[POSITION_DATA_CONSUME.LAT] !== null
              && x[POSITION_DATA_CONSUME.LON] !== null
              && x[POSITION_DATA_CONSUME.LAT] !== undefined
              && x[POSITION_DATA_CONSUME.LON] !== undefined);
          props.setRouteConsumptionData(dataSortered, response.data.sensors)
          props.setEventsStatusConsume(response.data?.events?.sort((a, b) => new Date(a.data?.dateTimeStart).getTime() - new Date(b.data?.dateTimeStart).getTime()))
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {!!props.machineConsumptionSelected && (
        <>
          {/* <ConsumeNormalizeDataGradient
            key={`route_consume_gr_${id}`}
            data={routeHistory}
            lastPosition={
              props?.lastMarker?.position ??
              getLatLonNormalize(routeHistory[0]?.position?.value)
            }
          /> */}
          <LineRoute
            key={`${props.machineConsumptionSelected?.machine?.id}-c-list`}
            machineConsumptionSelected={props.machineConsumptionSelected}
          />
        </>
      )}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  machineConsumptionSelected: state.fleet.machineConsumptionSelected,
  interval: state.map.router?.interval,
  hourPosition: state.map.router?.hourPosition,
  filterRouter: state.map.filterRouter,
  lastMarker: state.fleet.lastMarker,
});

const mapDispatchToProps = (dispatch) => ({
  setEventsStatusConsume: (events) => {
    dispatch(setEventsStatusConsume(events));
  },
  setRouteConsumptionData: (routeConsumption, sensors) => {
    dispatch(setRouteConsumptionData({ routeConsumption, sensors }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsumeGradientRoute);
