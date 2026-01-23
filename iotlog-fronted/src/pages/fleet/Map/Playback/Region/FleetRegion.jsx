
import React from 'react';
import { Fetch, SpinnerFull } from '../../../../../components';
import ControlMarkerRegion from './ControlMarkerRegion';
import PlayControl from './PlayControl';
import { connect } from 'react-redux';

const FleetRegion = (props) => {

  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useLayoutEffect(() => {
    if (props.isPlaybackRegion)
      getData();
    return () => {
      setData([])
    }
  }, [props.isPlaybackRegion])


  const getData = () => {
    setIsLoading(true);
    let query = []
    const idEnterpriseFilter = props.enterprises?.length
    ? props.enterprises[0].id
    : "";

    if (idEnterpriseFilter) {
      query.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    let hours = 5
    // if (idEnterpriseFilter === 'ce21881c-6c0d-41b4-ace2-b0d846398b84') {
    //   hours = 48
    // }

    query.push(`hours=${hours}`);

    Fetch.get(`/regiondata/playback?${query.join('&')}`)
      .then((response) => {
        setData((response.data?.length ? response.data : []).sort((a, b) => a[0] - b[1]));
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  if (!props.isPlaybackRegion) {
    return <></>
  }

  const isValueValid = (value) => value !== null && value !== undefined;

  const dataValid = data?.filter(x => isValueValid(x[1]) && x[1]?.length)

  return (
    <>
      <SpinnerFull isLoading={isLoading} />

      {!isLoading &&
        <>
          <PlayControl
            minDate={data?.length ? new Date(data[0][0]).getTime() : null}
            maxDate={data?.length ? new Date(data.slice(-1)[0][0]).getTime() : null}
          />
          <ControlMarkerRegion data={dataValid} />
        </>
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  isPlaybackRegion: state.map.isPlaybackRegion,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(FleetRegion);
