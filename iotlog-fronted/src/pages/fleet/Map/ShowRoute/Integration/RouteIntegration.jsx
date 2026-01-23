import React from 'react';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';
import GradientRoute from '../GradientRoute';
import TrackSimple from '../../../TrackSymbol/TrackSimple';
import { ChangeView } from '../../Utils';
import { SpinnerFull } from '../../../../../components';

function RouteIntegration(props) {

  const { routeIntegration, isLoadingRouteIntegration, vesselIntegration } = props;

  if (isLoadingRouteIntegration) {
    return <>
      <SpinnerFull isLoading={true} />
    </>;
  }

  if (vesselIntegration && routeIntegration?.length) {
    return <>
      <GradientRoute
        id={vesselIntegration?.imo || nanoid(4)}
        data={
          [
            ...(routeIntegration?.filter(x => x?.length)?.map(x => [x[2], x[1], x[0], x[3]]) || []),
            [new Date(vesselIntegration?.ais?.lastSeen).getTime() / 1000, vesselIntegration?.ais?.position?.latitude, vesselIntegration?.ais?.position?.longitude, vesselIntegration?.ais?.sog]
          ]
        }
      />
      <TrackSimple
        key={`${vesselIntegration?.imo || nanoid(4)}_tRak`}
        latitude={vesselIntegration?.ais?.position?.latitude}
        longitude={vesselIntegration?.ais?.position?.longitude}
        sog={vesselIntegration?.ais?.sog}
        cog={vesselIntegration?.ais?.cog}
        trueHeading={vesselIntegration?.ais?.heading}
        color="#FF0000"
      />
      <ChangeView zoom={8}
        key={`${vesselIntegration?.imo || nanoid(4)}_cV`}
        center={{
          lat: vesselIntegration?.ais?.position?.latitude,
          lng: vesselIntegration?.ais?.position?.longitude
        }} />
    </>
  }

  return <></>;
}

const mapStateToProps = (state) => ({
  routeIntegration: state.fleet.routeIntegration,
  vesselIntegration: state.fleet.vesselIntegration,
  isLoadingRouteIntegration: state.fleet.isLoadingRouteIntegration
});

export default connect(mapStateToProps, undefined)(RouteIntegration)
