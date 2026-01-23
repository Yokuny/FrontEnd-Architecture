import React from 'react'
import { connect } from 'react-redux';
import PlayControl from '../../../../../components/Map/Control.Playback/PlayControl';
import RoutePlayback from './RoutePlayback';
import FilterOptions from '../../ShowRoute/FilterOptions';
import RouterOptions from '../../ShowRoute/RouterOptions';
import moment from 'moment';
import { Fetch } from '../../../../../components';

function PlayBackRoute(props) {

  const [routeHistory, setRouteHistory] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [min, setMin] = React.useState(null);
  const [max, setMax] = React.useState(null);

  React.useLayoutEffect(() => {
    setIsReady(true);
    return () => {
      setIsReady(false)
    }
  }, [])

  React.useEffect(() => {
    if (props.routeBackSelected?.machine?.id) {
      setRouteHistory([]);
    }
  }, [props.routeBackSelected?.machine?.id]);

  React.useLayoutEffect(() => {
    if (isReady)
      getData();
  }, [
    props.hourPosition,
    props.interval,
    props.routeBackSelected,
    props.filterRouter,
    isReady
  ]);


  React.useEffect(() => {
    if (routeHistory && routeHistory.length > 0) {
      const minTimestamp = routeHistory[0][0];
      const minDate = new Date(minTimestamp * 1000);
      const minTime = moment(minDate).format("HH:mm");
      setMin(`${moment(minDate).format("YYYY-MM-DD")}T${minTime || "00:00"}:00${moment(minDate).format("Z")}`);

      const maxTimestamp = routeHistory[routeHistory.length - 1][0];
      const maxDate = new Date(maxTimestamp * 1000);
      const maxTime = moment(maxDate).format("HH:mm");
      setMax(`${moment(maxDate).format("YYYY-MM-DD")}T${maxTime || "00:00"}:00${moment(maxDate).format("Z")}`);
    }
  }, [routeHistory]);

  const getData = () => {
    if (!props.routeBackSelected?.machine?.id) {
      return;
    }
    setIsLoading(true)
    Fetch.get(
      `/sensorstate/fleet/historyposition/details?idMachine=${props.routeBackSelected?.machine?.id
      }${props.filterRouter?.min && props.filterRouter?.max
        ? `&min=${props.filterRouter?.min}&max=${props.filterRouter?.max}`
        : `&hours=${props.hourPosition ?? 12}`
      }&interval=${(props.filterRouter?.interval || props.interval) || 1}`
    )
      .then((response) => {
        if (response.data?.length) {
          setRouteHistory(response.data?.sort((a, b) => a[0] - b[0]));
          const totalCoordinates = response.data?.length;
          const lastCoordinate = response.data[0]
          setIsLoading(false)
        }
      })
      .catch((e) => {
        setIsLoading(false)
      });
  };

  if (!props.routeBackSelected) {
    return <></>
  }

  return <>
    <RoutePlayback routeHistory={routeHistory} />
    <PlayControl min={min} max={max}/>
    <FilterOptions />
    <RouterOptions />
  </>
}

const mapStateToProps = (state) => ({
  routeBackSelected: state.fleet.routeBackSelected,
  playback: state.map.playback,
  filterRouter: state.map.filterRouter,
  interval: state.map.router?.interval,
  hourPosition: state.map.router?.hourPosition,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayBackRoute);
